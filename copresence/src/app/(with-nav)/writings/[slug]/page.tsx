import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWritingBySlug, getAllWritings } from "@/lib/writings";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import LikeButton from "@/components/LikeButton";
import InstagramEmbed from "@/components/InstagramEmbed";
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

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getWritingBySlug(slug);
  if (!doc) return notFound();
  const writings = getAllWritings();
  const index = writings.findIndex((writing) => writing.slug === slug);
  const previous = writings[index + 1];
  const next = writings[index - 1];

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
        <article className="prose prose-neutral max-w-none
          prose-headings:text-[#222] prose-strong:text-[#222] prose-em:text-[#222]
          prose-p:text-[#333] prose-li:text-[#333] prose-a:text-[#1a5fb4] prose-th:text-[#222] prose-td:text-[#333]
          prose-blockquote:text-[#555] prose-blockquote:border-[#ccc] prose-hr:border-[#eee]
          prose-pre:bg-[#f5f5f5] prose-pre:text-[#222] prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-[#eee] prose-pre:overflow-x-auto prose-pre:font-mono">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
          <h1>{doc.meta.title}</h1>
          {doc.meta.description ? (
            <p className="note">{doc.meta.description}</p>
          ) : null}
          <div className="not-prose mt-2">
            <LikeButton id={doc.meta.slug} type="writings" />
          </div>
          <MDXRemote
            source={doc.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypePrettyCode, { theme: "github-light", keepBackground: false }]],
              },
            }}
            components={{
              InstagramEmbed,
            }}
          />
        </article>
        <footer aria-label="More writings">
          <div className="prev-next">
            {previous ? <Link href={`/writings/${previous.slug}`}>← {previous.title}</Link> : <span />}
            {next ? <Link href={`/writings/${next.slug}`}>{next.title} →</Link> : <span />}
          </div>
          <Link href="/writings" className="all-link">All writings</Link>
        </footer>
      </div>
    </main>
  );
}
