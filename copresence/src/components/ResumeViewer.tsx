"use client";

import { useCallback, useEffect, useRef } from "react";

function wrapResumeHtml(html: string) {
  const base = `<meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
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

export default function ResumeViewer({ html }: { html: string }) {
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

  useEffect(() => {
    const frame = requestAnimationFrame(resizeIframe);
    const shortRetry = window.setTimeout(resizeIframe, 100);
    const fontRetry = window.setTimeout(resizeIframe, 500);
    window.addEventListener("resize", resizeIframe);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(shortRetry);
      window.clearTimeout(fontRetry);
      window.removeEventListener("resize", resizeIframe);
    };
  }, [resizeIframe]);

  return (
    <div className="panel resume-panel">
      <iframe
        ref={iframeRef}
        title="Resume"
        srcDoc={wrapResumeHtml(html)}
        className="resume-iframe w-full border-0 bg-transparent overflow-hidden p-0 m-0"
        sandbox="allow-same-origin"
        scrolling="no"
        onLoad={resizeIframe}
      />
    </div>
  );
}
