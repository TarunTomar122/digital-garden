'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/actions/projects';

export default function ProjectList({ projects }: { projects: Project[] }) {
    const [filteredProjects] = useState<Project[]>(projects);

    return (
        <div>
            {/* Projects */}
            <section className="">
                {filteredProjects.map(({ id, title, description, tags, thumbnail }, index) => (
                    <Link href={`/projects/${id}`} key={id} className="group">
                        <article className="h-full bg-[#202020] md:rounded-lg overflow-hidden transition-all duration-300 border-slate-700/60 hover:border-slate-200/60">
                            <div className="py-6">
                                <div className="flex items-center gap-4 mb-3">
                                    <h2 className="text-2xl text-slate-200 group-hover:text-white transition-colors">
                                        {title.length > 70 ? title.slice(0, 70) + "..." : title}
                                    </h2>
                                    <span className="text-slate-500 group-hover:text-slate-400 transition-colors flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                            <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                                        </svg>
                                    </span>
                                </div>

                                <p className="text-slate-400 text-m leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors">
                                    {description}
                                </p>
                            </div>
                        </article>
                    </Link>
                ))}
            </section>
        </div>
    );
}