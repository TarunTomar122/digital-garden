import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritings, type WritingMeta } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writings",
  description: "Collected essays, notes, and experiments.",
  alternates: {
    canonical: "/writings",
  },
  openGraph: {
    type: "website",
    url: "/writings",
    title: "Writings | Tarat's Garden",
    description: "Collected essays, notes, and experiments.",
  },
  twitter: {
    card: "summary",
    title: "Writings | Tarat's Garden",
    description: "Collected essays, notes, and experiments.",
  },
};

function toISODate(dateValue?: string | Date): string | undefined {
  if (!dateValue) return undefined;
  if (dateValue instanceof Date) return dateValue.toISOString().slice(0, 10);
  return String(dateValue);
}

function formatShortDate(dateValue?: string | Date): string {
  const iso = toISODate(dateValue);
  if (!iso) return "Undated";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getYear(dateValue?: string | Date): string {
  const iso = toISODate(dateValue);
  if (!iso) return "Undated";
  const match = iso.match(/^(\d{4})/);
  return match ? match[1] : "Undated";
}

export default function WritingsIndex() {
  const writings = getAllWritings();

  const byYear = writings.reduce<Record<string, WritingMeta[]>>((acc, w) => {
    const year = getYear(w.date);
    (acc[year] ??= []).push(w);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;
    return Number(b) - Number(a);
  });

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <p className="page-kicker">Journal</p>
          <h1>
            Writings <span className="page-count">({writings.length})</span>
          </h1>
          <p className="note">
            Essays, notes, and things I learn the hard way. Sorted with the
            most recent stuff first.
          </p>
        </header>

        {years.map((year) => (
          <section key={year}>
            <div className="section-head">
              <h2>
                {year}
                <span className="count">({byYear[year].length})</span>
              </h2>
            </div>
            <ul className="cards">
              {byYear[year].map((w) => (
                <li key={w.slug}>
                  <Link href={`/writings/${w.slug}`} className="card">
                    <div className="card-body">
                      <h3 className="card-title card-title-sm">{w.title}</h3>
                      <p className="card-meta">{formatShortDate(w.date)}</p>
                      {w.description ? (
                        <p className="card-desc">{w.description}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
