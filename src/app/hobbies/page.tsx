/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import './hobbies.css';
import data from './hobbies.json';
export default function Page() {
    const hobbies = data['hobbies'];
    return (
        <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
            <p className="text-3xl lg:text-6xl font-normal leading-relaxed">hobbies.</p>
            <p className="text-neutral-500 text:lg lg:text-xl font-light">Some days I am playing classical tunes on my piano and on others I'm climbing paper walls.</p>

            <div className="pt-8 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        hobbies.map((hobby, index) => {
                            return (
                                <a className="cursor-alias py-6 px-6 hobbies-card bg-neutral-50 border rounded shadow flex flex-col justify-between" key={index} href={hobby.link} target="_blank" rel="noopener noreferrer">

                                    <div className='grid grid-cols-8'>
                                        
                                        <div className='col-span-7'>
                                            <p className="text-lg font-medium text-gray-900">{hobby.title.length > 70 ? hobby.title.slice(0, 70) + "..." : hobby.title}</p>
                                            <p className="text-gray-600">{hobby.description}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 col-span-1 justify-self-end">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                        </svg>

                                    </div>

                                    <div className="mt-6 gap-3 flex flex-col">

                                        <img src={hobby.img} alt={hobby.title} className="rounded shadow" />

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
