import data from "@/app/(with-nav)/library/books.json";

type Book = {
  title: string;
  img: string;
  author: string;
  rating?: string;
  status: string;
  link: string;
};

export default function LibraryPage() {
  const books = (data.books as Book[]) || [];
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Library</h1>
        <p className="text-muted">Books I’m reading and have read lately.</p>
        <p className="text-muted">Total read: {books.filter((b) => b.status === "read").length}</p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((b, idx) => (
          <li key={`${b.title}-${idx}`} className="flex gap-4">
            <a
              href={b.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${b.title} on Goodreads`}
              className="flex-none block"
            >
              <img
                src={b.img}
                alt={b.title}
                loading="lazy"
                decoding="async"
                className="h-28 w-20 flex-none object-cover rounded ring-1 ring-muted/50 bg-foreground/5 transform-gpu transition-transform duration-200 ease-out hover:scale-105"
              />
            </a>
            <div className="space-y-1">
              <h3 className="font-medium leading-snug">{b.title}</h3>
              <p className="text-muted text-sm">{b.author}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-foreground/30 px-2 py-0.5 text-foreground/80">
                  {b.status}
                </span>
                {b.rating && b.rating.trim().length > 0 ? (
                  <span className="text-foreground/70">{b.rating}</span>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


