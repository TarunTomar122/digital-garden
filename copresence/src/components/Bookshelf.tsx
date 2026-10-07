export type Book = {
  title: string;
  img: string;
  author: string;
  rating?: string;
  status: string;
  link: string;
};

function BookStatus({ status }: { status: string }) {
  const value = status.trim().toLowerCase().replace(/[-_]/g, " ");
  const toRead = value === "to read" || value === "want to read";
  const label = toRead ? "To read" : value.charAt(0).toUpperCase() + value.slice(1);
  const mark = value === "read" ? "✓" : value === "reading" ? "◐" : toRead ? "○" : "–";

  return (
    <span className="shelf-book-status" data-status={value}>
      <span aria-hidden="true">{mark}</span> {label}
    </span>
  );
}

function BookRating({ rating }: { rating: string }) {
  const score = Number.parseFloat(rating);
  if (!Number.isFinite(score)) return <span className="shelf-book-rating">{rating}</span>;

  return (
    <span className="shelf-book-rating" role="img" aria-label={`${score} out of 5 stars`} title={rating}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className="shelf-star" key={index} aria-hidden="true">
          ☆
          <span className="shelf-star-fill" style={{ width: `${Math.min(1, Math.max(0, score - index)) * 100}%` }}>
            ★
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Bookshelf({
  books,
  showRatings = false,
}: {
  books: Book[];
  showRatings?: boolean;
}) {
  return (
    <ul className="bookshelf">
      {books.map((book) => (
        <li key={`${book.title}-${book.author}`}>
          <a href={book.link} target="_blank" rel="noopener noreferrer" className="shelf-book">
            <div className="shelf-book-cover">
              <img
                src={book.img}
                alt=""
                width={128}
                height={192}
                loading="lazy"
                decoding="async"
              />
            </div>
            <BookStatus status={book.status} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            {showRatings && book.rating ? (
              <BookRating rating={book.rating} />
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
