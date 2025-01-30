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

        <main className='flex justify-center xl:px-60 font-light'>
            <div className='min-w-full md:container px-8  md:px-28 lg:px-60'>

                {/* Header */}
                <section className="md:leading-10 leading-8 pb-4 border-b-2 border-gray-400 border-opacity-40">
                    <p className="text-3xl md:text-4xl py-4">{writing.title}</p>
                    <section className="text-slate-200 text-md">
                        <p>{writing.description}</p>
                    </section>
                    <div className="flex justify-start py-2">
                        <LikeButton id={writing.id} type="post" />
                    </div>
                </section>

                {/* Writings */}
                <section className=" text-slate-400">
                    <Suspense fallback={<div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>}>
                        <Post postData={writing} />
                    </Suspense>
                </section>
            </div>
        </main>

    );
}