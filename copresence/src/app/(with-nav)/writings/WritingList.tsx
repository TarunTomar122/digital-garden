"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface WritingListItem {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  dateLabel: string;
}

export interface WritingYear {
  year: string;
  writings: WritingListItem[];
}

interface WritingListProps {
  years: WritingYear[];
}

export default function WritingList({ years }: WritingListProps) {
  const [selectedYear, setSelectedYear] = useState(years[0]?.year);

  // Restore a shared ?year= link after hydration so the page stays static.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("year");
    if (fromUrl && years.some((y) => y.year === fromUrl)) {
      setSelectedYear(fromUrl);
    }
  }, [years]);

  function selectYear(year: string) {
    setSelectedYear(year);
    const url = new URL(window.location.href);
    if (year === years[0]?.year) url.searchParams.delete("year");
    else url.searchParams.set("year", year);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div className="pill-row" role="tablist" aria-label="Writings by year">
        {years.map(({ year, writings }) => (
          <button
            key={year}
            type="button"
            role="tab"
            id={`writings-tab-${year}`}
            aria-selected={selectedYear === year}
            aria-controls={`writings-panel-${year}`}
            onClick={() => selectYear(year)}
            className={`pill ${selectedYear === year ? "active" : ""}`}
          >
            {year} ({writings.length})
          </button>
        ))}
      </div>

      {/* Every year stays in the HTML (just hidden) so all links remain crawlable. */}
      {years.map(({ year, writings }) => (
        <div
          key={year}
          role="tabpanel"
          id={`writings-panel-${year}`}
          aria-labelledby={`writings-tab-${year}`}
          hidden={selectedYear !== year}
        >
          <ul className="cards">
            {writings.map((w) => (
              <li key={w.slug}>
                <Link href={`/writings/${w.slug}`} className="card">
                  <div className="card-body">
                    <h3 className="card-title card-title-sm">{w.title}</h3>
                    {w.description ? (
                      <p className="card-desc">{w.description}</p>
                    ) : null}
                    <p className="writing-card-date">
                      {w.dateLabel}
                      {w.category ? (
                        <>
                          <span className="sep" aria-hidden="true">·</span>
                          <span className="writing-card-tag">{w.category}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
