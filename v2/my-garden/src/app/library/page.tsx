import data from './books.json';

export default function Page() {
    const books = data['books'];
    return (
        <main className='flex justify-center xl:px-60 min-h-screen'>
            <div className='min-w-full px-8 md:container md:px-28 lg:px-60 py-8 mb-20'>
                {/* Header */}
                <section className="mb-12">
                    <p className="text-4xl md:text-5xl font-normal text-white pb-2">
                        Books
                    </p>
                    <p className="text-slate-400 md:text-lg mt-4">
                        A list of books I'm reading or have read already
                    </p>
                </section>

                {/* Books */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {books.map((book, index) => (
                        <a 
                            href={book.link} 
                            target="_blank" 
                            key={index} 
                            className='group bg-transparent border border-slate-800/60 rounded-lg p-6 hover:border-slate-700/60 transition-all duration-300'
                        >
                            <div className='flex gap-4'>
                                <img 
                                    src={book.img} 
                                    alt={book.title} 
                                    className="h-auto w-24 object-cover rounded-md transition-transform duration-500 group-hover:scale-105" 
                                />
                                <div className="flex-1">
                                    {book.rating === "" && (
                                        <span className='text-sm mb-2 block'>
                                            {book.status === 'to read' && 
                                                <span className='px-2 py-0.5 bg-orange-500/10 text-orange-300 rounded-full'>
                                                    To read
                                                </span>
                                            }
                                            {book.status === 'reading' && 
                                                <span className='px-2 py-0.5 bg-green-500/10 text-green-300 rounded-full'>
                                                    Reading
                                                </span>
                                            }
                                            {book.status === 'gave up' && 
                                                <span className='px-2 py-0.5 bg-red-500/10 text-red-300 rounded-full'>
                                                    Gave up
                                                </span>
                                            }
                                        </span>
                                    )}
                                    {book.rating !== "" && (
                                        <span className='text-sm px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-full mb-2 inline-block'>
                                            Rating: {book.rating}
                                        </span>
                                    )}
                                    <h2 className="text-lg text-slate-200 group-hover:text-white transition-colors">
                                        {book.title.length > 40 ? `${book.title.slice(0, 40)}...` : book.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {book.author}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </section>
            </div>
        </main>
    );
}
