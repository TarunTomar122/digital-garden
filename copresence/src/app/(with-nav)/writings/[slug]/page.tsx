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
    doc.meta.description ?? "Writing from Tarats Garden.";
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
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-3xl
        prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
        prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground prose-th:text-foreground prose-td:text-foreground/90
        prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
        prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <h1 className="font-display text-4xl">{doc.meta.title}</h1>
        {doc.meta.description ? (
          <p className="text-muted">{doc.meta.description}</p>
        ) : null}
        <div className="mt-2">
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
        <nav aria-label="More writings" className="not-prose mt-12 grid gap-4 border-t border-muted/40 pt-6 text-sm sm:grid-cols-2">
          {previous ? <Link href={`/writings/${previous.slug}`} className="underline underline-offset-4">← {previous.title}</Link> : <span />}
          {next ? <Link href={`/writings/${next.slug}`} className="text-right underline underline-offset-4">{next.title} →</Link> : <span />}
          <Link href="/writings" className="sm:col-span-2 text-center underline underline-offset-4">All writings</Link>
        </nav>
      </article>
    </main>
  );
}
