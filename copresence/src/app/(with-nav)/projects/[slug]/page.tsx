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
  const description = doc.meta.description ?? "Project from Tarat's Garden.";
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
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <article className="prose prose-neutral max-w-none
          prose-headings:text-[#222] prose-strong:text-[#222] prose-em:text-[#222]
          prose-p:text-[#333] prose-li:text-[#333] prose-a:text-[#1a5fb4] prose-th:text-[#222] prose-td:text-[#333]
          prose-blockquote:text-[#555] prose-blockquote:border-[#ccc] prose-hr:border-[#eee]
          prose-pre:bg-[#f5f5f5] prose-pre:text-[#222] prose-pre:rounded-lg prose-pre:p-4 prose-pre:ring-1 prose-pre:ring-[#eee] prose-pre:overflow-x-auto prose-pre:font-mono">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
          <h1>{doc.meta.title}</h1>
          {doc.meta.description ? (
            <p className="note">{doc.meta.description}</p>
          ) : null}
          {doc.meta.links && doc.meta.links.length > 0 && (
            <div className="not-prose" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
              {doc.meta.links.map((l, idx) => (
                <a key={idx} href={l.url} target="_blank" rel="noreferrer">
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
        </article>
        <footer aria-label="More projects">
          <div className="prev-next">
            {previous ? <Link href={`/projects/${previous.slug}`}>← {previous.title}</Link> : <span />}
            {next ? <Link href={`/projects/${next.slug}`}>{next.title} →</Link> : <span />}
          </div>
          <Link href="/projects" className="all-link">All projects</Link>
        </footer>
      </div>
    </main>
  );
}
