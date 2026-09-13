"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";

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

type Domain = "projects" | "writings" | "books" | "list100" | "experience" | "site";

type DomainData = {
  embs: Float32Array[];
  norms: Float32Array;
  texts: string[];
  metadata: Record<string, unknown>[];
};

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
  const siteDataRef = useRef<DomainData | null>(null);

  type FeatureExtractor = (
    q: string,
    opts?: { pooling?: "mean" | "cls" | "none"; normalize?: boolean }
  ) => Promise<{ data: Float32Array } | Array<{ data: Float32Array }>>;
  const extractorRef = useRef<FeatureExtractor | null>(null);

  const fetchDomainData = useMemo(() => {
    return async (domain: Domain): Promise<DomainData> => {
      const res = await fetch(`/embeddings-${domain}.json`, { cache: "no-store" });
      const data: EmbeddingsData = await res.json();

      const embs: Float32Array[] = data.embeddings.map((row) => new Float32Array(row));
      const norms = new Float32Array(embs.length);
      for (let i = 0; i < embs.length; i++) {
        let sum = 0; const v = embs[i];
        for (let j = 0; j < v.length; j++) sum += v[j] * v[j];
        norms[i] = Math.sqrt(sum) || 1;
      }

      return {
        embs,
        norms,
        texts: data.texts,
        metadata: data.metadata,
      };
    };
  }, []);

  const loadEmbeddingsFor = useMemo(() => {
    return async (domain: Domain) => {
      const data = await fetchDomainData(domain);

      setEmbeddings(data.embs);
      setEmbeddingsNorm(data.norms);
      setTexts(data.texts);
      setMetadata(data.metadata);
      setLoadedDomain(domain);

      return data;
    };
  }, [fetchDomainData]);

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
    if (/(experience|resume|cv|work history|career|job|role|employer|company|current|working|work at|where.*work|adobe|astu|design engineer|core tech|these days|doing now|what are you doing|nowadays|studying|student|uni|university)/.test(s)) return "experience";
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

      // Load the classified domain (reuse what's already in memory).
      let primary: DomainData;
      if (loadedDomain === d && embeddings && embeddingsNorm) {
        primary = {
          embs: embeddings,
          norms: embeddingsNorm,
          texts,
          metadata,
        };
      } else {
        primary = await loadEmbeddingsFor(d);
      }

      const qvec = await computeQueryEmbedding(userMsg);

      // Always ground answers with the site summary (llms.txt), loaded once.
      if (!siteDataRef.current) {
        try {
          siteDataRef.current = await fetchDomainData("site");
        } catch {
          siteDataRef.current = null;
        }
      }
      const site = siteDataRef.current;
      const siteTop = site
        ? cosineTopKWith(site.embs, site.norms, qvec, 2)
        : [];

      const top = cosineTopKWith(primary.embs, primary.norms, qvec, 3);

      const contexts = [
        ...siteTop.map((r) => ({
          text: site!.texts[r.index],
          meta: site!.metadata[r.index],
        })),
        ...top.map((r) => ({
          text: primary.texts[r.index],
          meta: primary.metadata[r.index],
        })),
      ];

      const res = await fetch("/api/tarat-ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: userMsg, contexts }) });
      const text = await res.text();
      setMessages((m) => [...m, { role: "assistant", content: text }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Search failed";
      setError(msg);
    } finally { setLoading(false); }
  }, [input, embeddings, embeddingsNorm, loadedDomain, texts, metadata, loadEmbeddingsFor, fetchDomainData, computeQueryEmbedding, scrollToLatestQuestion]);

  // (Removed URL bootstrap: no longer auto-submitting from query params)

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  };

  return (
    <div className="raw-doc-inner" style={{ paddingBottom: "140px" }}>
        {messages.length == 0 && (
            <main className="animate-in">
              <header className="page-head">
                <p className="page-kicker">Experiment</p>
                <h1>Talk to Tarat&apos;s AI</h1>
                <p className="note">
                  Ask it anything about my work, projects, books, or life.
                </p>
                <p className="note">
                  It&apos;s an AI, so don&apos;t hold me accountable for its
                  answers.
                </p>
              </header>
              <div className="suggest-grid">
                {[
                  "Why should we hire you?",
                  "What are your best ML related projects?",
                  "What kind of books do you like?",
                  "How was your NYC trip?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { void onSubmit(q); }}
                    className="suggest-card"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </main>
        )}
        {modelLoading && (
          <div className="model-loading">
            <span className="thinking">
              <span className="thinking-dots" aria-hidden="true">
                <span className="dot" style={{ animationDelay: "0ms" }} />
                <span className="dot" style={{ animationDelay: "150ms" }} />
                <span className="dot" style={{ animationDelay: "300ms" }} />
              </span>
              Loading the embedding model…
            </span>
          </div>
        )}
        {messages.map((m, i) => {
          if (m.role === "user") {
            // Show user question as article header
            // Find the last user message index
            const lastUserMessageIndex = messages.map((msg, idx) => msg.role === 'user' ? idx : -1).filter(idx => idx !== -1).pop();
            const isLatestQuestion = i === lastUserMessageIndex;
            return (
              <main key={i} className="chat-turn" ref={isLatestQuestion ? latestQuestionRef : null}>
                <p className="chat-question-label">You asked</p>
                <h2 className="chat-question-text" data-question-anchor="true">
                  {m.content}
                </h2>
              </main>
            );
          } else {
            // Show AI response with same styling as writings/projects
            return (
              <main key={i} className="chat-turn">
                <div
                  className="prose-garden chat-answer"
                  dangerouslySetInnerHTML={{ __html: renderAnswer(m.content) }}
                />
              </main>
            );
          }
        })}
        {loading && (
          <main className="chat-turn">
            <span className="thinking">
              <span>Thinking</span>
              <span className="thinking-dots" aria-hidden="true">
                <span className="dot" style={{ animationDelay: "0ms" }} />
                <span className="dot" style={{ animationDelay: "150ms" }} />
                <span className="dot" style={{ animationDelay: "300ms" }} />
              </span>
            </span>
          </main>
        )}
        {error && <p className="chat-error">{error}</p>}
        <div ref={messagesEndRef} />
        {/* Dynamic bottom spacer to allow placing latest question at top */}
        <div style={{ height: bottomSpacer }} />

        <div data-composer="true" className="composer">
          <div className="composer-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask me anything…"
              rows={1}
            />
            <button
              onClick={() => { void onSubmit(); }}
              disabled={loading || modelLoading || !modelReady}
              className="composer-send"
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
              </svg>
            </button>
          </div>
        </div>
    </div>
  );
}

function renderAnswer(markdown: string): string {
  // Escape raw HTML so model output can't inject markup, then parse as GFM.
  // (Only `<` and `&` need escaping — `>` must stay for blockquotes.)
  const escaped = markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return marked.parse(escaped, {
    gfm: true,
    breaks: true,
    async: false,
  }) as string;
}


