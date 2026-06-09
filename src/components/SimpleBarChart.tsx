'use client'

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

  return (
    <div
      className="flex items-end gap-[2px] w-full"
      style={{ height: `${height}px` }}
    >
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all duration-200 hover:opacity-80 min-w-[2px]"
          style={{
            height: `${(value / max) * 100}%`,
            backgroundColor: color,
            opacity: value > 0 ? 0.7 + (value / max) * 0.3 : 0,
          }}
        />
      ))}
    </div>
  )
}
