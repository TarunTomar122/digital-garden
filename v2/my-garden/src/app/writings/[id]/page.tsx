import { notFound } from 'next/navigation';
import { getAllWritings, getWritingById } from '@/utils/writingsAPI';
import { remark } from 'remark';
import html from 'remark-html';

interface WritingProps {
    params: {
        id: string;
    };
}

export async function generateStaticParams() {
    const writings = getAllWritings();
    return writings.map((writing) => ({
        id: writing.id,
    }));
}

export default async function Page({ params }: WritingProps) {

    const writing = getWritingById(params.id);

    if (!writing) {
        notFound();
    }

    const processedContent = await remark().use(html).process(writing.content);
    const contentHtml = processedContent.toString();

    return (
        <main className="flex min-h-screen flex-col px-16 md:px-24 lg:px-48 xl:px-96">
            <p>WIP...</p>
        </main>
    )

    return (

        <main className="flex min-h-screen flex-col px-16 md:px-24 lg:px-48 xl:px-96">

            {/* Header */}
            <section className="py-8">
                <p className="text-2xl py-4">{writing.title}</p>
                <section className="text-slate-400 leading-4 text-lg">
                    <p>{writing.description}</p>
                </section>
            </section>

            {/* Writings */}
            <section className="py-8">
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </section>

        </main>

    );
}