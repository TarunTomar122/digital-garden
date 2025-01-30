'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Project } from '@/actions/projects';

import { saturation, lightness, getContrastYIQ } from '@/utils/colorsAPI';

export default function ProjectList({ projects }: { projects: Project[] }) {
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Memoize selected tags to avoid unnecessary re-renders
    const selectedTags = useMemo(() => searchParams.getAll('tag'), [searchParams]);

    useEffect(() => {
        if (selectedTags.length > 0) {
            setFilteredProjects(projects.filter(project =>
                selectedTags.every(tag => project.tags.includes(tag))
            ));
        } else {
            setFilteredProjects(projects);
        }
    }, [projects, selectedTags]);

    const handleTagClick = (tag: string) => {
        // Add or remove the tag from the selected tags array
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        // Update the URL with the new selected tags
        router.push(`/projects?${newTags.map(t => `tag=${t}`).join('&')}`);
    };

    const clearFilter = (selectedTag: string) => {
        const newTags = selectedTags.filter(tag => tag !== selectedTag);
        router.push(`/projects?${newTags.map(t => `tag=${t}`).join('&')}`);
    };

    const hue = Math.floor(Math.random() * 360)

    return (
        <div>

            {/* Selected Tag */}
            {selectedTags.length > 0 && (
                <div className="pb-1 flex flex-row">
                    {selectedTags.map((selectedTag) => (

                        <div
                            key={selectedTag}
                            className="text-xs rounded-full px-2 py-1 m-1 flex items-center"
                            style={{
                                backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                                color: getContrastYIQ(hue, saturation, lightness)
                            }}
                        >
                            {selectedTag}

                            <svg onClick={() => clearFilter(selectedTag)} className="cursor-pointer" viewBox="0 -0.5 25 25" height="20px" width="20px" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                                    <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#000000"></path>
                                </g>
                            </svg>

                        </div>

                    ))}
                </div>
            )
            }



            {/* Projects */}
            <section className="pb-20">
                {
                    filteredProjects.map(({ id, title, description, category, tags }) => {
                        return (
                            <div className="py-6 md:leading-10 leading-8" key={id}>
                                <div className="flex items-center justify-between">
                                    <Link key={id} href={`/projects/${id}`} rel="noopener noreferrer">
                                        <span className="text-slate-200 text-xl">
                                            {title.length > 70 ? title.slice(0, 70) + "..." : title}
                                            <span className="h-6 inline-block ml-2 text-center align-middle">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill={`rgb(226 232 240)`}><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" /></svg>
                                            </span>
                                        </span>
                                    </Link>
                              
                                </div>

                                {/** Display tags as rounded buttons with random colors*/}
                                <div className="flex flex-wrap">
                                    {
                                        tags.map((tag: string) => {
                                            const hue = Math.floor(Math.random() * 360);
                                            const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                                            const fontColor = getContrastYIQ(hue, saturation, lightness);
                                            return (
                                                <span
                                                    key={tag}
                                                    className="text-xs rounded-full px-2 py-1 m-1 cursor-pointer"
                                                    style={{
                                                        backgroundColor: backgroundColor,
                                                        color: fontColor
                                                    }}
                                                    onClick={() => handleTagClick(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            );
                                        })
                                    }
                                </div>

                                <p className="text-gray-200 leading-7 mt-2">{description}</p>

                            </div>
                        )
                    })
                }
            </section>
        </div >
    )
}