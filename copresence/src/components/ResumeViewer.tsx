"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CLIENT_CACHE_KEY = "resume:v3";
const CLIENT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function wrapResumeHtml(html: string) {
  const base = `<style>
    html, body { margin: 0 !important; padding: 0 !important; overflow: visible !important; }
    @media (max-width: 767px) {
      body > * { padding-left: 1rem !important; padding-right: 1rem !important; }
    }
    @media (min-width: 768px) {
      body > * { padding-left: 0 !important; padding-right: 0 !important; }
    }
  </style>`;
  return base + html;
}

type ResumeResponse = {
  html: string;
  generatedAt: string;
  model: string;
  cached: boolean;
};

function readClientCache(): ResumeResponse | null {
  try {
    const raw = localStorage.getItem(CLIENT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      data: ResumeResponse;
      expiresAt: number;
    };
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CLIENT_CACHE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeClientCache(data: ResumeResponse) {
  try {
    localStorage.setItem(
      CLIENT_CACHE_KEY,
      JSON.stringify({ data, expiresAt: Date.now() + CLIENT_CACHE_TTL_MS }),
    );
  } catch {
    // Private browsing or quota — skip silently.
  }
}

function clearClientCache() {
  try {
    localStorage.removeItem(CLIENT_CACHE_KEY);
  } catch {
    // ignore
  }
}

export default function ResumeViewer() {
  const [data, setData] = useState<ResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    const root = doc.documentElement;
    const body = doc.body;
    if (!root && !body) return;

    const height = Math.max(
      root?.scrollHeight ?? 0,
      body?.scrollHeight ?? 0,
      root?.offsetHeight ?? 0,
      body?.offsetHeight ?? 0,
    );

    if (height > 0) {
      iframe.style.height = `${height}px`;
    }
  }, []);

  const fetchResume = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      clearClientCache();
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const url = refresh ? "/api/resume?refresh=true" : "/api/resume";
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to load resume");
      }

      const next = json as ResumeResponse;
      setData(next);
      writeClientCache(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const cached = readClientCache();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    fetchResume(false);
  }, [fetchResume]);

  useEffect(() => {
    if (!data) return;

    const raf = requestAnimationFrame(resizeIframe);
    const t1 = window.setTimeout(resizeIframe, 100);
    const t2 = window.setTimeout(resizeIframe, 500);
    window.addEventListener("resize", resizeIframe);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", resizeIframe);
    };
  }, [data, resizeIframe]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">
            Resume
          </h1>
          <button
            type="button"
            onClick={() => fetchResume(true)}
            disabled={refreshing}
            aria-label="Refresh resume"
            className="text-muted hover:text-foreground transition-colors disabled:opacity-40 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <p className="text-muted">
          Work, projects, and the stuff I actually build.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-6 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading && !data ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-muted text-sm">ai is generating a resume :)</p>
        </div>
      ) : null}

      {data ? (
        <div className="relative md:-mx-4">
          <iframe
            ref={iframeRef}
            title="Resume"
            srcDoc={wrapResumeHtml(data.html)}
            className="resume-iframe w-full border-0 bg-transparent overflow-hidden p-0 m-0"
            sandbox="allow-same-origin"
            scrolling="no"
            onLoad={resizeIframe}
          />
        </div>
      ) : null}
    </div>
  );
}