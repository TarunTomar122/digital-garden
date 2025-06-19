import { notFound } from 'next/navigation';
import { getWritingById } from '@/actions/writingsActions';
import { Suspense } from 'react';
import Post from '@/components/Post/Post';
import LikeButton from '@/components/LikeButton/LikeButton';

interface WritingProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: WritingProps) {

    const {id} = await params;

    const writing = await getWritingById(id);

    if (!writing) {
        notFound();
    }

    return (

        <main className='flex justify-center xl:px-40 2xl:px-60 min-h-screen'>
            <div className='min-w-full md:container px-8 md:px-28 lg:px-60 py-2 md:py-8'>
                {/* Header */}
                <section className="pb-8 border-b border-slate-700/40">
                    <p className="text-4xl md:text-5xl font-normal text-white mb-4">{writing.title}</p>
                    <p className="text-slate-400 md:text-xl pl-1">{writing.description}</p>
                    <div className="mt-6">
                        <LikeButton id={writing.id} type="post" />
                    </div>
                </section>

                {/* Content */}
                <section>
                    <Suspense fallback={
                        <div className="space-y-4">
                            <div className="h-4 bg-slate-800/60 rounded w-full"></div>
                            <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-800/60 rounded w-4/6"></div>
                        </div>
                    }>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <Post postData={writing} />
                        </div>
                    </Suspense>
                </section>
            </div>
        </main>

    );
}