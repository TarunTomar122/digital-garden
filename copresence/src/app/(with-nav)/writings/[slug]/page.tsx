import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWritingBySlug, getAllWritings } from "@/lib/writings";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import LikeButton from "@/components/LikeButton";
import InstagramEmbed from "@/components/InstagramEmbed";
import MarkdownImage from "@/components/MarkdownImage";
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";
import Link from "next/link";

// Fully static - only regenerates on deploy (blogs don't change dynamically)
export const revalidate = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllWritings().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getWritingBySlug(slug);
  if (!doc) return {};

  const title = doc.meta.title;
  const description =
    doc.meta.description ?? "Writing from Tarat's Garden.";
  const canonicalPath = `/writings/${slug}`;
  const publishedTime = doc.meta.date
    ? (() => {
        const parsed = new Date(doc.meta.date);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
      })()
    : undefined;

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
      publishedTime,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
  };
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getWritingBySlug(slug);
  if (!doc) return notFound();
  const writings = getAllWritings();
  const index = writings.findIndex((writing) => writing.slug === slug);
  const previous = writings[index + 1];
  const next = writings[index - 1];

  const words = doc.content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.meta.title,
    description: doc.meta.description,
    datePublished: doc.meta.date,
    mainEntityOfPage: `https://www.tarat.space/writings/${slug}`,
    author: { "@type": "Person", name: "Tarat" },
  }).replace(/</g, "\\u003c");

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <article>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

          <header className="article-head">
            <p className="page-kicker">Writing</p>
            <h1>{doc.meta.title}</h1>
            {doc.meta.description ? (
              <p className="article-lede">{doc.meta.description}</p>
            ) : null}
            <div className="article-meta">
              <span className="desc">
                {formatDate(doc.meta.date)}
                <span className="sep">·</span>
                {minutes} min read
              </span>
              <LikeButton id={doc.meta.slug} type="writings" />
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
              components={{
                img: MarkdownImage,
                InstagramEmbed,
              }}
            />
          </div>
        </article>

        <footer aria-label="More writings">
          <div className={`post-nav ${!previous || !next ? "post-nav-single" : ""}`}>
            {previous ? (
              <Link href={`/writings/${previous.slug}`} className="card">
                <p className="post-nav-label">← Previous</p>
                <p className="post-nav-title">{previous.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/writings/${next.slug}`} className="card post-nav-next">
                <p className="post-nav-label">Next →</p>
                <p className="post-nav-title">{next.title}</p>
              </Link>
            ) : (
              <span />
            )}
          </div>
          <Link href="/writings" className="all-link">
            All writings
          </Link>
        </footer>
      </div>
    </main>
  );
}
