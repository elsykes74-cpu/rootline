import { Radio, TrendingUp, Users, Wallet, Eye } from 'lucide-react'
import Reveal from './Reveal'

const STATS = [
  { icon: Eye, label: 'Total views', value: '18.4M', delta: '+12.6% vs last month' },
  { icon: TrendingUp, label: 'Watch hours', value: '612K', delta: '+9.1% vs last month' },
  { icon: Wallet, label: 'Revenue this month', value: '$84.2K', delta: '+18.3% vs last month' },
  { icon: Users, label: 'Active creators', value: '1,284', delta: '+41 this week' },
  { icon: Radio, label: 'Live now', value: '3 rooms', delta: 'Peak: 11 rooms', live: true },
]

/** Five headline stat tiles (sample data). */
export default function StatTiles() {
  return (
    <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-5">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 70} className="h-full">
          <div className="group flex h-full flex-col justify-between bg-[#0A0908] p-5 transition-colors duration-300 hover:bg-[#131110]">
            <div className="flex items-center justify-between">
              <s.icon
                size={16}
                className="text-stone-500 transition-colors group-hover:text-[#D4A437]"
              />
              {s.live && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B5372A] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B5372A]" />
                </span>
              )}
            </div>
            <p className="mt-5 font-display text-3xl text-[#F5EFE6]">{s.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-stone-500">
              {s.label}
            </p>
            <p className="mt-2 text-[11px] text-[#1E6B4F]">{s.delta}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
