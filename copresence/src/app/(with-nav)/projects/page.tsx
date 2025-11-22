import { getAllProjects } from "@/lib/projects";
import ProjectList from "./ProjectList";

export const metadata = {
  title: "Projects | Tarats Garden",
  description: "Notes and build logs from ongoing/finished projects.",
};

export default function ProjectsIndex() {
  const projects = getAllProjects();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Projects</h1>
        <p className="text-muted">Notes and build logs from ongoing/finished projects.</p>
      </header>

      <ProjectList projects={projects} />
    </main>
  );
}
