/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import data from './list100.json';
export default function Page() {
    const things = data['list100'];
    return (
        <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
            <p className="text-3xl lg:text-6xl font-normal leading-relaxed">list 100</p>
            <p className="text-neutral-500 text:lg lg:text-xl font-light">100 things I wanna do before I turn 100</p>

            {/* Main Container */}
            <div className="pt-8 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        things.map((thing, index) => {
                            return (
                                <div key={index} className="flex flex-col p-4 bg-white rounded-lg shadow-md">
                                    <p className="text-lg font-light">{thing.name}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </main>
    )
}
