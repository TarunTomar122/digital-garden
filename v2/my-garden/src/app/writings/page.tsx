import { getAllWritings } from '@/utils/writingsAPI';
import Link from 'next/link';

export default function Page() {

    const writings = getAllWritings();

    // order the writings by date
    writings.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <main className='flex justify-center xl:px-60'>
            <div className='min-w-full md:container px-12  md:px-28 lg:px-60'>

                {/* Header */}
                <section>
                    <p className="text-3xl md:text-4xl py-4">Writings</p>
                    <section className="text-slate-400 md:leading-10 leading-8 text-lg">
                        <p>Shower thoughts and everything else</p>
                    </section>
                </section>


                {/* Writings */}
                <section className="pb-20">
                    {
                        writings.map(({ id, title, description, category, date }) => {
                            return (
                                <div className="py-6 md:leading-10 leading-8" key={id}>
                                    <Link key={id} href={`/writings/${id}`} rel="noopener noreferrer">
                                        <span className="text-slate-200 text-xl">
                                            {title.length > 70 ? title.slice(0, 70) + "..." : title}
                                            {/* <img src="./arrow.svg" alt="arrow" className="h-6 inline-block ml-2" /> */}
                                            <span className="h-6 inline-block ml-2 text-center align-middle">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill={
                                                    // fill a random bright color pastel color 
                                                    `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`
                                                }><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" /></svg>
                                            </span>
                                        </span>
                                        <p className='text-gray-400 text-xs'>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="text-gray-200">{description}</p>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </section>
            </div >

        </main >
    );
}
