"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const sections = [
  {
    href: "/writings",
    label: "Writings",
    desc: "Essays, notes, and things I learn the hard way.",
  },
  {
    href: "/projects",
    label: "Projects",
    desc: "Experiments and builds, with write-ups.",
  },
  {
    href: "/library",
    label: "Library",
    desc: "Books I'm reading and have read.",
  },
  {
    href: "/timeline",
    label: "Timeline",
    desc: "Moments and milestones, year by year.",
  },
  {
    href: "/list100",
    label: "List 100",
    desc: "Things I want to do before I turn 100.",
  },
  {
    href: "/startups",
    label: "Startups",
    desc: "Small products with real users and revenue.",
  },
  {
    href: "/resume",
    label: "Resume",
    desc: "Work, projects, and skills.",
  },
];

const experiments = [
  { href: "/tarat-ai", label: "Talk to my AI" },
  { href: "/network", label: "Garden Galaxy" },
  { href: "/easter-eggs", label: "Easter eggs" },
];

const elsewhere = [
  { href: "https://x.com/tarat_211", label: "X" },
  { href: "https://github.com/TarunTomar122", label: "GitHub" },
  { href: "https://www.youtube.com/@tarat.youtube", label: "YouTube" },
  { href: "https://www.linkedin.com/in/tarun-tomar-4ab0b5193/", label: "LinkedIn" },
  { href: "https://www.instagram.com/tarat.hobbies/", label: "Instagram" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const overlay =
    open && mounted
      ? createPortal(
          <div className="nav-overlay" role="dialog" aria-modal="true" aria-label="Garden index">
            <div className="nav-overlay-inner">
              <div className="nav-overlay-top">
                <Link
                  href="/"
                  className="raw-nav-logo"
                  onClick={() => setOpen(false)}
                >
                  <span>Tarat</span>
                </Link>
                <button
                  className="nav-overlay-close"
                  aria-label="Close index"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              <nav className="nav-index">
                {sections.map((s, i) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    prefetch
                    className={`nav-index-item ${
                      pathname.startsWith(s.href) ? "active" : ""
                    }`}
                    style={{ animationDelay: `${0.03 + i * 0.045}s` }}
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav-index-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="nav-index-copy">
                      <span className="nav-index-label">{s.label}</span>
                      <span className="nav-index-desc">{s.desc}</span>
                    </span>
                    <span className="nav-index-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="nav-overlay-foot">
                <div className="nav-overlay-group">
                  <span className="nav-overlay-heading">Experiments</span>
                  <div className="nav-overlay-links">
                    {experiments.map((e) => (
                      <Link
                        key={e.href}
                        href={e.href}
                        prefetch
                        onClick={() => setOpen(false)}
                      >
                        {e.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="nav-overlay-group">
                  <span className="nav-overlay-heading">Elsewhere</span>
                  <div className="nav-overlay-links">
                    {elsewhere.map((e) => (
                      <a key={e.href} href={e.href} target="_blank" rel="noreferrer">
                        {e.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="raw-nav" id="top-nav">
        <div className="raw-nav-inner">
          <Link prefetch href="/" className="raw-nav-logo">
            <span>Tarat</span>
          </Link>

          <button
            className="nav-index-btn"
            aria-label="Open index"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span className="nav-index-btn-lines" aria-hidden="true">
              <span />
              <span />
            </span>
            index
          </button>
        </div>
      </div>

      {overlay}
    </>
  );
}
