import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";

export default function RelatedContent({
  paths,
  currentPath,
}: {
  paths?: string[];
  currentPath: string;
}) {
  if (!paths?.length) return null;

  const publicContent = [
    ...getAllProjects().map((project) => ({
      href: `/projects/${project.slug}`,
      title: project.title,
    })),
    ...getAllWritings().map((writing) => ({
      href: `/writings/${writing.slug}`,
      title: writing.title,
    })),
  ];
  const related = [...new Set(paths)]
    .filter((path) => path !== currentPath)
    .flatMap((path) => {
      const entry = publicContent.find((item) => item.href === path);
      return entry ? [entry] : [];
    })
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="prose-garden" aria-label="Related projects and writings">
      <h2>Related projects and writings</h2>
      <ul>
        {related.map((entry) => (
          <li key={entry.href}>
            <Link href={entry.href}>{entry.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
