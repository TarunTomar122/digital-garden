import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

// Fully static - only regenerates on deploy (projects don't change dynamically)
export const revalidate = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getProjectBySlug(slug);
  if (!doc) return notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-3xl
        prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground
        prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-foreground
        prose-li:marker:text-foreground/60 prose-blockquote:text-foreground/80 prose-blockquote:border-muted/60 prose-hr:border-muted/50
        prose-pre:bg-foreground/10 prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:ring-1 prose-pre:ring-muted/50 prose-pre:overflow-x-auto prose-pre:font-mono">
        <p className="font-display text-4xl">{doc.meta.title}</p>
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
      </article>
    </main>
  );
}


