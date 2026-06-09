'use client'

import SimpleBarChart from '@/components/SimpleBarChart'
import type { PostHogTrend } from '@/utils/posthogAPI'

interface StartupCardProps {
  name: string
  tagline: string
  link: string
  color: string
  data: PostHogTrend | null
}

export default function StartupCard({
  name,
  tagline,
  link,
  color,
  data,
}: StartupCardProps) {
  const total = data?.total ?? 0
  const avg = data ? Math.round(data.total / data.data.length) : 0
  const latest = data?.data?.[data.data.length - 1] ?? 0

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="card bg-neutral-50 border rounded shadow p-6 h-full flex flex-col cursor-alias"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-lg lg:text-xl font-medium">{name}</p>
          <p className="text-sm text-gray-500">{tagline}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-gray-400"
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
          <div className="mb-3">
            <SimpleBarChart data={data.data} color={color} height={64} />
          </div>
          <div className="flex gap-4 text-sm mt-auto">
            <div>
              <p className="text-xs text-gray-400">Visits (30d)</p>
              <p className="font-semibold" style={{ color }}>
                {total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Daily avg</p>
              <p className="font-semibold" style={{ color }}>
                {avg}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Today</p>
              <p className="font-semibold" style={{ color }}>
                {latest}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Add POSTHOG_PERSONAL_API_KEY to .env.local
        </div>
      )}
    </a>
  )
}
