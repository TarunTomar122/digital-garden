import { notFound } from 'next/navigation';
import { getAllSeeds, getSeedById } from '@/utils/seedsAPI';
import { remark } from 'remark';
import html from 'remark-html';

interface SeedProps {
    params: {
        id: string;
    };
}

export async function generateStaticParams() {
    const seeds = getAllSeeds();
    return seeds.map((seed) => ({
        id: seed.id,
    }));
}

export default async function Page({ params }: SeedProps) {

    const seed = getSeedById(params.id);

    if (!seed) {
        notFound();
    }

    const processedContent = await remark().use(html).process(seed.content);
    const contentHtml = processedContent.toString();

    return (
        <div>
            <h1>{seed.title}</h1>
            <p>{seed.description}</p>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
    );
}