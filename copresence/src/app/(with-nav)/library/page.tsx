import data from "@/app/(with-nav)/library/books.json";
import Bookshelf from "@/components/Bookshelf";

export default function LibraryPage() {
  const books = data.books;
  const reading = books.filter((b) => b.status === "reading");
  const read = books.filter((b) => b.status === "read");
  const shelved = books.filter(
    (b) => b.status !== "reading" && b.status !== "read"
  );

  const sections = [
    {
      title: "Currently reading",
      books: reading,
    },
    {
      title: "Read",
      books: read,
    },
    {
      title: "Shelved",
      books: shelved,
    },
  ].filter((s) => s.books.length > 0);

  return (
    <main className="raw-doc library-page">
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
            </div>
            <Bookshelf books={section.books} showRatings />
          </section>
        ))}
      </div>
    </main>
  );
}
