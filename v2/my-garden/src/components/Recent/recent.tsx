import { getWeeklyTopSongs } from '@/utils/lastfmAPI';

import { getSpotifyEmbedLink } from '@/actions/spotifyembed';

type WeeklyTrack = {
    name: string;
    artist: { '#text': string };
    url: string;
}

export default async function Page() {
    let weeklyTrack: WeeklyTrack | null = null;

    const iframeHtml = await getSpotifyEmbedLink();

    console.log('recent stuff', iframeHtml);

    try {
        const res = await getWeeklyTopSongs('TaRaT_122');
        if (res && res.length > 1) {
            weeklyTrack = res.slice(1, 4)[0] as WeeklyTrack;
        }
    } catch (error) {
        console.error('Error fetching weekly top songs:', error);
    }

    return (
        <>
            <p className="text-3xl md:text-4xl font-extralight py-4">Recent</p>
            <section className="mt-4">
                <p className='text-slate-400 leading-8 text-lg md:leading-10 xl:pr-24 font-light mb-2'>I've been recently obsessed with</p>
                {
                    // show iframe if we have it
                    iframeHtml && <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
                }
                {/* <iframe style={{ borderRadius: '12px' }} src={"https://open.spotify.com/embed/track/" + { recentStuff } + "?utm_source=generator"} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> */}
            </section>
        </>
    );
}
