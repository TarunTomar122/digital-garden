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
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header>
          <h1>Library</h1>
          <p className="note">Books I&rsquo;m reading and have read lately.</p>
          <p className="note">Total read: {books.filter((b) => b.status === "read").length}</p>
        </header>

        <ul className="list-plain" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {books.map((b, idx) => (
            <li key={`${b.title}-${idx}`} style={{ display: "flex", gap: "14px", marginBottom: 0 }}>
              <a href={b.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${b.title} on Goodreads`}>
                <img
                  src={b.img}
                  alt={b.title}
                  loading="lazy"
                  decoding="async"
                  style={{ height: "112px", width: "80px", flexShrink: 0, objectFit: "cover", borderRadius: "4px", border: "1px solid #eee" }}
                />
              </a>
              <div>
                <p style={{ fontWeight: 600, lineHeight: 1.3 }}>{b.title}</p>
                <p className="desc">{b.author}</p>
                <p className="desc">{b.status}{b.rating && b.rating.trim().length > 0 ? ` · ${b.rating}` : ""}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}


