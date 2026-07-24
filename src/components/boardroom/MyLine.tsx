import { Link } from 'react-router'
import { ArrowUpRight, Eye, Upload, Wallet } from 'lucide-react'
import {
  FOUNDING_EQUITY_EACH,
  FOUNDING_SEATS_TOTAL,
  useAuth,
  type RootlineUser,
} from '@/context/AuthContext'
import Reveal from './Reveal'

const LANES = [
  { lane: 'Premium Ads', split: 70 },
  { lane: 'Members', split: 90 },
  { lane: 'Licensing Desk', split: 85 },
  { lane: 'Direct Support', split: 90 },
]

const STATS = [
  { icon: Eye, label: 'Views', value: '0' },
  { icon: Wallet, label: 'Earnings', value: '$0.00' },
  { icon: Upload, label: 'Uploads', value: '0' },
]

/** Founding 50 seat card — equity + masters. */
function FoundingSeatCard({ user }: { user: RootlineUser }) {
  return (
    <Reveal delay={120}>
      <section className="border border-[#D4A437]/40 bg-[#D4A437]/[0.06] p-8">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
          Your seat at the table
        </p>
        <h2 className="mt-3 font-display text-3xl text-[#F5EFE6] sm:text-4xl">
          Founding Creator #{user.seat} of {FOUNDING_SEATS_TOTAL}
        </h2>
        <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-6">
          <div>
            <p className="font-display text-5xl text-[#D4A437]">
              {FOUNDING_EQUITY_EACH}%
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-stone-400">
              Equity stake in ROOTLINE
            </p>
          </div>
          <div className="border-l border-[#D4A437]/30 pl-10">
            <p className="font-display text-xl italic text-[#F5EFE6]">
              Your masters stay yours.
            </p>
            <p className="mt-1 text-xs text-stone-500">
              100% ownership of your work. Always.
            </p>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

/** Standard creator card — monetization lanes, no equity. */
function StandardCreatorCard() {
  return (
    <Reveal delay={120}>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
          Creator account
        </p>
        <h2 className="mt-3 font-display text-3xl text-[#F5EFE6] sm:text-4xl">
          Monetization lanes, from day one
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-400">
          No equity stake — the Founding 50 seats are spoken for — but every lane
          below pays you the creator’s share of net revenue, with receipts.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {LANES.map((l) => (
            <div
              key={l.lane}
              className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <span className="text-sm text-[#F5EFE6]">{l.lane}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1E6B4F]">
                {l.split}% to you
              </span>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

/**
 * MY LINE — the creator backend shown at /owner for signed-in non-owners.
 * Matches the Boardroom's visual language: dark cards, gold accents, Reveal entrances.
 */
export default function MyLine({ user }: { user: RootlineUser }) {
  const { logout } = useAuth()
  const firstName = user.name.split(/\s+/)[0]

  return (
    <div className="min-h-screen bg-[#0A0908] font-body text-[#F5EFE6] antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0908]/90 backdrop-blur-md">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#B5372A] via-[#D4A437] to-[#1E6B4F]"
        />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-3" aria-label="Back to ROOTLINE home">
            <span className="flex h-8 w-8 items-center justify-center border border-[#D4A437] bg-[#0A0908]/40 transition-colors group-hover:bg-[#D4A437]/10">
              <span className="font-display text-base italic text-[#D4A437]">R</span>
            </span>
            <span className="font-display text-sm font-bold tracking-[0.25em] text-[#F5EFE6]">
              ROOTLINE
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-stone-500 sm:block">
              {user.name} · {user.seat !== null ? `Founding Creator #${user.seat}` : 'Creator'}
            </span>
            <button
              type="button"
              onClick={logout}
              className="text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors hover:text-[#D4A437]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        {/* Header */}
        <Reveal>
          <div className="pb-10 pt-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#D4A437]">
              My Line
            </p>
            <h1 className="mt-4 font-display text-5xl leading-none text-[#F5EFE6] sm:text-7xl">
              Welcome home, <em className="italic text-[#D4A437]">{firstName}.</em>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-400">
              This is your backend — your seat, your numbers, your lane. Upload
              from the Studio and everything shows up here.
            </p>
          </div>
        </Reveal>

        {/* Seat / creator card */}
        {user.seat !== null ? <FoundingSeatCard user={user} /> : <StandardCreatorCard />}

        {/* Mini stats — fresh account, real zeros */}
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={200 + i * 100}>
              <div className="border border-white/10 bg-white/[0.02] p-6 transition-colors duration-500 hover:border-[#D4A437]/30">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                    {s.label}
                  </p>
                  <s.icon size={16} className="text-[#D4A437]" aria-hidden />
                </div>
                <p className="mt-3 font-display text-4xl text-[#F5EFE6]">{s.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={520}>
          <p className="mt-4 text-xs text-stone-500">
            A fresh line — every number here is real, and it starts at zero.
          </p>
        </Reveal>

        {/* Actions */}
        <Reveal delay={600}>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
            <a
              href="/#studio"
              className="inline-flex items-center gap-3 bg-[#D4A437] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
            >
              Go to the Studio
              <ArrowUpRight size={14} aria-hidden />
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-300 transition-colors hover:border-[#D4A437] hover:text-[#F5EFE6]"
            >
              Log out
            </button>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-[10px] uppercase tracking-[0.3em] text-stone-600">
        ROOTLINE · My Line · Masters stay with their makers
      </footer>
    </div>
  )
}
