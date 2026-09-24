"use client";

import { useState } from "react";
import {
  TIMELINE_ITEMS,
  formatYearMonth,
  getTimelineByYear,
} from "@/lib/timeline";

export default function TimeLinePage() {
  const itemsByYear = getTimelineByYear();
  const years = Object.keys(itemsByYear).sort((a, b) => Number(b) - Number(a));
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <h1>
            Timeline <span className="page-count">({TIMELINE_ITEMS.length})</span>
          </h1>
          <p className="note">
            When and what I did.
          </p>
        </header>

        <div className="pill-row" role="group" aria-label="Filter timeline by year">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`pill ${selectedYear === year ? "active" : ""}`}
            >
              {year} ({itemsByYear[year].length})
            </button>
          ))}
        </div>

        <ul className="timeline-list" key={selectedYear}>
          {itemsByYear[selectedYear]?.map((item) => (
            <li key={`${item.date}-${item.title}`}>
              <p className="timeline-title">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </p>
              <p className="timeline-meta">
                {formatYearMonth(item.date)}
                {item.detail ? ` · ${item.detail}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
