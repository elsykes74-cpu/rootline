import { useState } from 'react'
import { Check, ShieldAlert } from 'lucide-react'
import Reveal from './Reveal'
import GriotReceipt from './GriotReceipt'

interface ReviewItem {
  id: string
  amount: number
  creator: string
  lane: string
  reason: string
}

const INITIAL_QUEUE: ReviewItem[] = [
  {
    id: 'rq_01',
    amount: 3420,
    creator: '@noirwave',
    lane: 'Premium Ads payout',
    reason: 'Brand-safety recheck on sponsored cut',
  },
  {
    id: 'rq_02',
    amount: 1875,
    creator: '@sable.kitchen',
    lane: 'Licensing Desk',
    reason: 'Sync placement awaiting counter-signature',
  },
  {
    id: 'rq_03',
    amount: 640,
    creator: '@choirloft',
    lane: 'Direct Support',
    reason: 'Unusual tipping velocity — routine hold',
  },
]

interface Receipt extends ReviewItem {
  releasedAt: string
  receiptId: string
}

const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`

/** Held-review payouts with Approve/Release → receipt state (local only). */
export default function ReviewQueue() {
  const [queue, setQueue] = useState<ReviewItem[]>(INITIAL_QUEUE)
  const [released, setReleased] = useState<Receipt[]>([])

  const release = (item: ReviewItem) => {
    setQueue((prev) => prev.filter((q) => q.id !== item.id))
    setReleased((prev) => [
      {
        ...item,
        releasedAt: new Date().toISOString(),
        receiptId: `RL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      },
      ...prev,
    ])
  }

  return (
    <Reveal delay={240}>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
              Review queue
            </p>
            <h3 className="mt-2 font-display text-2xl text-[#F5EFE6]">
              Held for the owner’s eye
            </h3>
          </div>
          <span className="border border-[#B5372A]/40 bg-[#B5372A]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#E8A79F]">
            {queue.length} held
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {queue.length === 0 && (
            <p className="border border-white/10 bg-white/[0.02] px-5 py-6 text-center text-sm text-stone-500">
              Queue clear. Nothing held back from creators.
            </p>
          )}
          {queue.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#0A0908] px-5 py-4 transition-colors hover:border-[#D4A437]/30"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert size={16} className="mt-1 shrink-0 text-[#B5372A]" />
                <div>
                  <p className="text-sm text-[#F5EFE6]">
                    <span className="font-display text-lg text-[#D4A437]">
                      {money(item.amount)}
                    </span>{' '}
                    · {item.creator}
                  </p>
                  <p className="text-xs text-stone-500">
                    {item.lane} — {item.reason}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <GriotReceipt
                  receipt={Number(item.id.slice(-2)) as 1 | 2 | 3}
                />
                <button
                  type="button"
                  onClick={() => release(item)}
                  className="bg-[#D4A437] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all hover:-translate-y-0.5 hover:bg-[#E5BB54]"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => release(item)}
                  className="border border-white/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300 transition-all hover:border-[#1E6B4F] hover:text-[#F5EFE6]"
                >
                  Release
                </button>
              </div>
            </div>
          ))}
        </div>

        {released.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#1E6B4F]">
              Released with receipt
            </p>
            <ul className="mt-3 space-y-2">
              {released.map((r) => (
                <li
                  key={r.receiptId}
                  className="flex flex-wrap items-center justify-between gap-2 border border-[#1E6B4F]/30 bg-[#1E6B4F]/[0.06] px-5 py-3"
                >
                  <span className="flex items-center gap-2 text-sm text-[#F5EFE6]">
                    <Check size={14} className="text-[#1E6B4F]" />
                    {money(r.amount)} · {r.creator}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    Receipt {r.receiptId} ·{' '}
                    {new Date(r.releasedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </Reveal>
  )
}
