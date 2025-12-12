import { notFound } from "next/navigation";
import { getWritingBySlug, getAllWritings } from "@/lib/writings";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import LikeButton from "@/components/LikeButton";
import InstagramEmbed from "@/components/InstagramEmbed";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllWritings().map((w) => ({ slug: w.slug }));
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getWritingBySlug(slug);
  if (!doc) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-3xl
        prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
        prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground
        prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
        prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
        <p className="font-display text-4xl">{doc.meta.title}</p>
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
      </article>
    </main>
  );
}


