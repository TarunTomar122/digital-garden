import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsIndex() {
  const projects = getAllProjects();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Projects</h1>
        <p className="text-muted">Notes and build logs from ongoing/finished projects.</p>
      </header>

      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.slug}>
            <div className="space-y-1">
              <Link prefetch href={`/projects/${p.slug}`} className="underline underline-offset-4 hover:opacity-80">
                {p.title}
              </Link>
              {p.description ? (
                <p className="text-muted text-sm">{p.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


