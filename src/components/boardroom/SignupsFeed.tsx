import { useAuth } from '@/context/AuthContext'
import Reveal from './Reveal'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

/** Live signups feed — most recent Founding 50 seats claimed. */
export default function SignupsFeed() {
  const { foundingCreators, seatsRemaining } = useAuth()
  const recent = [...foundingCreators].slice(-8).reverse()

  return (
    <Reveal delay={200}>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
              Live signups
            </p>
            <h3 className="mt-2 font-display text-2xl text-[#F5EFE6]">
              The Founding 50, filling
            </h3>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E6B4F] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1E6B4F]" />
          </span>
        </div>

        <ul className="mt-6 divide-y divide-white/[0.06]">
          {recent.map((c) => (
            <li
              key={c.seat}
              className="group flex items-center justify-between gap-4 py-3 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#D4A437]/40 bg-[#D4A437]/10 font-display text-sm text-[#D4A437] transition-colors group-hover:bg-[#D4A437] group-hover:text-[#0A0908]">
                  {c.seat}
                </span>
                <div>
                  <p className="text-sm text-[#F5EFE6]">
                    {c.name}
                    {c.sampleData && (
                      <span className="ml-2 text-[9px] uppercase tracking-[0.2em] text-stone-600">
                        sample
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-stone-500">
                    Founding Creator #{c.seat} of 50 · {relativeTime(c.joinedAt)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1E6B4F]">
                0.98% equity
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-stone-500">
          {seatsRemaining} seats remain. After seat 50, creators join standard —
          monetization lanes, no equity.
        </p>
      </section>
    </Reveal>
  )
}
