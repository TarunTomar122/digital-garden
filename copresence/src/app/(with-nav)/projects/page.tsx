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
    card: "summary_large_image",
    title: "Projects | Tarat's Garden",
    description: "Notes and build logs from ongoing/finished projects.",
  },
};

export default function ProjectsIndex() {
  const projects = getAllProjects();

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <p className="page-kicker">Builds</p>
          <h1>
            Projects <span className="page-count">({projects.length})</span>
          </h1>
          <p className="note">
            Notes and build logs from ongoing/finished projects. Written with
            AI, so yes — it smells a little like slop.
          </p>
        </header>

        <ProjectList projects={projects} />
      </div>
    </main>
  );
}
