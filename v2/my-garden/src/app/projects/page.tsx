import { getAllProjects } from "@/actions/projects"
import ProjectList from "@/components/Project/ProjectList"
import ProjectListSkeleton from "@/components/ProjectList/ProjectListSkeleton";
import { Project } from '@/actions/projects';
import { Suspense } from "react";``

export default async function Page() {
    const projects = await getAllProjects();

    // order the projects by date
    projects.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });


    return (
        <main className='flex justify-center xl:px-60'>
            <div className='min-w-full md:container px-8  md:px-28 lg:px-60'>

                {/* Header */}
                <section>
                    <p className="text-3xl md:text-4xl py-4">Projects</p>
                    <section className="text-slate-400 md:leading-10 leading-8 text-lg">
                        <p>A museum of my half finished art.</p>
                    </section>
                </section>
                
                <Suspense fallback={<ProjectListSkeleton/>}>
                    <ProjectList projects={projects as Project[]} />
                </Suspense>

            </div>
        </main>
    )
}