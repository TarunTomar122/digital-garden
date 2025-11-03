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
      const { pipeline } = await import("@xenova/transformers");
      const extractor = (await pipeline("feature-extraction", "Xenova/all-mpnet-base-v2", { quantized: true })) as unknown as FeatureExtractor;
      extractorRef.current = extractor;
      setModelLoading(false);
      setModelReady(true);
      return extractor;
    };
  }, []);

  useEffect(() => { loadModel().catch(() => {}); }, [loadModel]);

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
    <div className="mx-auto max-w-3xl px-4 py-16 pb-24 space-y-8">
        {messages.length == 0 && (
            <main>
              <article className="prose max-w-none w-full prose-neutral dark:prose-invert
                prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
                prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground
                prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
                prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
                  <p className="font-display text-4xl">Talk to Tarat&apos;s AI...</p>
                  <p className="text-muted">Ask it anything about my work, projects, books, or life.</p>
                  <p className="text-muted">Note: It&apos;s an AI so don&apos;t hold me accountable for its answers.</p>
                  <div className="not-prose mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-black">
                    {[
                      "Why should we hire you?",
                      "What kind of books do you like?",
                      "What's your best sideproject?",
                      "How was your NYC trip?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { void onSubmit(q); }}
                        className="text-left w-full rounded-md border border-muted/40 bg-background/70 hover:bg-accent/30 px-3 py-2 text-sm"
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
            <div className="rounded-md border border-muted/30 bg-background/90 backdrop-blur px-3 py-2 shadow">
              <div className="flex items-center space-x-2 text-muted-foreground">
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
              <main key={i} className="py-8 border-b border-muted/20" ref={isLatestQuestion ? latestQuestionRef : null}>
                <article className="prose max-w-none w-full prose-neutral dark:prose-invert
                  prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
                  prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground
                  prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
                  prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
                  <p data-question-anchor="true" className="font-display text-4xl mt-0">{m.content}</p>
                </article>
              </main>
            );
          } else {
            // Show AI response with same styling as writings/projects
            return (
              <main key={i}>
                <article className="prose max-w-none w-full prose-neutral dark:prose-invert
                  prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
                  prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground
                  prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
                  prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
                  <div dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(m.content) }} />
                </article>
              </main>
            );
          }
        })}
        {loading && (
          <main>
            <article className="prose max-w-none w-full prose-neutral dark:prose-invert
              prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
              prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground
              prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
              prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
              <div className="flex items-center space-x-1 text-muted-foreground">
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

        <div data-composer="true" className="fixed inset-x-0 max-w-3xl mx-auto py-6 bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Why should we hire you?"
                className="w-full border pr-20 p-3 min-h-12 max-h-40 overflow-y-auto active:outline-gray-700 focus:outline-gray-700"
              />
              <button
                onClick={() => { void onSubmit(); }}
                disabled={loading || modelLoading || !modelReady}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm hover:bg-accent disabled:opacity-50 active:outline-background/150 focus:outline-background/150"
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
  html = html.replace(/^###\s?(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s?(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s?(.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^\s*[-\u2022]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[^<]*<\/li>)(\n<li>[^<]*<\/li>)*?/g, (m) => `<ul>${m}</ul>`);
  html = html.replace(/^(?!<h\d|<ul|<li|<\/li|<\/ul)(.+)$/gm, '<p>$1</p>');
  return html;
}


