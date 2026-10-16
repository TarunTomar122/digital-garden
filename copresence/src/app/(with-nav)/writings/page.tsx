import type { Metadata } from "next";
import { getAllWritings } from "@/lib/writings";
import WritingList, { type WritingListItem, type WritingYear } from "./WritingList";

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
    card: "summary_large_image",
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

  const byYear = writings.reduce<Record<string, WritingListItem[]>>((acc, w) => {
    const year = getYear(w.date);
    (acc[year] ??= []).push({
      slug: w.slug,
      title: w.title,
      description: w.description,
      category: w.category,
      dateLabel: formatShortDate(w.date),
    });
    return acc;
  }, {});

  const years: WritingYear[] = Object.keys(byYear)
    .sort((a, b) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return Number(b) - Number(a);
    })
    .map((year) => ({ year, writings: byYear[year] }));

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <h1>
            Writings <span className="page-count">({writings.length})</span>
          </h1>
          <p className="note">
            Random thoughts and blogs — written by me.
          </p>
        </header>

        <WritingList years={years} />
      </div>
    </main>
  );
}
