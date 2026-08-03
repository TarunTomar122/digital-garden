"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  variant: string;
};

export default function ResumeViewer() {
  const [data, setData] = useState<ResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc) return;

    const height = Math.max(
      doc.documentElement?.scrollHeight ?? 0,
      doc.body?.scrollHeight ?? 0,
      doc.documentElement?.offsetHeight ?? 0,
      doc.body?.offsetHeight ?? 0,
    );

    if (height > 0) iframe.style.height = `${height}px`;
  }, []);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/resume", { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Failed to load resume");
      setData(json as ResumeResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchResume();
  }, [fetchResume]);

  useEffect(() => {
    if (!data) return;

    const frame = requestAnimationFrame(resizeIframe);
    const shortRetry = window.setTimeout(resizeIframe, 100);
    const fontRetry = window.setTimeout(resizeIframe, 700);
    window.addEventListener("resize", resizeIframe);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(shortRetry);
      window.clearTimeout(fontRetry);
      window.removeEventListener("resize", resizeIframe);
    };
  }, [data, resizeIframe]);

  return (
    <div>
      {error ? (
        <div style={{ border: "1px solid #f3c2c2", background: "#fdf2f2", borderRadius: "8px", padding: "16px", fontSize: "14px", color: "#b42318", marginTop: "24px" }}>
          {error}
        </div>
      ) : null}

      {loading && !data ? (
        <div style={{ display: "flex", minHeight: "40vh", alignItems: "center", justifyContent: "center" }}>
          <p className="note">loading resume...</p>
        </div>
      ) : null}

      {data ? (
        <div style={{ marginTop: "24px" }}>
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
