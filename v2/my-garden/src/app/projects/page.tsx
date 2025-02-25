import { getAllProjects } from "@/actions/projects"
import ProjectList from "@/components/Project/ProjectList"
import ProjectListSkeleton from "@/components/ProjectList/ProjectListSkeleton";
import { Project } from '@/actions/projects';
import { Suspense } from "react";

export default async function Page() {
    const projects = await getAllProjects();

    // order the projects by date
    projects.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <main className='flex justify-center xl:px-40 2xl:px-60 min-h-screen'>
            <div className='min-w-full px-8 md:container md:px-28 lg:px-60 py-2 md:py-8 mb-20'>
                {/* Header */}
                <section className="mb-12">
                    <p className="text-4xl md:text-5xl font-normal text-white pb-2">
                        Projects
                    </p>
                    <p className="text-slate-400 md:text-lg mt-4">
                        A museum of my half finished art.
                    </p>
                </section>
                
                <Suspense fallback={<ProjectListSkeleton/>}>
                    <ProjectList projects={projects as Project[]} />
                </Suspense>
            </div>
        </main>
    )
}