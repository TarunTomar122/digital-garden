import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ProjectLink = { type?: string; url: string };

export type ProjectMeta = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  links?: ProjectLink[];
};

const projectsDir = path.join(process.cwd(), "projects");

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(projectsDir)) return [];
  const files = fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const items = files.map((filename) => {
    const fullPath = path.join(projectsDir, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const firstLine = (content.split("\n")[0] || "").trim();
    const derivedTitle = firstLine.replace(/^#\s+/, "").trim();
    const title = (data.title as string) || derivedTitle || filename.replace(/\.(md|mdx)$/i, "");
    const description = (data.description as string) || undefined;
    const date = (data.date as string) || undefined;
    const slug = filename.replace(/\.(md|mdx)$/i, "");
    return { slug, title, description, date } satisfies ProjectMeta;
  });

  return items.sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : -1;
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

export function getProjectBySlug(
  slug: string
): { content: string; meta: ProjectMeta } | null {
  const candidates = [
    path.join(projectsDir, `${slug}.md`),
    path.join(projectsDir, `${slug}.mdx`),
  ];
  const existing = candidates.find((p) => fs.existsSync(p));
  if (!existing) return null;
  const raw = fs.readFileSync(existing, "utf8");
  const { data, content } = matter(raw);
  const firstLine = (content.split("\n")[0] || "").trim();
  const derivedTitle = firstLine.replace(/^#\s+/, "").trim();
  const title = (data.title as string) || derivedTitle || slug;
  const description = (data.description as string) || undefined;
  const date = (data.date as string) || undefined;
  const links: ProjectLink[] | undefined = normalizeLinks((data as any).links);
  return { content, meta: { slug, title, description, date, links } };
}

function normalizeLinks(input: any): ProjectLink[] | undefined {
  if (!input) return undefined;
  const output: ProjectLink[] = [];
  if (Array.isArray(input)) {
    let pendingType: string | undefined = undefined;
    for (const item of input) {
      if (typeof item === "string") {
        output.push({ url: item });
        pendingType = undefined;
        continue;
      }
      if (item && typeof item === "object") {
        if (typeof item.url === "string") {
          output.push({ type: item.type ?? pendingType, url: item.url });
          pendingType = undefined;
          continue;
        }
        if (typeof item.type === "string") {
          pendingType = item.type;
          continue;
        }
        // fallback keys some people use
        const url = item.link || item.href;
        if (typeof url === "string") {
          output.push({ type: item.type ?? pendingType, url });
          pendingType = undefined;
        }
      }
    }
  } else if (typeof input === "object") {
    for (const [key, val] of Object.entries(input)) {
      if (typeof val === "string") output.push({ type: key, url: val });
    }
  }
  return output.length ? output : undefined;
}


