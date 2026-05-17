import StartupCard from "@/components/StartupCard";
import { getUniquePageviews, getAppInstalls, dumpRecentEvents } from "@/lib/posthogAPI";

const startups = [
  {
    name: "tikrr.online",
    tagline: "Stock Market in 5 minutes.",
    link: "https://tikrr.online",
    color: "#f87171",
    metricLabel: "Unique visitors (30d)" as const,
    metricLabelShort: "Daily avg" as const,
  },
  {
    name: "yourtrace.online",
    tagline: "Personalized news feed.",
    link: "https://yourtrace.online",
    color: "#38bdf8",
    metricLabel: "Unique visitors (30d)" as const,
    metricLabelShort: "Daily avg" as const,
  },
  {
    name: "trace mobile app",
    tagline: "TikTok for news.",
    link: "https://play.google.com/store/apps/details?id=online.yourtrace.app",
    color: "#a78bfa",
    metricLabel: "Downloads (30d)" as const,
    metricLabelShort: "Daily avg" as const,
  },
];

export default async function StartupsPage() {
  await dumpRecentEvents()

  const [tikrrData, yourtraceData, appInstallData] = await Promise.all([
    getUniquePageviews("tikrr.online"),
    getUniquePageviews("yourtrace.online"),
    getAppInstalls(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl tracking-tight">
          my startups
        </h1>
        <p className="text-muted mt-1">
          building stuff, one stupid idea at a time.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <StartupCard {...startups[0]} data={tikrrData} />
        </div>
        <div className="md:col-span-2">
          <StartupCard {...startups[1]} data={yourtraceData} />
        </div>
        <div className="md:col-span-4">
          <StartupCard {...startups[2]} data={appInstallData} />
        </div>
      </div>
    </main>
  );
}
