'use client'

import SimpleBarChart from '@/components/SimpleBarChart'
import type { PostHogTrend } from '@/lib/posthogAPI'

interface StartupCardProps {
  name: string
  tagline: string
  link: string
  color: string
  data: PostHogTrend | null
  metricLabel?: string
  metricLabelShort?: string
}

export default function StartupCard({
  name,
  tagline,
  link,
  color,
  data,
  metricLabel = 'Visits (30d)',
  metricLabelShort = 'Daily avg',
}: StartupCardProps) {
  const total = data?.total ?? 0
  const avg = data ? Math.round(data.total / data.data.length) : 0
  const latest = data?.data?.[data.data.length - 1] ?? 0

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-foreground/10 rounded-lg p-5 space-y-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-foreground/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted">{tagline}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-muted/50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>

      {data ? (
        <>
          <SimpleBarChart data={data.data} color={color} height={110} />

          <div className="flex gap-4 text-sm pt-1">
            <div>
              <p className="text-xs text-muted">{metricLabel}</p>
              <p className="font-semibold" style={{ color }}>
                {total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">{metricLabelShort}</p>
              <p className="font-semibold" style={{ color }}>
                {avg}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Today</p>
              <p className="font-semibold" style={{ color }}>
                {latest}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-muted">No data found</p>
            <p className="text-xs text-muted/60 mt-1">Waiting for first event</p>
          </div>
        </div>
      )}
    </a>
  )
}
