import { getAllWritings } from '@/actions/writingsActions';
import Link from 'next/link';

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const {page} = await searchParams;
    const currentPage = Number(page) || 1;
    const ITEMS_PER_PAGE = 8;

    const writings = await getAllWritings();

    // order the writings by date
    writings.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Calculate pagination values
    const totalPages = Math.ceil(writings.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentWritings = writings.slice(startIndex, endIndex);

    return (
        <main className='flex justify-center xl:px-40 2xl:px-60 min-h-screen'>
            <div className='min-w-full px-8 md:container md:px-28 lg:px-60 py-2 md:py-8 mb-20'>
                {/* Header */}
                <section className="mb-12">
                    <p className="text-4xl md:text-5xl font-normal text-white pb-2">
                        Writings
                    </p>
                    <p className="text-slate-400 md:text-lg mt-4">
                        Shower thoughts and everything else
                    </p>
                </section>

                {/* Writings */}
                <section className="space-y-8 pb-12">
                    {currentWritings.map(({ id, title, description, date }) => (
                        <Link key={id} href={`/writings/${id}`} className="block group">
                            <article className="border-b border-slate-700/60 hover:border-slate-200/60 mb-12">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h2 className="text-2xl text-slate-200 group-hover:text-white transition-colors">
                                        {title.length > 70 ? title.slice(0, 70) + "..." : title}
                                    </h2>
                                    <span className="text-slate-500 group-hover:text-slate-400 transition-colors flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                            <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                                        </svg>
                                    </span>
                                </div>
                                <time className="text-m text-slate-500 mb-3 block">
                                    {date.toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </time>
                                <p className="text-slate-400 text-m leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors mb-4">
                                    {description}
                                </p>
                            </article>
                        </Link>
                    ))}
                </section>

                {/* Pagination Controls */}
                <div className="flex justify-center gap-3">
                    {currentPage > 1 && (
                        <Link
                            href={`/writings?page=${currentPage - 1}`}
                            className="px-4 py-1.5 rounded-full text-sm border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
                        >
                            Previous
                        </Link>
                    )}
                    
                    <span className="px-4 py-1.5 text-sm text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    {currentPage < totalPages && (
                        <Link
                            href={`/writings?page=${currentPage + 1}`}
                            className="px-4 py-1.5 rounded-full text-sm border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
