import { notFound } from 'next/navigation';
import { getWritingById } from '@/utils/writingsAPI';

import Post from '@/components/Post/Post';

interface WritingProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: WritingProps) {

    const writing = getWritingById(params.id);

    if (!writing) {
        notFound();
    }

    return (

        <main className="flex min-h-screen flex-col px-6 md:px-24 lg:px-48 xl:px-96">

            {/* Header */}
            <section className="pt-4 md:leading-10 leading-8">
                <p className="text-4xl py-4">{writing.title}</p>
                <section className="text-slate-200 text-lg">
                    <p>{writing.description}</p>
                </section>
            </section>

            {/* Writings */}
            <section className=" text-slate-400">
                <Post postData={writing}/>
            </section>

        </main>

    );
}