import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";
import Link from "next/link";

// Fully static - only regenerates on deploy (projects don't change dynamically)
export const revalidate = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getProjectBySlug(slug);
  if (!doc) return {};

  const title = doc.meta.title;
  const description = doc.meta.description ?? "Project from Tarats Garden.";
  const canonicalPath = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE_PATH }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getProjectBySlug(slug);
  if (!doc) return notFound();
  const projects = getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const previous = projects[index + 1];
  const next = projects[index - 1];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: doc.meta.title,
    description: doc.meta.description,
    dateCreated: doc.meta.date,
    url: `https://www.tarat.space/projects/${slug}`,
    author: { "@type": "Person", name: "Tarat" },
  }).replace(/</g, "\\u003c");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-3xl
        prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
        prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground prose-th:text-foreground prose-td:text-foreground/90
        prose-li:marker:text-foreground/60 prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
        prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <h1 className="font-display text-4xl">{doc.meta.title}</h1>
        {doc.meta.description ? (
          <p className="text-muted">{doc.meta.description}</p>
        ) : null}
        {doc.meta.links && doc.meta.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {doc.meta.links.map((l, idx) => (
              <a key={idx} href={l.url} className="underline underline-offset-4 hover:opacity-80" target="_blank" rel="noreferrer">
                {l.type ? l.type : "link"}
              </a>
            ))}
          </div>
        )}
        <MDXRemote
          source={doc.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypePrettyCode, { theme: "github-light", keepBackground: false }]],
            },
          }}
        />
        <nav aria-label="More projects" className="not-prose mt-12 grid gap-4 border-t border-muted/40 pt-6 text-sm sm:grid-cols-2">
          {previous ? <Link href={`/projects/${previous.slug}`} className="underline underline-offset-4">← {previous.title}</Link> : <span />}
          {next ? <Link href={`/projects/${next.slug}`} className="text-right underline underline-offset-4">{next.title} →</Link> : <span />}
          <Link href="/projects" className="sm:col-span-2 text-center underline underline-offset-4">All projects</Link>
        </nav>
      </article>
    </main>
  );
}
