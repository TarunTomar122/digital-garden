import data from './blogs.json';
export default function Page() {
    const blogs = data['blogs'];
    return (
        <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
            <p className="text-3xl lg:text-6xl font-normal leading-relaxed">writing.</p>
            <p className="text-neutral-500 text:lg lg:text-xl font-light">I write about latest tech, old tech, and everything that is not related to tech.</p>

            {/* Main Container */}
            <div className="pt-8 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        blogs.map((blog, index) => {
                            return (
                                <a className="cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" key={index} href={blog.link} target="_blank" rel="noopener noreferrer">

                                    <div className='text-gray-600 text-sm flex flex-row justify-between items-center'>
                                        <div>
                                            <p>{blog.category}</p>
                                            <p>{blog.date}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                        </svg>
                                    </div>

                                    <div className="mt-6 gap-3 flex flex-col">

                                        <p className="text-lg font-medium text-gray-900">{blog.title.length > 70 ? blog.title.slice(0, 70) + "..." : blog.title}</p>
                                        <p className="text-gray-600">{blog.description}</p>

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
