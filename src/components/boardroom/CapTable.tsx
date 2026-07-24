import { useEffect, useMemo, useState } from 'react'
import {
  FOUNDER_EQUITY_EACH,
  FOUNDING_EQUITY_EACH,
  FOUNDING_SEATS_TOTAL,
  useAuth,
} from '@/context/AuthContext'
import Reveal from './Reveal'

const GOLD = '#D4A437'
const GREEN = '#1E6B4F'
const RED = '#B5372A'

const R = 84
const CIRC = 2 * Math.PI * R

interface Segment {
  label: string
  pct: number
  color: string
  note: string
}

/** Cap table card: animated SVG donut + founder slots + seat progress. */
export default function CapTable() {
  const { founders, renameFounder, seatsFilled } = useAuth()
  const [swept, setSwept] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setSwept(true), 150)
    return () => window.clearTimeout(t)
  }, [])

  const foundingPct = seatsFilled * FOUNDING_EQUITY_EACH
  const openPct = (FOUNDING_SEATS_TOTAL - seatsFilled) * FOUNDING_EQUITY_EACH

  const segments: Segment[] = useMemo(
    () => [
      { label: 'Founders', pct: 51, color: GOLD, note: `2 × ${FOUNDER_EQUITY_EACH}%` },
      { label: 'Founding 50 — seated', pct: foundingPct, color: GREEN, note: `${seatsFilled} creators` },
      { label: 'Founding 50 — open', pct: openPct, color: RED, note: `${FOUNDING_SEATS_TOTAL - seatsFilled} seats open` },
    ],
    [foundingPct, openPct, seatsFilled],
  )

  // Build stroke-dash offsets, sweeping from 0 to final pct on mount.
  let cursor = 0
  const arcs = segments.map((seg) => {
    const start = cursor
    cursor += seg.pct
    const shown = swept ? seg.pct : 0
    return {
      ...seg,
      dash: `${(shown / 100) * CIRC} ${CIRC}`,
      offset: -((start / 100) * CIRC),
    }
  })

  const seatProgress = (seatsFilled / FOUNDING_SEATS_TOTAL) * 100

  return (
    <Reveal>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
              Cap Table
            </p>
            <h2 className="mt-2 font-display text-3xl text-[#F5EFE6]">
              The Ownership Line
            </h2>
          </div>
          <p className="max-w-xs text-right text-xs leading-relaxed text-stone-500">
            Majority stays with the founders. The Founding 50 split 49% equally —
            and every one of them keeps their masters.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr]">
          {/* Donut */}
          <div className="relative mx-auto w-full max-w-72">
            <svg viewBox="0 0 200 200" className="w-full -rotate-90">
              <circle
                cx="100" cy="100" r={R} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="14"
              />
              {arcs.map((arc) => (
                <circle
                  key={arc.label}
                  cx="100" cy="100" r={R} fill="none"
                  stroke={arc.color}
                  strokeWidth="14"
                  strokeDasharray={arc.dash}
                  strokeDashoffset={arc.offset}
                  style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="font-display text-4xl text-[#F5EFE6]">
                {seatsFilled}<span className="text-xl text-stone-500">/{FOUNDING_SEATS_TOTAL}</span>
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-stone-500">
                Seats filled
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-6">
            {arcs.map((seg) => (
              <div key={seg.label} className="group flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: seg.color }}
                  />
                  <div>
                    <p className="text-sm text-[#F5EFE6]">{seg.label}</p>
                    <p className="text-xs text-stone-500">{seg.note}</p>
                  </div>
                </div>
                <p className="font-display text-xl text-[#D4A437]">
                  {seg.pct.toFixed(2)}%
                </p>
              </div>
            ))}

            {/* Founder slots — editable display names */}
            <div className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
              {founders.map((f) => (
                <label
                  key={f.key}
                  className="block border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors focus-within:border-[#D4A437]/50"
                >
                  <span className="flex items-baseline justify-between text-[9px] uppercase tracking-[0.3em] text-stone-500">
                    {f.title}
                    <span className="text-[#D4A437]">{FOUNDER_EQUITY_EACH}%</span>
                  </span>
                  <input
                    value={f.name}
                    onChange={(e) => renameFounder(f.key, e.target.value)}
                    className="mt-1.5 w-full bg-transparent font-display text-lg text-[#F5EFE6] outline-none placeholder:text-stone-600"
                    placeholder="Display name"
                  />
                </label>
              ))}
            </div>

            {/* Seats progress */}
            <div>
              <div className="flex items-baseline justify-between text-xs text-stone-500">
                <span className="uppercase tracking-[0.25em]">
                  Founding 50 seats · {FOUNDING_EQUITY_EACH}% each
                </span>
                <span>{FOUNDING_SEATS_TOTAL - seatsFilled} open</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden bg-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-[#1E6B4F] via-[#D4A437] to-[#D4A437] transition-all duration-1000 ease-out"
                  style={{ width: swept ? `${seatProgress}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
