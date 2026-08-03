import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritings, type WritingMeta } from "@/lib/writings";

const PAGE_SIZE = 7;

export const dynamic = "force-dynamic";

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

function formatMonth(dateString: string): string {
  // dateString is YYYY-MM, so append -01 to make it a valid date
  const date = new Date(dateString + "-01T00:00:00Z");
  if (isNaN(date.getTime())) {
    return "Undated";
  }
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function groupWritingsByMonth(writings: WritingMeta[]) {
  const grouped: { [key: string]: WritingMeta[] } = {};
  writings.forEach((writing) => {
    if (writing.date) {
      // Convert to ISO string if it's a Date object, otherwise use as-is
      const dateStr = writing.date instanceof Date 
        ? writing.date.toISOString().substring(0, 7)
        : String(writing.date).substring(0, 7); // YYYY-MM
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(writing);
    } else {
      if (!grouped["no-date"]) {
        grouped["no-date"] = [];
      }
      grouped["no-date"].push(writing);
    }
  });
  return grouped;
}

export default async function WritingsIndex({ 
  searchParams 
}: { 
  searchParams?: Promise<{ page?: string }> 
}) {
  const writings = getAllWritings();
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(writings.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = writings.slice(start, start + PAGE_SIZE);
  
  const groupedByMonth = groupWritingsByMonth(pageItems);
  const monthKeys = Object.keys(groupedByMonth).sort().reverse(); // Most recent first

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header>
          <h1>Writings</h1>
          <p className="note">Collected essays, notes, and experiments.</p>
        </header>

        {monthKeys.map((monthKey) => (
          <section key={monthKey}>
            <h2>{monthKey === "no-date" ? "Undated" : formatMonth(monthKey)}</h2>
            <ul className="list-plain">
              {groupedByMonth[monthKey].map((w) => (
                <li key={w.slug}>
                  <Link href={`/writings/${w.slug}`}>{w.title}</Link>
                  {w.description ? <p className="desc">{w.description}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {totalPages > 1 && (
          <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {page > 1 ? (
              <Link prefetch={false} href={`/writings?page=${page - 1}`}>← Previous</Link>
            ) : (
              <span />
            )}
            <span className="desc">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link prefetch={false} href={`/writings?page=${page + 1}`}>Next →</Link>
            ) : (
              <span />
            )}
          </footer>
        )}
      </div>
    </main>
  );
}

