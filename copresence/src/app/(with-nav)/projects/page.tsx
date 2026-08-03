import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import ProjectList from "./ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Notes and build logs from ongoing/finished projects.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    url: "/projects",
    title: "Projects | Tarat's Garden",
    description: "Notes and build logs from ongoing/finished projects.",
  },
  twitter: {
    card: "summary",
    title: "Projects | Tarat's Garden",
    description: "Notes and build logs from ongoing/finished projects.",
  },
};

export default function ProjectsIndex() {
  const projects = getAllProjects();

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header>
          <h1>Projects</h1>
          <p className="note">Notes and build logs from ongoing/finished projects.</p>
        </header>

        <ProjectList projects={projects} />
      </div>
    </main>
  );
}
