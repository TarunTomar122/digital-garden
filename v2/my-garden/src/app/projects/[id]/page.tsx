import { notFound } from 'next/navigation';
import { getProjectById } from '@/utils/projectsAPI';

import Project from '@/components/Project/Project';

import { saturation, lightness, getContrastYIQ } from '@/utils/colorsAPI';

interface ProjectsProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: ProjectsProps) {

    const project = getProjectById(params.id);

    if (!project) {
        notFound();
    }

    console.log('project: ', project);

    return (

        <main className='flex justify-center xl:px-60 font-light'>
            <div className='min-w-full md:container px-8  md:px-28 lg:px-60'>

                {/* Header */}
                <section className="md:leading-10 leading-8 border-b-2 border-gray-400 border-opacity-40">
                    <p className="text-3xl md:text-4xl py-4">{project.title}</p>
                    {/** Display tags as rounded buttons with random colors*/}
                    <div className="flex flex-wrap">
                        {
                            project.tags.map((tag: string) => {
                                const hue = Math.floor(Math.random() * 360);
                                const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                                const fontColor = getContrastYIQ(hue, saturation, lightness);
                                return (
                                    <span
                                        key={tag}
                                        className="text-xs rounded-full px-2 py-1 m-1"
                                        style={{
                                            backgroundColor: backgroundColor,
                                            color: fontColor
                                        }}
                                    >
                                        {tag}
                                    </span>
                                );
                            })
                        }
                    </div>

                    <section className="text-slate-200 text-md my-2 leading-7">
                        <p>{project.description}</p>
                    </section>

                    {/* project links */}
                    {project.links && project.links.length > 0 && (
                        <section className="flex flex-row gap-4">
                            {
                                project.links.map(({ type, url }) => {
                                    return (
                                        <div key={url}>

                                            {type === 'website' && (
                                                <a href={url} target
                                                    ="_blank" rel="noopener noreferrer"
                                                    className='text-slate-200 items-center'>
                                                    website
                                                    <span className="h-5 inline-block ml-1 text-center align-middle">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill={
                                                            // fill a random bright color pastel color 
                                                            `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`
                                                        }><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" /></svg>
                                                    </span>
                                                </a>
                                            )}

                                            {type === 'github' && (
                                                <a href={url} target="_blank" rel="noopener noreferrer"
                                                    className='text-slate-200'>
                                                    github
                                                    <span className="h-5 inline-block ml-1 text-center align-middle">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill={
                                                            // fill a random bright color pastel color 
                                                            `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`
                                                        }><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" /></svg>
                                                    </span>
                                                </a>
                                            )}

                                        </div>
                                    )
                                }
                                )
                            }
                        </section>
                    )}

                </section>

                {/* project */}
                <section className=" text-slate-400">
                    <Project projectData={project} />
                </section>
            </div>
        </main>

    );
}