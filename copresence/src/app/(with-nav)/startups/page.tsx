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
        <header className="page-head">
          <p className="page-kicker">Ventures</p>
          <h1>
            Startups <span className="page-count">({startups.length})</span>
          </h1>
          <p className="note">
            Building stuff, one stupid idea at a time. Live numbers from the
            last 30 days.
          </p>
        </header>

        <ul className="cards">
          {startups.map((s, idx) => (
            <li key={s.name}>
              <div className="panel">
                <div className="card-row">
                  <div className="card-body">
                    <h3 className="card-title card-title-sm">
                      <a href={s.link} target="_blank" rel="noreferrer">
                        {s.name}
                      </a>
                    </h3>
                    <p className="card-meta">
                      {s.highlight}
                      {stats[idx] ? (
                        <>
                          <span className="sep">·</span>
                          {stats[idx]}{" "}
                          {idx === 2 ? "downloads" : "unique visitors"} (30d)
                        </>
                      ) : null}
                    </p>
                    <p className="card-desc">{s.tagline}</p>
                    <Sparkline data={series[idx]} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
