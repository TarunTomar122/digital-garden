import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type WritingMeta = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
};

const writingsDir = path.join(process.cwd(), "writings");

export function getAllWritings(): WritingMeta[] {
  if (!fs.existsSync(writingsDir)) return [];
  const files = fs
    .readdirSync(writingsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const items = files.map((filename) => {
    const fullPath = path.join(writingsDir, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const firstLine = (content.split("\n")[0] || "").trim();
    const derivedTitle = firstLine.replace(/^#\s+/, "").trim();
    const title = (data.title as string) || derivedTitle || filename.replace(/\.(md|mdx)$/i, "");
    const description = (data.description as string) || undefined;
    const date = (data.date as string) || undefined;
    const slug = filename.replace(/\.(md|mdx)$/i, "");
    return { slug, title, description, date } satisfies WritingMeta;
  });

  return items.sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : -1;
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

export function getWritingBySlug(
  slug: string
): { content: string; meta: WritingMeta } | null {
  const candidates = [
    path.join(writingsDir, `${slug}.md`),
    path.join(writingsDir, `${slug}.mdx`),
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
  return { content, meta: { slug, title, description, date } };
}


