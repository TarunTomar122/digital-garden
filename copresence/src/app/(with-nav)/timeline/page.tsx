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

  {
    date: "2024-01",
    title: "Started Running",
    detail: "Ran everyday for 30 days",
    link: "https://www.instagram.com/reel/C2zn2k1r0Km/",
  },
  {
    date: "2024-02",
    title: "Did a Snow Trek",
    detail: "Chandrashila trek",
    link: "https://www.instagram.com/reel/C3XuMkLLsgG/",
  },
  { date: "2024-04", title: "Met Monisha" },
  {
    date: "2024-09",
    title: "Got a cycle",
    detail: "Started long distance cycling",
  },
  {
    date: "2024-11",
    title: "Did a full marathon",
    detail: "5:30 hrs.",
    link: "https://www.strava.com/activities/12864710513/overview",
  },

  {
    date: "2025-01",
    title: "Got promoted at work",
    detail: "Design Engineer (SDE II)",
  },
  {
    date: "2025-06",
    title: "Launched my first Play Store app",
    detail: "Lumi",
    link: "https://play.google.com/store/apps/details?id=com.lumi.mobile",
  },
  {
    date: "2025-08",
    title: "Google reposted my AI experiment",
    link: "https://x.com/googleaidevs/status/1958242650726814206",
  },
  {
    date: "2025-09",
    title: "Got a paid user for my app",
    link: "https://www.instafy.in/",
  },
  {
    date: "2025-09",
    title: "Visited NYC",
    detail: "Ran the NYC marathon route",
    link: "https://www.instagram.com/p/DOjRzsyEiBU/?img_index=1",
  },
  {
    date: "2025-10",
    title: "2,000 YouTube subscribers",
  },
  {
    date: "2025-12",
    title: "Finished an Ultramarathon",
    detail: "51Kms in 6:47 hrs.",
    link: "https://www.strava.com/activities/16860926559",
  },

  {
    date: "2026-01",
    title: "Launched trace",
    link: "https://yourtrace.online",
    detail: "Product hunt #7 and $50 MRR in 1 week",
  },

  {
    date: "2026-02",
    title: "First Official Full Marathon",
    link: "https://www.strava.com/athletes/129371446",
    detail: "New PB: 4:23:00 hrs.",
  },

  {
    date: "2026-05",
    title: "Launched Stocksbrew (previously tikrr)",
    link: "https://stocksbrew.online",
    detail: "$18 MRR",
  },
  {
    date: "2026-05",
    title: "Youtube Channel Monetized",
  },
  {
    date: "2026-05",
    title: "Got engaged to Monisha",
    link: "https://www.instagram.com/reel/DYU2n42tgH-/",
  },
  {
    date: "2026-07",
    title: "Published my first research paper",
    link: "https://arxiv.org/pdf/2607.17052",
  },
  {
    date: "2026-07",
    title: "3rd place at Hermes hackathon",
    link: "https://www.linkedin.com/posts/taratt_last-sunday-was-one-of-the-craziest-weekends-ugcPost-7482291742487171072-egyk/",
  },
  { date: "2026-04", title: "First sponsored YouTube video" },
  { date: "2026-04", title: "Reached 3,000 YouTube subscribers" },
  {
    date: "2026-04",
    title: "Finalized uni for my masters",
    detail: "University of Edinburgh, Masters in AI",
  },
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
  const sorted = [...ITEMS].sort(
    (a, b) => parseYearMonth(b.date).date.getTime() - parseYearMonth(a.date).date.getTime()
  );

  const itemsByYear = sorted.reduce<Record<string, TimelineItem[]>>((acc, item) => {
    const { year } = parseYearMonth(item.date);
    const key = String(year);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  const years = Object.keys(itemsByYear).sort((a, b) => Number(b) - Number(a));
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header>
          <h1>Timeline</h1>
          <p className="note">A running log of moments, milestones, and little proofs of progress.</p>
        </header>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginBottom: "24px" }}>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                fontWeight: 700,
                cursor: "pointer",
                color: selectedYear === year ? "#222" : "#777",
                textDecoration: selectedYear === year ? "underline" : "none",
              }}
            >
              {year}
            </button>
          ))}
        </div>

        <ul className="list-plain timeline-list">
          {itemsByYear[selectedYear]?.map((item) => (
            <li key={`${item.date}-${item.title}`}>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
              ) : (
                <span>{item.title}</span>
              )}
              {" — "}
              <span className="desc">{formatYearMonth(item.date)}{item.detail ? ` · ${item.detail}` : ""}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
