import { getAllSeeds } from '@/utils/seedsAPI';
import Link from 'next/link';

const Page = () => {

    const seeds = getAllSeeds();

    return (
        <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
            <p className="text-3xl lg:text-6xl font-normal leading-relaxed">writing.</p>
            <p className="text-neutral-500 text:lg lg:text-xl font-light">A collection of my most random thoughts and blogs.</p>

            {/* Main Container */}
            <div className="pt-8 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        seeds.map(({ id, title, description, category, date }) => {
                            return (
                                <Link className="cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" key={id} href={`/writing/${id}`} rel="noopener noreferrer">

                                    <div className='text-gray-600 text-sm flex flex-row justify-between items-center'>
                                        <div>
                                            <p>{category}</p>
                                            <p>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                        </svg>
                                    </div>

                                    <div className="mt-6 gap-3 flex flex-col">

                                        <p className="text-lg font-medium text-gray-900">{title.length > 70 ? title.slice(0, 70) + "..." : title}</p>
                                        <p className="text-gray-600">{description}</p>

                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

        </main>
    )
}

export default Page;