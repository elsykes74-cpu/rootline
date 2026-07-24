import { useState } from 'react'
import { Link } from 'react-router'
import { Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import Reveal from '@/components/boardroom/Reveal'
import MyLine from '@/components/boardroom/MyLine'
import CapTable from '@/components/boardroom/CapTable'
import StatTiles from '@/components/boardroom/StatTiles'
import ViewsChart from '@/components/boardroom/ViewsChart'
import RevenueLanes from '@/components/boardroom/RevenueLanes'
import TopCategories from '@/components/boardroom/TopCategories'
import SignupsFeed from '@/components/boardroom/SignupsFeed'
import ReviewQueue from '@/components/boardroom/ReviewQueue'

/** Elegant gate for signed-out visitors. */
function OwnersOnly() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0908] px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B5372A] via-[#D4A437] to-[#1E6B4F]"
      />
      <span className="flex h-16 w-16 items-center justify-center border border-[#D4A437]/50 bg-[#D4A437]/10">
        <Lock size={22} className="text-[#D4A437]" />
      </span>
      <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#D4A437]">
        Members only
      </p>
      <h1 className="mt-4 font-display text-4xl text-[#F5EFE6] sm:text-5xl">
        Your line starts inside.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
        Sign in to step into your backend — The Boardroom for owners, MY LINE
        for creators.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="bg-[#D4A437] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
        >
          Sign in
        </button>
        <Link
          to="/"
          className="border border-white/20 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-300 transition-colors hover:border-[#D4A437] hover:text-[#F5EFE6]"
        >
          Back to the Line
        </Link>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode="signin" />
    </div>
  )
}

export default function Owner() {
  const { user, isOwner, logout } = useAuth()

  // Three states: signed out → sign-in prompt; owner → The Boardroom;
  // signed-in creator/member → MY LINE backend.
  if (!user) return <OwnersOnly />
  if (!isOwner) return <MyLine user={user} />

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
              {user?.name} · Owner
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
              Owners only · 51% always home
            </p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-none text-[#F5EFE6] sm:text-7xl">
              The Boardroom
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-400">
              Ownership, audience, and money — one table. The founders hold 51%.
              The Founding 50 share 49% equally at 0.98% a seat and keep 100% of
              their masters.
            </p>
          </div>
        </Reveal>

        {/* Cap table */}
        <CapTable />

        {/* Analytics */}
        <div className="mt-14">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl text-[#F5EFE6]">Analytics</h2>
              <span className="border border-[#D4A437]/40 bg-[#D4A437]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#D4A437]">
                Sample data — demo backend
              </span>
            </div>
          </Reveal>

          <StatTiles />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ViewsChart />
            <RevenueLanes />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <TopCategories />
            <SignupsFeed />
          </div>

          <div className="mt-6">
            <ReviewQueue />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-[10px] uppercase tracking-[0.3em] text-stone-600">
        ROOTLINE · The Boardroom · Masters stay with their makers
      </footer>
    </div>
  )
}
