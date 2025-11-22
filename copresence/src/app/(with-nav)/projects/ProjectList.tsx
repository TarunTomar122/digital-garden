"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectMeta } from "@/lib/projects";

export default function ProjectList({ projects }: { projects: ProjectMeta[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  ).sort();

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags?.includes(selectedTag))
    : projects;

  return (
    <div className="space-y-8">
      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors border ${
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
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors border ${
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

      {/* Project List */}
      <ul className="space-y-4">
        {filteredProjects.map((p) => (
          <li key={p.slug}>
            <div className="space-y-1">
              <Link
                prefetch
                href={`/projects/${p.slug}`}
                className="underline underline-offset-4 hover:opacity-80"
              >
                {p.title}
              </Link>
              {p.description ? (
                <p className="text-muted text-sm">{p.description}</p>
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
        {filteredProjects.length === 0 && (
            <p className="text-muted italic">No projects found with this tag.</p>
        )}
      </ul>
    </div>
  );
}

