import { getUniquePageviews, getAppInstalls } from "@/lib/posthogAPI";

export const revalidate = 21600; // 6 hours

const startups = [
  {
    name: "stocksbrew.online",
    tagline: "Know what to do with your stocks.",
    link: "https://stocksbrew.online",
    highlight: "$30 MRR",
  },
  {
    name: "yourtrace.online",
    tagline: "The fastest way to catch up with tech.",
    link: "https://yourtrace.online",
    highlight: "$29 MRR",
  },
  {
    name: "trace mobile app",
    tagline: "TikTok for news.",
    link: "https://play.google.com/store/apps/details?id=online.yourtrace.app",
    highlight: "500+ total downloads",
  },
];

function Sparkline({ data }: { data?: number[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  return (
    <div className="sparkline">
      {data.map((v, i) => (
        <div key={i} className="bar" data-value={v} style={{ height: `${Math.max((v / max) * 100, 3)}%` }} />
      ))}
    </div>
  );
}

export default async function StartupsPage() {
  const [stocksbrewViews, yourtraceViews, appInstallData] = await Promise.all([
    getUniquePageviews(["tikrr.online", "stocksbrew.online"]),
    getUniquePageviews("yourtrace.online"),
    getAppInstalls(),
  ]);

  const stats = [stocksbrewViews?.total, yourtraceViews?.total, appInstallData?.total];
  const series = [stocksbrewViews?.data, yourtraceViews?.data, appInstallData?.data];

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header>
          <h1>Startups</h1>
          <p className="note">Building stuff, one stupid idea at a time.</p>
        </header>

        <ul className="list-plain">
          {startups.map((s, idx) => (
            <li key={s.name}>
              <a href={s.link} target="_blank" rel="noreferrer">{s.name}</a> — <span className="desc">{s.tagline}</span>
              <Sparkline data={series[idx]} />
              <p className="desc">{s.highlight}{stats[idx] ? ` · ${stats[idx]} ${idx === 2 ? "downloads" : "unique visitors"} (30d)` : ""}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
