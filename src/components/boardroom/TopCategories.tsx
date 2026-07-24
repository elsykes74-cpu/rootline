import Reveal from './Reveal'

const CATEGORIES = [
  { name: 'Hip Hop', views: 4.2 },
  { name: 'Documentary', views: 3.1 },
  { name: 'Food & Family', views: 2.6 },
  { name: 'Faith & Gospel', views: 1.9 },
  { name: 'Fashion & Craft', views: 1.4 },
]

const maxViews = Math.max(...CATEGORIES.map((c) => c.views))

/** Top categories ranked list with mini bars. */
export default function TopCategories() {
  return (
    <Reveal delay={160}>
      <section className="border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#D4A437]/30">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
          Top categories · 30 days
        </p>
        <h3 className="mt-2 font-display text-2xl text-[#F5EFE6]">
          What the Line is watching
        </h3>

        <ol className="mt-7 space-y-4">
          {CATEGORIES.map((c, i) => (
            <li key={c.name} className="group flex items-center gap-4">
              <span className="w-6 font-display text-lg italic text-stone-600 transition-colors group-hover:text-[#D4A437]">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-[#F5EFE6]">{c.name}</span>
                  <span className="text-xs text-stone-500">{c.views.toFixed(1)}M</span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-white/[0.06]">
                  <div
                    className="h-full bg-[#1E6B4F] transition-all duration-700 group-hover:bg-[#D4A437]"
                    style={{ width: `${(c.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  )
}
