"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectMeta } from "@/lib/projects";

interface ProjectListProps {
  projects: ProjectMeta[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags || []))).sort();

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags?.includes(selectedTag))
    : projects;

  return (
    <>
      {allTags.length > 0 && (
        <div className="pill-row" role="group" aria-label="Filter projects by tag">
          <button
            onClick={() => setSelectedTag(null)}
            className={`pill ${selectedTag === null ? "active" : ""}`}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`pill ${selectedTag === tag ? "active" : ""}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ul className="project-showcase" key={selectedTag ?? "all"}>
        {filteredProjects.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>

      {filteredProjects.length === 0 && (
        <p className="note" style={{ marginTop: "24px" }}>
          No projects found with this tag.
        </p>
      )}
    </>
  );
}
