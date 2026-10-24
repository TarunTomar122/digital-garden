"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";

// Every image in a post opens in a spotlight view on click (Esc, a click anywhere or the close button closes it).
export default function MarkdownImage(props: ComponentProps<"img">) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const alt = props.alt ?? "";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <img
        {...props}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={["zoomable", props.className].filter(Boolean).join(" ")}
        role="button"
        tabIndex={0}
        aria-label={alt ? `Open image: ${alt}` : "Open image"}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      {open
        ? createPortal(
            <div className="spotlight" role="dialog" aria-modal="true" aria-label={alt || "Image"} onClick={close}>
              <button type="button" className="spotlight-close" aria-label="Close" onClick={close}>
                ×
              </button>
              <figure className="spotlight-figure">
                <img src={typeof props.src === "string" ? props.src : undefined} alt={alt} className="spotlight-img" />
                {alt ? <figcaption className="spotlight-caption">{alt}</figcaption> : null}
              </figure>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
