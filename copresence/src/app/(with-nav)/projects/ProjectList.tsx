"use client";

import { useState } from "react";
import Link from "next/link";
import LinkLoadingIndicator from "@/components/LinkLoadingIndicator";
import { ProjectMeta } from "@/lib/projects";

const PAGE_SIZE = 7;

interface ProjectListProps {
  projects: ProjectMeta[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags || []))).sort();

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags?.includes(selectedTag))
    : projects;

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(start, start + PAGE_SIZE);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <>
      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginBottom: "24px" }}>
          <button
            onClick={() => handleTagChange(null)}
            className={selectedTag === null ? "active" : ""}
            style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: selectedTag === null ? "#222" : "#777", textDecoration: selectedTag === null ? "underline" : "none" }}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag === selectedTag ? null : tag)}
              style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: selectedTag === tag ? "#222" : "#777", textDecoration: selectedTag === tag ? "underline" : "none" }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ul className="list-plain">
        {paginatedProjects.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`}>
              {p.title}
              <LinkLoadingIndicator />
            </Link>
            {p.description ? <p className="desc">{p.description}</p> : null}
          </li>
        ))}
        {paginatedProjects.length === 0 && <p className="note">No projects found with this tag.</p>}
      </ul>

      {totalPages > 1 && (
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {currentPage > 1 ? (
            <button onClick={() => setCurrentPage(currentPage - 1)} style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: "#1a5fb4" }}>
              ← Previous
            </button>
          ) : (
            <span />
          )}
          <span className="desc">Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages ? (
            <button onClick={() => setCurrentPage(currentPage + 1)} style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: "#1a5fb4" }}>
              Next →
            </button>
          ) : (
            <span />
          )}
        </footer>
      )}
    </>
  );
}
