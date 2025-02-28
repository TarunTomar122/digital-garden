import data from './books.json';
import Image from 'next/image';

export default function Page() {
    const books = data['books'];
    return (
        <main className='flex justify-center xl:px-40 2xl:px-60'>
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
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {books.map((book, index) => (
                        <a 
                            key={index} 
                            href={book.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group mb-4"
                        >
                            <article className="bg-[#202020]  overflow-hidden transition-all duration-300 border-slate-700/60 hover:border-slate-200/60 h-full">
                                <div className="flex flex-row gap-4 h-full">
                                    <div className="w-24 h-36 relative flex-shrink-0">
                                        <Image
                                            src={book.img}
                                            alt={book.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 96px, 96px"
                                        />
                                    </div>
                                    <div className="flex flex-col  pr-6 flex-grow">
                                        {book.rating === "" && (
                                            <div className='text-sm mb-2 w-fit'>
                                                {book.status === 'to read' && 
                                                    <span className='py-0.5  text-orange-300 rounded-full w-fit'>
                                                        To read
                                                    </span>
                                                }
                                                {book.status === 'reading' && 
                                                    <span className=' py-0.5 text-green-300 rounded-full w-fit'>
                                                        Reading
                                                    </span>
                                                }
                                                {book.status === 'gave up' && 
                                                    <span className=' py-0.5  text-red-300 rounded-full w-fit'>
                                                        Gave up
                                                    </span>
                                                }
                                            </div>
                                        )}
                                        {book.rating !== "" && (
                                            <div className='text-sm py-0.5 text-blue-300 rounded-full mb-2 w-fit'>
                                                Rating: {book.rating}
                                            </div>
                                        )}
                                        <h2 className="text-lg text-slate-200 group-hover:text-white transition-colors">
                                            {book.title.length > 40 ? `${book.title.slice(0, 40)}...` : book.title}
                                        </h2>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {book.author}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </a>
                    ))}
                </section>
            </div>
        </main>
    );
}
