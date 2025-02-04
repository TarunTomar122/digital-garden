'use cache';
import { getSpotifyEmbedLink } from '@/actions/spotifyembed';
import { unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Page() {
    cacheLife('days')
    const iframeHtml = await getSpotifyEmbedLink();

    return (
        <>
            <p className="text-3xl md:text-4xl font-extralight py-4">Recent</p>
            <section className="mt-4">
                <p className='text-slate-400 leading-8 text-lg md:leading-10 xl:pr-24 font-light mb-2'>I've been recently obsessed with</p>
                {
                    iframeHtml && <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
                }
            </section>
        </>
    );
}
