'use client'

import { useState } from 'react'

interface SimpleBarChartProps {
  data: number[]
  color?: string
  height?: number
}

export default function SimpleBarChart({
  data,
  color = '#f87171',
  height = 80,
}: SimpleBarChartProps) {
  const max = Math.max(...data, 1)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-end gap-px w-full" style={{ height: `${height}px` }}>
      {data.map((value, i) => {
        const barHeight = max > 0 ? (value / max) * height : 0
        return (
          <div key={i} className="flex-1 relative min-w-[2px]">
            {hovered === i && value > 0 && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap pointer-events-none"
                style={{ backgroundColor: color, color: '#fff' }}
              >
                {value}
              </div>
            )}
            <div
              className="w-full rounded-t transition-all duration-200 hover:opacity-80 cursor-pointer"
              style={{
                height: `${barHeight}px`,
                backgroundColor: color,
                opacity: value > 0 ? 0.7 + (value / max) * 0.3 : 0,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          </div>
        )
      })}
    </div>
  )
}
