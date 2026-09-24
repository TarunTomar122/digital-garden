import data from "@/app/(with-nav)/library/books.json";

type Book = {
  title: string;
  img: string;
  author: string;
  rating?: string;
  status: string;
  link: string;
};

function Stars({ rating }: { rating?: string }) {
  if (!rating) return null;
  const match = rating.match(/(\d)\s*\/\s*(\d)/);
  if (!match) return <span className="book-rating">{rating}</span>;
  const score = Number(match[1]);
  return (
    <span className="book-rating" aria-label={`${score} out of 5`}>
      {"★".repeat(score)}
      {"☆".repeat(Math.max(0, 5 - score))}
    </span>
  );
}

function BookGrid({ books }: { books: Book[] }) {
  return (
    <ul className="card-grid">
      {books.map((b, idx) => (
        <li key={`${b.title}-${idx}`}>
          <a
            href={b.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card book-card"
          >
            <div className="book-row">
              <img
                className="book-cover"
                src={b.img}
                alt={b.title}
                loading="lazy"
                decoding="async"
              />
              <div className="book-info">
                <p className="book-title">{b.title}</p>
                <p className="book-author">{b.author}</p>
                <Stars rating={b.rating} />
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function LibraryPage() {
  const books = (data.books as Book[]) || [];
  const reading = books.filter((b) => b.status === "reading");
  const read = books.filter((b) => b.status === "read");
  const shelved = books.filter(
    (b) => b.status !== "reading" && b.status !== "read"
  );

  const sections = [
    {
      title: "Currently reading",
      books: reading,
      blurb: "On the desk right now.",
    },
    {
      title: "Read",
      books: read,
      blurb: "Books I've finished and what I thought of them.",
    },
    {
      title: "Shelved",
      books: shelved,
      blurb: "Tried, gave up, or never quite finished.",
    },
  ].filter((s) => s.books.length > 0);

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <h1>
            Library <span className="page-count">({books.length})</span>
          </h1>
          <p className="note">
            Books I&rsquo;m reading and have read lately.{" "}
            {read.length} finished so far.
          </p>
        </header>

        {sections.map((section) => (
          <section key={section.title}>
            <div className="section-head">
              <h2>
                {section.title}
                <span className="count">({section.books.length})</span>
              </h2>
              <p>{section.blurb}</p>
            </div>
            <BookGrid books={section.books} />
          </section>
        ))}
      </div>
    </main>
  );
}
