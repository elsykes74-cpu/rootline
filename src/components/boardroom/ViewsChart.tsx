import { useMemo, useRef, useState } from 'react'
import Reveal from './Reveal'

const W = 800
const H = 260
const PAD_X = 8
const PAD_TOP = 20
const PAD_BOTTOM = 28

/** Deterministic pseudo-random series so the sample chart is stable. */
function seededSeries(days: number): number[] {
  let seed = 20260124
  const out: number[] = []
  for (let i = 0; i < days; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648
    const noise = (seed / 2147483648) * 220
    const base = 460 + i * 9 + Math.sin(i / 3.2) * 90
    out.push(Math.round(base + noise))
  }
  return out
}

function smoothPath(pts: Array<[number, number]>): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}

interface Hover {
  index: number
  x: number
  y: number
}

/** 30-day views area chart — hand-rolled SVG with gold gradient + hover tooltip. */
export default function ViewsChart() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)

  const days = useMemo(() => seededSeries(30), [])
  const max = Math.max(...days) * 1.08
  const min = Math.min(...days) * 0.85

  const pts = useMemo<Array<[number, number]>>(
    () =>
      days.map((v, i) => [
        PAD_X + (i / (days.length - 1)) * (W - PAD_X * 2),
        PAD_TOP + (1 - (v - min) / (max - min)) * (H - PAD_TOP - PAD_BOTTOM),
      ]),
    [days, max, min],
  )

  const line = useMemo(() => smoothPath(pts), [pts])
  const area = `${line} L ${pts[pts.length - 1][0]} ${H - PAD_BOTTOM} L ${pts[0][0]} ${H - PAD_BOTTOM} Z`

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const relX = ((e.clientX - rect.left) / rect.width) * W
    const ratio = (relX - PAD_X) / (W - PAD_X * 2)
    const index = Math.round(ratio * (days.length - 1))
    const clamped = Math.max(0, Math.min(days.length - 1, index))
    setHover({ index: clamped, x: pts[clamped][0], y: pts[clamped][1] })
  }

  const dayLabel = (i: number) => {
    const d = new Date()
    d.setDate(d.getDate() - (days.length - 1 - i))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Reveal delay={80}>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
              Views · last 30 days
            </p>
            <h3 className="mt-2 font-display text-2xl text-[#F5EFE6]">
              The audience is compounding
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Peak <span className="text-[#D4A437]">{Math.max(...days)}K</span> daily views
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative mt-6 cursor-crosshair"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="viewsGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4A437" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#D4A437" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={PAD_X}
                x2={W - PAD_X}
                y1={PAD_TOP + t * (H - PAD_TOP - PAD_BOTTOM)}
                y2={PAD_TOP + t * (H - PAD_TOP - PAD_BOTTOM)}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 6"
              />
            ))}
            <path d={area} fill="url(#viewsGold)" />
            <path d={line} fill="none" stroke="#D4A437" strokeWidth="2.5" />
            {hover && (
              <g>
                <line
                  x1={hover.x} x2={hover.x}
                  y1={PAD_TOP} y2={H - PAD_BOTTOM}
                  stroke="rgba(212,164,55,0.4)"
                />
                <circle cx={hover.x} cy={hover.y} r="5" fill="#0A0908" stroke="#D4A437" strokeWidth="2.5" />
              </g>
            )}
          </svg>

          {hover && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 border border-[#D4A437]/40 bg-[#131110] px-3 py-2 text-center shadow-xl"
              style={{
                left: `${(hover.x / W) * 100}%`,
                top: `${(hover.y / H) * 100}%`,
                transform: 'translate(-50%, -130%)',
              }}
            >
              <p className="font-display text-sm text-[#D4A437]">
                {days[hover.index]}K views
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                {dayLabel(hover.index)}
              </p>
            </div>
          )}

          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone-600">
            <span>{dayLabel(0)}</span>
            <span>{dayLabel(14)}</span>
            <span>{dayLabel(29)}</span>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
