"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectMeta } from "@/lib/projects";

const PAGE_SIZE = 7;

interface ProjectListProps {
  projects: ProjectMeta[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  ).sort();

  // Filter projects by tag first
  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags?.includes(selectedTag))
    : projects;

  // Then paginate the filtered results
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(start, start + PAGE_SIZE);

  // Reset to page 1 when tag changes
  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Mobile: Tag filters shown inline */}
      {allTags.length > 0 && (
        <div className="md:hidden flex flex-wrap gap-2">
          <button
            onClick={() => handleTagChange(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors border cursor-pointer ${
              selectedTag === null
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted border-transparent hover:bg-black/5"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors border cursor-pointer ${
                selectedTag === tag
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted border-transparent hover:bg-black/5"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Desktop: Tag filters positioned to the left */}
      <div className="hidden md:block relative">
        {/* Tag selector - positioned absolutely to the left */}
        {allTags.length > 0 && (
          <div className="absolute top-0 bottom-0 right-full mr-8 flex items-start">
            <div className="sticky top-24 space-y-1.5 text-right" style={{ minWidth: "120px" }}>
              <button
                onClick={() => handleTagChange(null)}
                className={[
                  "block w-full text-right text-sm py-0.5 transition-colors cursor-pointer",
                  selectedTag === null
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted/70 hover:text-foreground",
                ].join(" ")}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag === selectedTag ? null : tag)}
                  className={[
                    "block w-full text-right text-sm py-0.5 transition-colors cursor-pointer",
                    selectedTag === tag
                      ? "text-foreground underline underline-offset-4"
                      : "text-muted/70 hover:text-foreground",
                  ].join(" ")}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project List */}
        <ul className="space-y-6">
          {paginatedProjects.map((p) => (
            <li key={p.slug}>
              <div className="space-y-1">
                <Link
                  prefetch={false}
                  href={`/projects/${p.slug}`}
                  className="text-lg font-medium underline underline-offset-4 hover:opacity-80"
                >
                  {p.title}
                </Link>
                {p.description ? (
                  <p className="text-muted">{p.description}</p>
                ) : null}
              </div>
            </li>
          ))}
          {paginatedProjects.length === 0 && (
            <p className="text-muted italic">No projects found with this tag.</p>
          )}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-muted/40 mt-8">
            {currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="underline underline-offset-4 hover:opacity-80 cursor-pointer"
              >
                ← Previous
              </button>
            ) : (
              <div></div>
            )}
            <span className="text-sm text-muted">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="underline underline-offset-4 hover:opacity-80 cursor-pointer"
              >
                Next →
              </button>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>

      {/* Mobile: Project List */}
      <div className="md:hidden space-y-8">
        <ul className="space-y-4">
          {paginatedProjects.map((p) => (
            <li key={p.slug}>
              <div className="space-y-1">
                <Link
                  prefetch={false}
                  href={`/projects/${p.slug}`}
                  className="text-lg font-medium underline underline-offset-4 hover:opacity-80"
                >
                  {p.title}
                </Link>
                {p.description ? (
                  <p className="text-muted">{p.description}</p>
                ) : null}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-xs text-muted/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
          {paginatedProjects.length === 0 && (
            <p className="text-muted italic">No projects found with this tag.</p>
          )}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-muted/40">
            {currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="underline underline-offset-4 hover:opacity-80 cursor-pointer"
              >
                ← Previous
              </button>
            ) : (
              <div></div>
            )}
            <span className="text-sm text-muted">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="underline underline-offset-4 hover:opacity-80 cursor-pointer"
              >
                Next →
              </button>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

