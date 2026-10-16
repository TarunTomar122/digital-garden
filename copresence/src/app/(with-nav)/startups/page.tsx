import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/startups",
  "Startups",
  "Explore Tarat's startups: StocksBrew, Trace, and the Trace mobile app, with product links and progress."
);

import { getUniquePageviews, getAppInstalls } from "@/lib/posthogAPI";

export const revalidate = 21600; // 6 hours

const startups = [
  {
    name: "stocksbrew.online",
    tagline: "Tells you what to do with your stocks.",
    link: "https://stocksbrew.online",
  },
  {
    name: "yourtrace.online",
    tagline: "Tells you the 10 big things in tech and AI every morning",
    link: "https://yourtrace.online",
  },
  {
    name: "trace mobile app",
    tagline: "Replaces your doomscrolling with news-scrolling",
    link: "https://play.google.com/store/apps/details?id=online.yourtrace.app",
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

  const series = [stocksbrewViews?.data, yourtraceViews?.data, appInstallData?.data];

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <h1>
            Startups <span className="page-count">({startups.length})</span>
          </h1>
          <p className="note">
            I build stuff and then sometimes people use it. These are my most recent ones.
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
