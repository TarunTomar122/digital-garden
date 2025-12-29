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
    <div 
      className="md:hidden fixed top-0 left-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--background, #fdf5e2)" }}
    >
      {/* Close button at top right */}
      <button
        className="absolute top-4 right-4 p-2 text-2xl cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      >
        ✕
      </button>
      
      {/* Logo at top left */}
      <Link 
        prefetch 
        href="/" 
        onClick={() => setOpen(false)}
        className="absolute top-4 left-4 font-display text-xl"
      >
        Tarats Garden 🌱
      </Link>

      <nav className="flex flex-col items-center gap-8">
        {links.map((l) => (
          <Link 
            prefetch 
            key={l.href} 
            href={l.href} 
            onClick={() => setOpen(false)} 
            className={[
              "font-display text-3xl transition-colors cursor-pointer",
              isActive(l.href)
                ? "text-foreground underline underline-offset-8"
                : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      
      {/* Home link at bottom */}
      <Link 
        prefetch 
        href="/" 
        onClick={() => setOpen(false)}
        className="absolute bottom-12 text-muted hover:text-foreground transition-colors text-sm cursor-pointer"
      >
        ← back to home
      </Link>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <nav className="mx-auto max-w-3xl px-4 py-4 relative z-50">
        {/* Desktop: Logo left, links right */}
        <div className="hidden md:flex flex-row items-center justify-between">
          <Link prefetch href="/" className="font-display text-2xl hover:opacity-80 transition-opacity">
            Tarats Garden 🌱
          </Link>
          <div className="flex items-center gap-8 text-sm">
            {links.map((l) => (
              <Link 
                prefetch 
                key={l.href} 
                href={l.href} 
                className={[
                  "transition-colors",
                  isActive(l.href)
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile: Logo left, hamburger right */}
        <div className="md:hidden flex items-center justify-between">
          <Link prefetch href="/" className="font-display text-xl">
            Tarats Garden 🌱
          </Link>
          <button
            className="p-2 text-2xl cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </nav>

      {mobileMenu}
    </>
  );
}


