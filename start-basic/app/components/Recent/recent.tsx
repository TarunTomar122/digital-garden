import { getSpotifyEmbedLink } from '~/actions/spotifyembed';

export default async function Page() {
    const iframeHtml = await getSpotifyEmbedLink();
    console.log('rendering the recent component');
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
