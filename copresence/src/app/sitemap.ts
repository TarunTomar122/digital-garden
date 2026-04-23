import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/writings",
  "/projects",
  "/library",
  "/timeline",
  "/list100",
  "/easter-eggs",
  "/tarat-ai",
  "/network",
];

function toValidDate(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const writingEntries: MetadataRoute.Sitemap = getAllWritings().map((writing) => ({
    url: `${SITE_URL}/writings/${writing.slug}`,
    lastModified: toValidDate(writing.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: toValidDate(project.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...writingEntries, ...projectEntries];
}
