"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const links = [
  { href: "/projects", label: "projects" },
  { href: "/writings", label: "writings" },
  { href: "/timeline", label: "timeline" },
  { href: "/library", label: "library" },
  { href: "/list100", label: "list 100" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // For portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
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

  const isActive = (href: string) => pathname.startsWith(href);

  const mobileMenu = open && mounted ? createPortal(
    <div className="raw-nav-mobile">
      <button
        className="raw-nav-mobile-close"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      >
        ✕
      </button>

      <Link prefetch href="/" onClick={() => setOpen(false)} className={isActive("/") && pathname === "/" ? "active" : ""}>
        home
      </Link>
      {links.map((l) => (
        <Link
          prefetch
          key={l.href}
          href={l.href}
          onClick={() => setOpen(false)}
          className={isActive(l.href) ? "active" : ""}
        >
          {l.label}
        </Link>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="raw-nav">
        <div className="raw-nav-inner">
          <Link prefetch href="/" className="raw-nav-logo">
            Tarat's Garden 🌱
          </Link>

          <div className="raw-nav-links raw-nav-desktop-only">
            {links.map((l) => (
              <Link
                prefetch
                key={l.href}
                href={l.href}
                className={isActive(l.href) ? "active" : ""}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button
            className="raw-nav-toggle raw-nav-mobile-only"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            menu
          </button>
        </div>
      </div>

      {mobileMenu}
    </>
  );
}


