import type { ComponentType } from 'react'
import { House, Play, Upload, Users, HandCoins } from 'lucide-react'

/**
 * ROOTLINE BottomBar — an app-style floating dock pinned to the bottom of
 * the viewport. It is a design statement, not just navigation: dark glass,
 * a hairline of gold, and a raised metallic upload button at the center.
 *
 * z-40 keeps it comfortably below the cinema overlay (z-[100]) and the
 * Griot theater (z-[90]).
 */

interface DockItem {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const ITEMS: DockItem[] = [
  { label: 'Home', href: '#top', icon: House },
  { label: 'Watch', href: '#watch', icon: Play },
  { label: 'Creators', href: '#creators', icon: Users },
  { label: 'Fund', href: '#fund', icon: HandCoins },
]

function DockLink({ label, href, icon: Icon }: DockItem) {
  return (
    <a
      href={href}
      aria-label={label}
      className="group flex min-w-14 flex-col items-center justify-center gap-1 rounded-full px-3 py-2 text-stone-400 transition-colors duration-300 hover:text-[#D4A437] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A437]/60"
    >
      <Icon className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
        {label}
      </span>
    </a>
  )
}

export default function BottomBar() {
  return (
    <nav
      aria-label="ROOTLINE quick dock"
      className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
    >
      <div className="mx-auto mb-4 flex max-w-md items-center justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#D4A437]/25 bg-[#0A0908]/85 px-3 py-2 shadow-[0_10px_40px_-8px_rgba(212,164,55,0.35),0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <DockLink {...ITEMS[0]} />
          <DockLink {...ITEMS[1]} />

          {/* Center: raised metallic gold upload button → Creator Studio */}
          <a
            href="#studio"
            aria-label="Upload — Creator Studio"
            className="gold-btn relative -mt-4 mx-1 flex size-14 shrink-0 items-center justify-center rounded-full text-[#0A0908] shadow-[0_8px_28px_-4px_rgba(212,164,55,0.6),0_4px_12px_rgba(0,0,0,0.5)] ring-4 ring-[#0A0908] transition-transform duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-[#D4A437]/70"
          >
            <Upload className="size-6" strokeWidth={2.25} />
          </a>

          <DockLink {...ITEMS[2]} />
          <DockLink {...ITEMS[3]} />
        </div>
      </div>
    </nav>
  )
}
