"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/writings", label: "Writings" },
  { href: "/projects", label: "Projects" },
  { href: "/library", label: "Library" },
  { href: "/resume", label: "Resume" },
  { href: "/list100", label: "List 100" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between text-center">
      <Link prefetch href="/" className="font-display text-xl">Tarats Garden</Link>
      <button
        className="md:hidden px-2 py-1 text-2xl cursor-pointer text-center"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-2xl">☰</span>
      </button>
      <div className="hidden md:flex items-center gap-6 text-sm">
        {links.map((l) => (
          <Link prefetch key={l.href} href={l.href} className="underline underline-offset-4 hover:opacity-80">
            {l.label}
          </Link>
        ))}
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 md:hidden bg-background/100 border border-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link prefetch key={l.href} href={l.href} onClick={() => setOpen(false)} className="underline underline-offset-4">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}


