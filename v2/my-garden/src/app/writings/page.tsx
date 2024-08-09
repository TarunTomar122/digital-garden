import { getAllWritings } from '@/utils/writingsAPI';
import Link from 'next/link';

export default function Page() {

    const writings = getAllWritings();

    return (
        <main className="flex min-h-screen flex-col px-6 md:px-24 lg:px-48 xl:px-96">

            {/* Header */}
            <section className="py-8">
                <p className="text-2xl py-4">Writings</p>
                <section className="text-slate-400 md:leading-10 leading-8 text-lg">
                    <p>Shower thoughts and everything else</p>
                </section>
            </section>


            {/* Writings */}
            <section className="py-8">
                {
                    writings.map(({ id, title, description, category, date }) => {
                        return (
                            <div className="py-6 md:leading-10 leading-8">
                                <Link key={id} href={`/writings/${id}`} rel="noopener noreferrer">
                                    <span className="border-b-2 border-b-slate-400 text-slate-200 text-xl">{title.length > 70 ? title.slice(0, 70) + "..." : title}</span>
                                    <p className='text-gray-400 text-sm'>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-gray-200">{description}</p>
                                </Link>
                            </div>
                        )
                    })
                }
            </section>


        </main>
    );
}
