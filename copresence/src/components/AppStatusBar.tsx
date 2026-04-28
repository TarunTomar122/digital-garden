import Link from "next/link";

type App = {
  name: string;
  href: string;
  stat?: string;
};

const APPS: App[] = [
  {
    name: "trace",
    href: "https://yourtrace.online",
    stat: "$28 MRR",
  },
  {
    name: "lumi",
    href: "https://play.google.com/store/apps/details?id=com.lumi.mobile",
    stat: "500+ dls",
  },
  {
    name: "tikkr",
    href: "https://www.tikrr.online/",
    stat: "shipping soon",
  },
  {
    name: "roastmyresume",
    href: "https://roastmyresume.fun",
    stat: "300+",
  },
];

export default function AppStatusBar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {APPS.map((app) => (
        <a
          key={app.name}
          href={app.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3.5 py-1.5 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.04]"
        >
          <span className="text-sm font-medium text-foreground">
            {app.name}
          </span>
          {app.stat ? (
            <span className="text-xs text-muted group-hover:text-foreground/70 transition-colors">
              {app.stat}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
