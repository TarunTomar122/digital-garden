import data from './books.json';

export default function Page() {
    const books = data['books'];
    return (
        <main className="flex min-h-screen flex-col px-16 md:px-24 lg:px-48 xl:px-96">

            {/* Header */}
            <section className="py-8">
                <p className="text-2xl py-4">Books</p>
                <section className="text-slate-400 leading-10 text-lg">
                    <p>A list of book I'm reading or have read already.</p>
                </section>
            </section>

            {/* Books */}
            <section className="py-8">

                <div className="text-slate-400 leading-10 text-lg">
                    {
                        books.map((book, index) => {
                            return (
                                <div key={index} className='py-4'>
                                    <a href={book.link} target="_blank">
                                        <span className="border-b-2 border-b-slate-400 text-slate-200 text-xl">
                                            {book.title}</span>
                                    </a>
                                    <p className="text-gray-400">{book.author}</p>
                                    {book.rating === "" && <p className='text-gray-400 text-sm'
                                    >{book.status}</p>}
                                    {book.rating !== "" && <p className='text-gray-400 text-sm'>Rating: {book.rating}</p>}
                                </div>
                            );
                        })
                    }
                </div>

            </section>

        </main>
    );
}
