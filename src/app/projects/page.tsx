/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import data from './projects.json';
import "./projects.css";

export default function Page() {
    const projects = data['projects'];
    return (
        <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
            <p className="text-3xl lg:text-6xlfont-normal leading-relaxed">projects.</p>
            <p className="text-neutral-500 text:lg lg:text-xl font-light">I like building new stuff and sometimes I even finish what I start.</p>

            {/* Main Container */}
            <div className="pt-8 flex flex-col">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {
                        projects.map((project, index) => {
                            return (
                                <a className="cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" key={index} href={project.link} target="_blank" rel="noopener noreferrer">
                                    <div className='mb-2'>
                                        <p className='text-m lg:text-xl'>{project.title}</p>
                                        <p className="text-sm lg:text-lg text-gray-600 pt-1">{project.description}</p>
                                    </div>
                                    <img src={project.img} className="border-2 border-red-50 mt-3 rounded-t" alt={project.title} />
                                </a>
                            )
                        })
                    }
                </div>
            </div>

        </main>
    )
}
