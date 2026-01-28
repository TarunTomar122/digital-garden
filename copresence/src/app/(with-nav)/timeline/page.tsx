"use client";

import { useState } from "react";

type TimelineItem = {
  /** "YYYY-MM" */
  date: string;
  title: string;
  detail?: string;
  link?: string;
};

const ITEMS: TimelineItem[] = [
  { date: "2022-06", title: "Interned at Adobe", detail: "Emerging Tech" },
  { date: "2023-04", title: "Finished B.Tech", detail: "Graduated college." },
  { date: "2023-06", title: "Joined Adobe", detail: "Design Engineer." },

  { date: "2024-01", title: "Started Running", detail: "Ran everyday for 30 days", link: "https://www.instagram.com/reel/C2zn2k1r0Km/" },
  { date: "2024-02", title: "Did a Snow Trek", detail: "Chandrashila trek", link: "https://www.instagram.com/reel/C3XuMkLLsgG/"},
  { date: "2024-04", title: "Met Monisha" },
  { date: "2024-09", title: "Got a cycle", detail: "Started long distance cycling" },
  { date: "2024-11", title: "Did a full marathon", detail: "5:30 hrs.", link: "https://www.strava.com/activities/12864710513/overview" },

  { date: "2025-01", title: "Got promoted at work", detail: "Design Engineer (SDE II)"},
  { 
    date: "2025-06", 
    title: "Launched my first Play Store app", 
    detail: "Lumi",
    link: "https://play.google.com/store/apps/details?id=com.lumi.mobile"
  },
  { date: "2025-08", title: "Google reposted my AI experiment", link: "https://x.com/googleaidevs/status/1958242650726814206" },
  { date: "2025-09", title: "Got a paid user for my app", link: "https://www.instafy.in/" },
  { date: "2025-09", title: "Visited NYC", detail: 'Ran the NYC marathon route' ,link: "https://www.instagram.com/p/DOjRzsyEiBU/?img_index=1" },
  { 
    date: "2025-10", 
    title: "2,000 YouTube subscribers",
  },
  { date: "2025-12", title: "Finished an Ultramarathon", detail: "51Kms in 6:47 hrs.", link: "https://www.strava.com/activities/16860926559" },

  { date: "2026-01", title: "Launched trace", link: "https://yourtrace.online", detail: "Product hunt #7 and $50 MRR in 1 week" },

];

function parseYearMonth(ym: string) {
  const [yStr, mStr] = ym.split("-");
  const year = Number(yStr);
  const monthIndex = Number(mStr) - 1; // 0-based
  return { year, monthIndex, date: new Date(year, monthIndex, 1) };
}

function formatYearMonth(ym: string) {
  const { date } = parseYearMonth(ym);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

export default function TimeLinePage() {
  const sorted = [...ITEMS].sort((a, b) => parseYearMonth(b.date).date.getTime() - parseYearMonth(a.date).date.getTime());

  const itemsByYear = sorted.reduce<Record<string, TimelineItem[]>>((acc, item) => {
    const { year } = parseYearMonth(item.date);
    const key = String(year);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  const years = Object.keys(itemsByYear).sort((a, b) => Number(b) - Number(a));

  // Default to 2025
  const [selectedYear, setSelectedYear] = useState("2026");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Timeline</h1>
        <p className="text-muted">A running log of moments, milestones, and little proofs of progress.</p>
      </header>

      {/* Mobile: show all years with year headers */}
      <div className="md:hidden space-y-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="font-display text-2xl mb-6">{year}</h2>
            <ol className="relative space-y-8 pl-6">
              {/* Single continuous vertical line for all items */}
              <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-muted/20" />
              
              {itemsByYear[year]?.map((item) => (
                <li key={`${item.date}-${item.title}`} className="relative flex gap-6 items-start">
                  {/* Circle centered on the line */}
                  <div className="absolute -left-6 top-2 h-3 w-3 rounded-full border-2 border-foreground/70 bg-background z-10" />

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <time className="text-xs uppercase tracking-wide text-muted/80 font-medium">
                      {formatYearMonth(item.date).toUpperCase()}
                    </time>
                    <div className="text-foreground text-lg inline-flex items-start gap-3">
                      <span>
                        <span className="font-medium">{item.title}</span>
                        {item.detail ? <span className="text-foreground/70"> — {item.detail}</span> : null}
                      </span>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-foreground transition-colors flex-shrink-0"
                          aria-label="Read more"
                        >
                          <span className="text-xl inline-block -rotate-45">→</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {/* Desktop: year selector positioned to the left like writings page dates */}
      <div className="hidden md:block relative">
        {/* Year selector - positioned absolutely to the left */}
        <div className="absolute top-0 bottom-0 right-full mr-8 flex items-start">
          <div className="sticky top-24 space-y-2 text-right" style={{ minWidth: "72px" }}>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={[
                  "block w-full text-right text-base font-medium py-1 transition-colors cursor-pointer",
                  selectedYear === year
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline content */}
        <ol className="relative space-y-8 pl-6">
          {/* Single continuous vertical line for all items */}
          <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-muted/20" />
          
          {itemsByYear[selectedYear]?.map((item) => (
            <li key={`${item.date}-${item.title}`} className="relative flex gap-6 items-start">
              {/* Circle centered on the line */}
              <div className="absolute -left-6 top-2 h-3 w-3 rounded-full border-2 border-foreground/70 bg-background z-10" />

              {/* Content */}
              <div className="flex-1 flex flex-col gap-1.5">
                <time className="text-xs uppercase tracking-wide text-muted/80 font-medium">
                  {formatYearMonth(item.date).toUpperCase()}
                </time>
                <div className="text-foreground text-lg inline-flex items-start gap-3">
                  <span>
                    <span className="font-medium">{item.title}</span>
                    {item.detail ? <span className="text-foreground/70"> — {item.detail}</span> : null}
                  </span>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-foreground transition-colors flex-shrink-0"
                      aria-label="Read more"
                    >
                      <span className="text-xl inline-block -rotate-45">→</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
