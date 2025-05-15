'use cache';
import { getSpotifyEmbedLink } from '@/actions/spotifyembed';
import { unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Page() {
    cacheLife('days')
    const iframeHtml = await getSpotifyEmbedLink();

    return (
        <>
            <section className="mt-0">
                {
                    iframeHtml && <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
                }
            </section>
        </>
    );
}
