import { notFound } from 'next/navigation';
import { getProjectById } from '@/actions/projects';

import Project from '@/components/Project/Project';
import LikeButton from '@/components/LikeButton/LikeButton';

import { saturation, lightness, getContrastYIQ } from '@/utils/colorsAPI';

interface ProjectsProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: ProjectsProps) {

    const {id} = await params;

    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    return (

        <main className='flex justify-center xl:px-40 2xl:px-60'>
            <div className='min-w-full px-8 md:container md:px-28 lg:px-60 mb-20 py-2 md:py-8'>
                {/* Header */}
                <section className="pb-8 border-b border-slate-700/40">
                    <p className="text-3xl md:text-4xl text-white mb-4">{project.title}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag: string) => (
                            <span
                                key={tag}
                               className="text-xs border-b border-slate-600 py-0.5 mx-1 text-slate-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <section className="text-slate-300 text-lg mb-6 leading-relaxed">
                        <p>{project.description}</p>
                    </section>

                    {/* project links */}
                    {project.links && project.links.length > 0 && (
                        <section className="flex flex-wrap gap-4">
                            {project.links.map(({ type, url }) => (
                                <a
                                    key={url}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    <span>{type}</span>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        height="16" 
                                        width="16" 
                                        viewBox="0 -960 960 960" 
                                        fill="currentColor"
                                    >
                                        <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                                    </svg>
                                </a>
                            ))}
                        </section>
                    )}
                </section>

                {/* project content */}
                <section className=" text-slate-300">
                    <Project projectData={project} />
                </section>
            </div>
        </main>

    );
}