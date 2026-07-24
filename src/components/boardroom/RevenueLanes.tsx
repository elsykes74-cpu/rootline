import { useEffect, useState } from 'react'
import Reveal from './Reveal'

const LANES = [
  { lane: 'Premium Ads', revenue: 34.1, split: 70 },
  { lane: 'Members', revenue: 27.6, split: 90 },
  { lane: 'Licensing Desk', revenue: 14.8, split: 85 },
  { lane: 'Direct Support', revenue: 7.7, split: 90 },
]

const maxRevenue = Math.max(...LANES.map((l) => l.revenue))

/** Revenue by monetization lane — horizontal bars annotated with creator splits. */
export default function RevenueLanes() {
  const [swept, setSwept] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setSwept(true), 200)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <Reveal delay={120}>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
          Revenue by lane · this month
        </p>
        <h3 className="mt-2 font-display text-2xl text-[#F5EFE6]">
          Built so creators keep the majority
        </h3>

        <div className="mt-7 space-y-5">
          {LANES.map((l, i) => (
            <div key={l.lane} className="group">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-[#F5EFE6]">{l.lane}</span>
                <span className="flex items-baseline gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#1E6B4F]">
                    {l.split}% to creator
                  </span>
                  <span className="font-display text-lg text-[#D4A437]">
                    ${l.revenue.toFixed(1)}K
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden bg-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-[#8f6b1e] to-[#D4A437] transition-all duration-1000 ease-out group-hover:brightness-125"
                  style={{
                    width: swept ? `${(l.revenue / maxRevenue) * 100}%` : '0%',
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-stone-500">
          Splits shown are the creator’s share of net lane revenue. Founding 50
          creators earn on every lane — on top of their 0.98% equity.
        </p>
      </section>
    </Reveal>
  )
}
