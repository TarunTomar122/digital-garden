import data from './books.json';

export default function Page() {
    const books = data['books'];
    return (
        <main className="flex min-h-screen flex-col px-6 md:px-24 lg:px-48 xl:px-96">

            {/* Header */}
            {/* <section className="py-8">
                <p className="text-2xl py-4">Books</p> */}
              
            {/* </section> */}

            {/* Books */}
            <section className="py-8">

                  <section className="text-slate-400 md:leading-10 leading-8 text-lg pb-8">
                    <p>A list of book I'm reading or have read already.</p>
                </section>

                <div className="text-slate-400 md:leading-10 leading-8 text-lg">
                    {
                        books.map((book, index) => {
                            return (
                                <a href={book.link} target="_blank" key={index} className='py-6 flex-row flex gap-4 md:gap-8'>
                                    <img src={book.img} alt={book.title} className="w-20 h-auto object-cover rounded-sm" />
                                    <div>
                                        <span className="text-slate-200 text-xl">
                                            {book.title.length > 40 ? `${book.title.slice(0, 40)}...` : book.title}</span>
                                        <p className="text-gray-400">{book.author}</p>
                                        {book.rating === "" && <p className='text-gray-400 text-sm'>
                                            {book.status === 'to read' && <span className='text-orange-300'>To read</span>}
                                            {book.status === 'reading' && <span className='text-green-300'>Reading</span>}
                                            {book.status === 'gave up' && <span className='text-red-200'>Gave up</span>}
                                        </p>}
                                        {book.rating !== "" && <p className='text-blue-200 text-sm'>Rating: {book.rating}</p>}
                                    </div>
                                </a>
                            );
                        })
                    }
                </div>

            </section>

        </main>
    );
}
