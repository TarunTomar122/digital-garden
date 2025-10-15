import Link from "next/link";
import { getAllWritings } from "@/lib/writings";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

export default function WritingsIndex({ searchParams }: { searchParams?: { page?: string } }) {
  const writings = getAllWritings();
  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(writings.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = writings.slice(start, start + PAGE_SIZE);
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Writings</h1>
        <p className="text-muted">Collected essays, notes, and experiments.</p>
      </header>

      <ul className="space-y-4">
        {pageItems.map((w) => (
          <li key={w.slug}>
            <div className="space-y-1">
              <Link href={`/writings/${w.slug}`} className="underline underline-offset-4 hover:opacity-80">
                {w.title}
              </Link>
              {w.description ? (
                <p className="text-muted text-sm">{w.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-muted/40">
          {page > 1 ? (
            <Link href={`/writings?page=${page - 1}`} className="underline underline-offset-4 hover:opacity-80">← Newer</Link>
          ) : <span />}
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={`/writings?page=${page + 1}`} className="underline underline-offset-4 hover:opacity-80">Older →</Link>
          ) : <span />}
        </div>
      )}
    </main>
  );
}


