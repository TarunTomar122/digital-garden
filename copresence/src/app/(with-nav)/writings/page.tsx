import Link from "next/link";
import { getAllWritings, type WritingMeta } from "@/lib/writings";

const PAGE_SIZE = 8;

export const dynamic = "force-dynamic";

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
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Writings</h1>
        <p className="text-muted">Collected essays, notes, and experiments.</p>
      </header>

      <ul className="space-y-8">
        {monthKeys.map((monthKey) => (
          <li key={monthKey}>
            <div className="relative">
              {/* Month label and vertical line - positioned absolutely on desktop */}
              <div className="absolute top-0 bottom-0 right-full mr-6 hidden md:flex items-start gap-3">
                <div className="text-muted text-sm font-medium text-right pt-1" style={{ minWidth: "64px" }}>
                  {monthKey === "no-date" ? "Undated" : formatMonth(monthKey)}
                </div>
                <div className="w-px bg-muted/40 self-stretch"></div>
              </div>

              {/* Articles */}
              <div className="space-y-4">
                {groupedByMonth[monthKey].map((w) => (
                  <div key={w.slug} className="space-y-1">
                    <Link
                      prefetch
                      href={`/writings/${w.slug}`}
                      className="underline underline-offset-4 hover:opacity-80"
                    >
                      {w.title}
                    </Link>
                    {w.description ? (
                      <p className="text-muted text-sm">{w.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-muted/40">
          {page > 1 ? (
            <Link 
              prefetch 
              href={`/writings?page=${page - 1}`} 
              className="underline underline-offset-4 hover:opacity-80"
            >
              ← Previous
            </Link>
          ) : (
            <div></div>
          )}
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link 
              prefetch 
              href={`/writings?page=${page + 1}`} 
              className="underline underline-offset-4 hover:opacity-80"
            >
              Next →
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </main>
  );
}


