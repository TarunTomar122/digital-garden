import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import MarkdownImage from "@/components/MarkdownImage";

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getProjectBySlug(slug);
  if (!doc) return notFound();
  const projects = getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const previous = projects[index + 1];
  const next = projects[index - 1];

  const words = doc.content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

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
        <article>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

          <header className="article-head">
            <h1>{doc.meta.title}</h1>
            {doc.meta.description ? (
              <p className="article-lede">{doc.meta.description}</p>
            ) : null}
            <div className="article-meta">
              {doc.meta.date ? (
                <span className="desc">
                  {formatDate(doc.meta.date)}
                  <span className="sep">·</span>
                  {minutes} min read
                </span>
              ) : null}
              {doc.meta.tags?.map((tag) => (
                <span key={tag} className="pill" style={{ cursor: "default" }}>
                  {tag}
                </span>
              ))}
              {doc.meta.links?.map((l, idx) => (
                <a
                  key={idx}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-pill"
                >
                  {l.type ? l.type : "link"}
                </a>
              ))}
            </div>
          </header>

          <div className="prose-garden">
            <MDXRemote
              source={doc.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [[rehypePrettyCode, { theme: "github-light", keepBackground: false }]],
                },
              }}
              components={{ img: MarkdownImage }}
            />
          </div>
        </article>

        <footer aria-label="More projects">
          <div className={`post-nav ${!previous || !next ? "post-nav-single" : ""}`}>
            {previous ? (
              <Link href={`/projects/${previous.slug}`} className="card">
                <p className="post-nav-label">← Previous</p>
                <p className="post-nav-title">{previous.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/projects/${next.slug}`} className="card post-nav-next">
                <p className="post-nav-label">Next →</p>
                <p className="post-nav-title">{next.title}</p>
              </Link>
            ) : (
              <span />
            )}
          </div>
          <Link href="/projects" className="all-link">
            All projects
          </Link>
        </footer>
      </div>
    </main>
  );
}
