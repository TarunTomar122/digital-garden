"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type EmbeddingsData = {
  model: string;
  embeddings: number[][];
  texts: string[];
  embed_texts?: string[];
  metadata: Record<string, unknown>[];
  count: number;
  domain?: string;
};

type SearchResult = { index: number; score: number };

type Domain = "projects" | "writings" | "books" | "list100" | "experience";

export default function TaratAIPage() {
  const [embeddings, setEmbeddings] = useState<Float32Array[] | null>(null);
  const [embeddingsNorm, setEmbeddingsNorm] = useState<Float32Array | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, unknown>[]>([]);
  const [loadedDomain, setLoadedDomain] = useState<Domain | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [modelReady, setModelReady] = useState(false);
  const [bottomSpacer, setBottomSpacer] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestQuestionRef = useRef<HTMLDivElement>(null);

  type FeatureExtractor = (
    q: string,
    opts?: { pooling?: "mean" | "cls" | "none"; normalize?: boolean }
  ) => Promise<{ data: Float32Array } | Array<{ data: Float32Array }>>;
  const extractorRef = useRef<FeatureExtractor | null>(null);

  const loadEmbeddingsFor = useMemo(() => {
    return async (domain: Domain) => {
      const res = await fetch(`/embeddings-${domain}.json`, { cache: "no-store" });
      const data: EmbeddingsData = await res.json();

      const embs: Float32Array[] = data.embeddings.map((row) => new Float32Array(row));
      const norms = new Float32Array(embs.length);
      for (let i = 0; i < embs.length; i++) {
        let sum = 0; const v = embs[i];
        for (let j = 0; j < v.length; j++) sum += v[j] * v[j];
        norms[i] = Math.sqrt(sum) || 1;
      }

      setEmbeddings(embs);
      setEmbeddingsNorm(norms);
      setTexts(data.texts);
      setMetadata(data.metadata);
      setLoadedDomain((data.domain as Domain) ?? domain);

      return { embs, norms, texts: data.texts, metadata: data.metadata } as const;
    };
  }, []);

  const loadModel = useMemo(() => {
    return async () => {
      if (extractorRef.current) return extractorRef.current;
      setModelLoading(true);
      try {
        const { pipeline, env } = await import("@xenova/transformers");
        
        // Configure the environment for browser usage
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        
        const extractor = (await pipeline("feature-extraction", "Xenova/all-mpnet-base-v2", { 
          quantized: true,
          progress_callback: (progress: { status: string }) => {
            console.log("Progress:", progress.status);
          }
        })) as unknown as FeatureExtractor;
        
        extractorRef.current = extractor;
        setModelLoading(false);
        setModelReady(true);
        return extractor;
      } catch (err) {
        console.error("Error in loadModel:", err);
        setModelLoading(false);
        throw err;
      }
    };
  }, []);

  useEffect(() => { 
    loadModel().catch((err) => {
      console.error("Model loading failed:", err);
      setError("Failed to load the embedding model. Please refresh the page.");
      setModelLoading(false);
    }); 
  }, [loadModel]);

  // Auto-scroll to latest question (user messages only)
  const scrollToLatestQuestion = useCallback(() => {
    const el = latestQuestionRef.current;
    if (!el) return;
    // Prefer anchoring to the question text itself for pixel-perfect alignment
    const anchor = el.querySelector('[data-question-anchor="true"]') as HTMLElement | null;
    const rect = (anchor ?? el).getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset;
    const sticky = document.getElementById("top-nav");
    const navHeight = sticky?.offsetHeight ?? 0;
    const style = window.getComputedStyle(anchor ?? el);
    const marginTop = parseFloat(style.marginTop) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const extraOffset = 8; // small nudge
    const targetTop = rect.top + currentScrollY - navHeight - marginTop - paddingTop - extraOffset;

    // Ensure there is enough scrollable space to place the element at the top
    const docEl = document.documentElement;
    const docHeight = Math.max(docEl.scrollHeight, document.body.scrollHeight);
    const maxScroll = docHeight - window.innerHeight;
    if (targetTop > maxScroll) {
      const needed = Math.ceil(targetTop - maxScroll) + 1;
      // Expand bottom spacer then scroll on next frame
      setBottomSpacer((h) => Math.max(h, needed));
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      });
    } else {
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        // Longer delay to ensure DOM is fully updated
        setTimeout(() => {
          scrollToLatestQuestion();
        }, 300);
      }
    }
  }, [messages, scrollToLatestQuestion]);

  const computeQueryEmbedding = useCallback(async (query: string): Promise<Float32Array> => {
    const extractor = await loadModel();
    const output = await extractor(query, { pooling: "mean", normalize: true });
    const arr = (Array.isArray(output) ? output[0]?.data : (output as { data: Float32Array })?.data) as Float32Array;
    return arr instanceof Float32Array ? arr : new Float32Array(arr);
  }, [loadModel]);

  const cosineTopKWith = (
    embs: Float32Array[],
    norms: Float32Array,
    queryVec: Float32Array,
    topK = 5
  ): SearchResult[] => {
    const q = queryVec; let qnorm = 0; for (let i = 0; i < q.length; i++) qnorm += q[i] * q[i]; qnorm = Math.sqrt(qnorm) || 1;
    const scores: SearchResult[] = [];
    for (let i = 0; i < embs.length; i++) {
      const v = embs[i]; let dot = 0; for (let j = 0; j < v.length; j++) dot += v[j] * q[j];
      const score = dot / (norms[i] * qnorm);
      if (scores.length < topK) { scores.push({ index: i, score }); if (scores.length === topK) scores.sort((a, b) => b.score - a.score); }
      else if (score > scores[topK - 1].score) { scores[topK - 1] = { index: i, score }; scores.sort((a, b) => b.score - a.score); }
    }
    return scores;
  };

  const classifyDomain = (q: string): Domain => {
    const s = q.toLowerCase();
    if (/(experience|resume|cv|work history|career|job|role|employer|company|current|working|work at|where.*work|adobe|astu|design engineer|core tech)/.test(s)) return "experience";
    if (/(book|read|author|novel|fiction|nonfiction|rating|library)/.test(s)) return "books";
    if (/(project|build|code|github|repo|implementation|tool|app)/.test(s)) return "projects";
    if (/(goal|list|bucket|life|plan|achieve|learn|travel)/.test(s)) return "list100";
    return "writings";
  };

  const onSubmit = useCallback(async (override?: string) => {
    setError(null);
    const textToAsk = (override ?? input).trim();
    if (!textToAsk) return;
    try {
      setInput("");
      setLoading(true);
      const userMsg = textToAsk;
      setMessages((m) => [...m, { role: "user", content: userMsg }]);
      // Ensure the new question scrolls into view at the top immediately after render
      // Double rAF waits for React to commit and the browser to layout before measuring
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToLatestQuestion();
          });
        });
      }, 0);
      const d: Domain = classifyDomain(userMsg);
      let E = embeddings; let N = embeddingsNorm;
      if (loadedDomain !== d || !E || !N) { const loaded = await loadEmbeddingsFor(d); E = loaded.embs; N = loaded.norms; }
      if (!E || !N) throw new Error("Embeddings not loaded yet");
      const qvec = await computeQueryEmbedding(userMsg);
      const top = cosineTopKWith(E, N, qvec, 5);

      const k = Math.min(3, top.length);
      const currentTexts = (loadedDomain === d ? texts : (await loadEmbeddingsFor(d)).texts);
      const currentMeta = (loadedDomain === d ? metadata : (await loadEmbeddingsFor(d)).metadata);
      const contexts = Array.from({ length: k }).map((_, i) => ({ text: currentTexts[top[i].index], meta: currentMeta[top[i].index] }));

      const res = await fetch("/api/tarat-ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: userMsg, contexts }) });
      const text = await res.text();
      setMessages((m) => [...m, { role: "assistant", content: text }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Search failed";
      setError(msg);
    } finally { setLoading(false); }
  }, [input, embeddings, embeddingsNorm, loadedDomain, texts, metadata, loadEmbeddingsFor, computeQueryEmbedding, scrollToLatestQuestion]);

  // (Removed URL bootstrap: no longer auto-submitting from query params)

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  };

  return (
    <div className="raw-doc-inner" style={{ paddingBottom: "96px" }}>
        {messages.length == 0 && (
            <main>
              <article className="prose prose-neutral max-w-none
                prose-headings:text-[#222] prose-strong:text-[#222] prose-em:text-[#222]
                prose-p:text-[#333] prose-li:text-[#333] prose-a:text-[#1a5fb4]
                prose-blockquote:text-[#555] prose-blockquote:border-[#ccc] prose-hr:border-[#eee]
                prose-pre:bg-[#f5f5f5] prose-pre:text-[#222] prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-[#eee] prose-pre:overflow-x-auto prose-pre:font-mono">
                  <h1>Talk to Tarat&apos;s AI</h1>
                  <p className="note">Ask it anything about my work, projects, books, or life.</p>
                  <p className="note">Note: It&apos;s an AI so don&apos;t hold me accountable for its answers.</p>
                  <div className="not-prose" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                    {[
                      "Why should we hire you?",
                      "What are your best ML related projects?",
                      "What kind of books do you like?",
                      "How was your NYC trip?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { void onSubmit(q); }}
                        style={{ textAlign: "left", width: "100%", border: "1px solid #eee", borderRadius: "6px", background: "none", padding: "8px 12px", fontSize: "14px", cursor: "pointer", color: "#222" }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </article>
            </main>
        )}
        {modelLoading && (
          <div className="left-1/2 top-16 z-50">
            <div style={{ border: "1px solid #eee", borderRadius: "6px", background: "#fff", padding: "8px 12px" }}>
              <div className="flex items-center space-x-2" style={{ color: "#5f5f5f" }}>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Loading the embedding model…</span>
              </div>
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          if (m.role === "user") {
            // Show user question as article header
            // Find the last user message index
            const lastUserMessageIndex = messages.map((msg, idx) => msg.role === 'user' ? idx : -1).filter(idx => idx !== -1).pop();
            const isLatestQuestion = i === lastUserMessageIndex;
            return (
              <main key={i} style={{ padding: "32px 0", borderBottom: "1px solid #eee" }} ref={isLatestQuestion ? latestQuestionRef : null}>
                <article className="prose prose-neutral max-w-none
                  prose-headings:text-[#222] prose-strong:text-[#222] prose-em:text-[#222]
                  prose-p:text-[#333] prose-li:text-[#333] prose-a:text-[#1a5fb4]
                  prose-blockquote:text-[#555] prose-blockquote:border-[#ccc] prose-hr:border-[#eee]
                  prose-pre:bg-[#f5f5f5] prose-pre:text-[#222] prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-[#eee] prose-pre:overflow-x-auto prose-pre:font-mono">
                  <h1 data-question-anchor="true" style={{ marginTop: 0 }}>{m.content}</h1>
                </article>
              </main>
            );
          } else {
            // Show AI response with same styling as writings/projects
            return (
              <main key={i}>
                <article className="prose prose-neutral max-w-none
                  prose-headings:text-[#222] prose-strong:text-[#222] prose-em:text-[#222]
                  prose-p:text-[#333] prose-li:text-[#333] prose-a:text-[#1a5fb4]
                  prose-blockquote:text-[#555] prose-blockquote:border-[#ccc] prose-hr:border-[#eee]
                  prose-pre:bg-[#f5f5f5] prose-pre:text-[#222] prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-[#eee] prose-pre:overflow-x-auto prose-pre:font-mono">
                  <div dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(m.content) }} />
                </article>
              </main>
            );
          }
        })}
        {loading && (
          <main>
            <article className="prose prose-neutral max-w-none
              prose-headings:text-[#222] prose-strong:text-[#222] prose-em:text-[#222]
              prose-p:text-[#333] prose-li:text-[#333] prose-a:text-[#1a5fb4]
              prose-blockquote:text-[#555] prose-blockquote:border-[#ccc] prose-hr:border-[#eee]
              prose-pre:bg-[#f5f5f5] prose-pre:text-[#222] prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-[#eee] prose-pre:overflow-x-auto prose-pre:font-mono">
              <div className="flex items-center space-x-1" style={{ color: "#5f5f5f" }}>
                <span>Thinking</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </article>
          </main>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div ref={messagesEndRef} />
        {/* Dynamic bottom spacer to allow placing latest question at top */}
        <div style={{ height: bottomSpacer }} />

        <div data-composer="true" className="fixed inset-x-0 bottom-0" style={{ maxWidth: "640px", margin: "0 auto", padding: "24px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
            <div style={{ position: "relative" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Why should we hire you?"
                style={{ width: "100%", border: "1px solid #ccc", borderRadius: "6px", paddingRight: "56px", padding: "12px 56px 12px 12px", minHeight: "48px", maxHeight: "160px", overflowY: "auto", fontFamily: "inherit" }}
              />
              <button
                onClick={() => { void onSubmit(); }}
                disabled={loading || modelLoading || !modelReady}
                style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", padding: "4px 8px", background: "none", border: "none", cursor: "pointer", opacity: loading || modelLoading || !modelReady ? 0.4 : 1, color: "#222" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                </svg>
              </button>
          
          </div>
        </div>
    </div>
  );
}

function simpleMarkdownToHtml(text: string): string {
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  // Headers
  html = html.replace(/^####\s?(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s?(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s?(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s?(.*)$/gm, '<h1>$1</h1>');
  
  // Code blocks (triple backticks)
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```\w*\n?/g, '').trim();
    return `<pre><code>${code}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Lists
  html = html.replace(/^\s*[-\u2022*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  
  // Numbered lists
  html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>');
  
  // Blockquotes
  html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  
  // Line breaks (double space at end of line or double newline)
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Wrap remaining text in paragraphs
  html = html.replace(/^(?!<h\d|<ul|<ol|<li|<\/li|<\/ul|<\/ol|<pre|<\/pre|<blockquote|<hr)(.+)$/gm, '<p>$1</p>');
  
  // Clean up multiple consecutive paragraph tags
  html = html.replace(/<\/p>\s*<p>/g, '</p><p>');
  
  return html;
}


