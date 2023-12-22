/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import './reading.css';
import data from './books.json';
export default function Page() {
  const books = data['books'];
  return (
    <main className="flex min-h-screen flex-col py-8 px-48">
      <p className="text-6xl font-normal leading-relaxed">reading.</p>
      <p className="text-neutral-500 text-xl font-light">A list of books I'm reading, want to read or have read already.</p>

      {/* Main Container */}
      <div className="pt-8 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {
            books.map((book, index) => {
              return (
                <a className="cursor-alias py-3 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-end justify-between" key={index} href="https://www.goodreads.com/book/show/99561.Looking_for_Alaska" target="_blank" rel="noopener noreferrer">

                  {book.status === 'reading' && <div className='bg-yellow-200 w-20 text-center'>{book.status}</div>}
                  {book.status === 'to read' && <div className='bg-red-200 w-20 text-center'>{book.status}</div>}
                  {book.status === 'read' && <div className='bg-green-200 w-20 text-center'>{book.status}</div>}

                  <div className="mt-6 gap-3 flex">
                    <img src={book.img} className="max-h-32 h-full md:max-w-52 rounded-t" alt={book.title} />
                    <div className="p-4">
                      <p className="text-lg font-medium text-gray-900">{book.title.length > 20 ? book.title.slice(0, 20) + "..." : book.title}</p>
                      <p className="text-gray-600">{book.author}</p>
                      {book.rating !== "" && <p className="text-gray-600">Rating: {book.rating} </p>}
                    </div>
                  </div>
                </a>
              )
            })
          }
        </div>
      </div>

    </main>
  )
}
