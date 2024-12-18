import data from './books.json';

export default function Page() {
    const books = data['books'];
    return (
        <main className='flex justify-center xl:px-60'>
            <div className='min-w-full md:container px-12  md:px-28 lg:px-60'>

                {/* Header */}
                <section>
                    <p className="text-3xl md:text-4xl py-4">Books</p>
                    <section className="text-slate-400 md:leading-10 leading-8 text-lg">
                        <p>A list of books I'm reading or have read already</p>
                    </section>
                </section>

                {/* Books */}
                <section className="pb-20">

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
            </div>
        </main>
    );
}
