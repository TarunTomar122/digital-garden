"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectMeta } from "@/lib/projects";

const PAGE_SIZE = 7;

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

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
        <div className="pill-row" role="group" aria-label="Filter projects by tag">
          <button
            onClick={() => handleTagChange(null)}
            className={`pill ${selectedTag === null ? "active" : ""}`}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag === selectedTag ? null : tag)}
              className={`pill ${selectedTag === tag ? "active" : ""}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ul className="cards" key={selectedTag ?? "all"}>
        {paginatedProjects.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="card">
              <div className="card-row">
                <div className="card-body">
                  <h3 className="card-title card-title-sm">{p.title}</h3>
                  {p.description ? (
                    <p className="card-desc">{p.description}</p>
                  ) : null}
                  {p.date || (p.tags && p.tags.length > 0) ? (
                    <p className="project-card-meta">
                      {p.date ? formatDate(p.date) : null}
                      {p.date && p.tags && p.tags.length > 0 ? (
                        <span className="sep">·</span>
                      ) : null}
                      {p.tags && p.tags.length > 0 ? p.tags.join(", ") : null}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {paginatedProjects.length === 0 && (
        <p className="note" style={{ marginTop: "24px" }}>
          No projects found with this tag.
        </p>
      )}

      {totalPages > 1 && (
        <footer aria-label="Pagination">
          <div className="prev-next">
            {currentPage > 1 ? (
              <button className="link-btn" onClick={() => setCurrentPage(currentPage - 1)}>
                ← Previous
              </button>
            ) : (
              <span />
            )}
            <span className="desc">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <button className="link-btn" onClick={() => setCurrentPage(currentPage + 1)}>
                Next →
              </button>
            ) : (
              <span />
            )}
          </div>
        </footer>
      )}
    </>
  );
}
