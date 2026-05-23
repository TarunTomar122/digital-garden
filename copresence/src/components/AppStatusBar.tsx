type App = {
  name: string;
  description: string;
  href: string;
  mrr?: string;
  users?: string;
};

const APPS: App[] = [
  {
    name: "stocksbrew.online",
    description: "Know what to do with your stocks.",
    href: "https://www.stocksbrew.online/",
    users: "recently launched",
  },
  {
    name: "yourtrace.online",
    description: "Personalized news feed.",
    href: "https://yourtrace.online",
    mrr: "$28 MRR",
  },
  {
    name: "tarat.youtube",
    description: "Indie dev journey.",
    href: "https://www.youtube.com/@tarat.youtube",
    users: "4,000+ subscribers",
  },
  {
    name: "trace - ai news & tech brief",
    description: "TikTok for news",
    href: "https://play.google.com/store/apps/details?id=online.yourtrace.app",
    users: "100+ downloads",
  },
  {
    name: "lumi - planner & habit tracker",
    description: "Habit tracker & day planner",
    href: "https://play.google.com/store/apps/details?id=com.lumi.mobile",
    users: "500+ downloads",
  },
  {
    name: "roastmyresume.fun",
    description: "Leaderboard for resumes",
    href: "https://roastmyresume.fun",
    users: "300+ resumes",
  },
];

export default function AppStatusBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {APPS.map((app) => (
        <a
          key={`${app.name}-${app.description}`}
          href={app.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.04] min-w-0"
        >
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">
              {app.name}
            </span>
            {app.mrr ? (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {app.mrr}
              </span>
            ) : null}
            {app.users ? (
              <span className="text-xs text-muted">
                {app.users}
              </span>
            ) : null}
          </div>
          <span className="text-sm text-muted leading-relaxed">
            {app.description}
          </span>
        </a>
      ))}
    </div>
  );
}
