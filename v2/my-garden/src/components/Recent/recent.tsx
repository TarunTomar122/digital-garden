import { getWeeklyTopSongs } from '@/utils/musicAPI';

type WeeklyTrack = {
    name: string;
    artist: { '#text': string };
    url: string;
}

export default async function Page() {
    let weeklyTrack: WeeklyTrack | null = null;

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
            <p className="text-2xl py-4">Recent</p>
            <section className="text-slate-400 md:leading-10 leading-8 text-lg">
                {weeklyTrack ? (
                    <p>Tarun is obsessed with
                        {" "}
                        <span className="border-b-2 border-b-slate-400 text-slate-200">
                            <a href={weeklyTrack.url} target="_blank">{weeklyTrack.name} by {weeklyTrack.artist['#text']}</a>
                        </span>
                    </p>
                ) : (
                    <p></p>
                )}
            </section>
        </>
    );
}
