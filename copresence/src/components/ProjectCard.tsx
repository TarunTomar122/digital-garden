import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link href={`/projects/${project.slug}`} className={`project-tile${project.cover ? " project-tile-with-cover" : ""}`}>
      {project.cover ? (
        <div className="project-tile-preview">
          <Image
            src={project.cover}
            alt=""
            width={640}
            height={400}
            sizes="(max-width: 640px) calc(100vw - 68px), 220px"
          />
        </div>
      ) : null}
      <div className="project-tile-body">
        {project.date ? <span className="project-tile-date">{formatDate(project.date)}</span> : null}
        <h3>{project.title}</h3>
        {project.description ? <p>{project.description}</p> : null}
        {project.tags && project.tags.length > 0 ? (
          <ul className="project-tile-tags">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
