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
                                <a className="cursor-alias pt-2 pb-6 px-6 hobbies-card bg-neutral-50 border rounded shadow flex flex-col justify-between" key={index} href={hobby.link} target="_blank" rel="noopener noreferrer">

                                    <div>
                                        <p className="text-lg font-medium text-gray-900">{hobby.title.length > 70 ? hobby.title.slice(0, 70) + "..." : hobby.title}</p>
                                        <p className="text-gray-600">{hobby.description}</p>
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
