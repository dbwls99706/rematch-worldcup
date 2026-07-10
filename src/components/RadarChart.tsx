import type { Stats } from '../engine/types'

const AXES: { key: keyof Stats; label: string }[] = [
  { key: 'pace', label: '스피드' },
  { key: 'shot', label: '슛' },
  { key: 'dribble', label: '드리블' },
  { key: 'pass', label: '패스' },
  { key: 'defense', label: '수비' },
  { key: 'physical', label: '피지컬' },
]

interface Props {
  stats: Stats
  compare?: Stats
  size?: number
  color?: string
  compareColor?: string
  showLabels?: boolean
}

export default function RadarChart({
  stats,
  compare,
  size = 200,
  color = '#22c55e',
  compareColor = '#f59e0b',
  showLabels = true,
}: Props) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - (showLabels ? 34 : 8)
  const n = AXES.length

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const rad = (value / 99) * r
    return [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)]
  }
  const axisPoint = (i: number, mult = 1) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + r * mult * Math.cos(angle), cy + r * mult * Math.sin(angle)]
  }

  const poly = (s: Stats) => AXES.map((a, i) => point(i, s[a.key]).join(',')).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radar">
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <polygon
          key={g}
          points={AXES.map((_, i) => axisPoint(i, g).join(',')).join(' ')}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
        />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = axisPoint(i)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />
      })}
      {compare && (
        <polygon points={poly(compare)} fill={compareColor} fillOpacity="0.18" stroke={compareColor} strokeWidth="2" />
      )}
      <polygon points={poly(stats)} fill={color} fillOpacity="0.28" stroke={color} strokeWidth="2" />
      {AXES.map((a, i) => {
        const [x, y] = point(i, stats[a.key])
        return <circle key={a.key} cx={x} cy={y} r="2.6" fill={color} />
      })}
      {showLabels &&
        AXES.map((a, i) => {
          const [x, y] = axisPoint(i, 1.2)
          return (
            <text
              key={a.key}
              x={x}
              y={y}
              fontSize="10.5"
              fontWeight="700"
              fill="var(--sub)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {a.label}
              <tspan x={x} dy="12" fontSize="11" fontWeight="800" fill="var(--ink)">
                {stats[a.key]}
              </tspan>
            </text>
          )
        })}
    </svg>
  )
}
