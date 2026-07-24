import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import IntroVideoModal from "@/components/IntroVideoModal";

const STATS = [
  { value: "12", label: "Culture Channels" },
  { value: "100%", label: "Creator Receipts" },
  { value: "$3,420", label: "Held in Fair Review" },
  { value: "4.2M", label: "Strong and Rising" },
];

const MARQUEE_ITEMS = [
  "FILM ROOM",
  "AFROBEATS",
  "HIP HOP",
  "HBCU SPORTS",
  "BLACK TECH",
  "CULTURE",
  "SOUL FOOD",
  "GOSPEL",
  "STYLE",
  "ROOTS",
  "JAZZ",
];

/* Floating dust/bokeh particles — deterministic layout, staggered motion */
const HERO_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 83 + 7) % 96,
  size: 3 + (i % 4) * 2,
  delay: (i * 1.7) % 11,
  duration: 9 + (i % 5) * 2,
  gold: i % 3 !== 0,
}));

const HERO_ALIVE_CSS = `
.rl-hero-alive { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.rl-hero-fallback { display: none; }
.rl-hero-ray {
  position: absolute; top: -25%; height: 150%; width: 16%;
  background: linear-gradient(to bottom, rgba(212, 164, 55, 0.1), rgba(212, 164, 55, 0.02) 55%, transparent);
  mix-blend-mode: screen; filter: blur(14px); transform: skewX(-16deg);
  opacity: 0.8;
}
.rl-hero-ray-1 { left: 10%; animation: rl-hero-drift-a 9s ease-in-out infinite alternate; }
.rl-hero-ray-2 { left: 44%; width: 22%; opacity: 0.6; animation: rl-hero-drift-b 12s ease-in-out infinite alternate; animation-delay: -4s; }
.rl-hero-ray-3 { left: 72%; width: 13%; opacity: 0.7; animation: rl-hero-drift-a 14s ease-in-out infinite alternate; animation-delay: -8s; }
@keyframes rl-hero-drift-a {
  from { transform: skewX(-16deg) translateX(-3vw); opacity: 0.5; }
  to { transform: skewX(-16deg) translateX(3vw); opacity: 1; }
}
@keyframes rl-hero-drift-b {
  from { transform: skewX(-16deg) translateX(4vw); opacity: 0.4; }
  to { transform: skewX(-16deg) translateX(-4vw); opacity: 0.9; }
}
.rl-hero-particle {
  position: absolute; bottom: -4vh; border-radius: 9999px;
  animation: rl-hero-rise linear infinite;
  will-change: transform, opacity;
}
@keyframes rl-hero-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  12% { opacity: 0.75; }
  55% { transform: translateY(-38vh) translateX(1.5vw); opacity: 0.55; }
  100% { transform: translateY(-72vh) translateX(-1.5vw); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .rl-hero-video { display: none; }
  .rl-hero-fallback { display: block; }
  .rl-hero-ray, .rl-hero-particle { animation: none !important; opacity: 0.25; }
  .rl-hero-particle { display: none; }
}
`;

export default function Hero() {
  const [introOpen, setIntroOpen] = useState(false);

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0908]">
      <style>{HERO_ALIVE_CSS}</style>

      {/* Kente stripe along the very top */}
      <div className="kente-stripe absolute inset-x-0 top-0 z-30 h-1" aria-hidden="true" />

      {/* Background video + overlays */}
      <div className="absolute inset-0" aria-hidden="true">
        <video
          className="rl-hero-video h-full w-full object-cover"
          src="/videos/hero-loop.mp4"
          poster="/images/hero.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          title="A Black filmmaker framing a shot on a city rooftop at golden hour"
        />
        <img
          src="/images/hero.png"
          alt=""
          className="rl-hero-fallback h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/70 via-[#0A0908]/30 to-[#0A0908]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/45 to-transparent" />

        {/* Living-hero overlay: sun rays + dust, above video, below text */}
        <div className="rl-hero-alive">
          <div className="rl-hero-ray rl-hero-ray-1" />
          <div className="rl-hero-ray rl-hero-ray-2" />
          <div className="rl-hero-ray rl-hero-ray-3" />
          {HERO_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="rl-hero-particle"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.gold ? "#D4A437" : "#F5EFE6",
                boxShadow: p.gold
                  ? "0 0 8px 2px rgba(212, 164, 55, 0.45)"
                  : "0 0 6px 2px rgba(245, 239, 230, 0.3)",
                filter: "blur(1px)",
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="grain-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-16 pt-36">
        <p
          className="animate-fade-up text-[11px] uppercase tracking-[0.3em] text-[#D4A437]"
          style={{ animationDelay: "0.1s" }}
        >
          A Black-Owned Creator Network
        </p>

        <h1
          className="animate-fade-up mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-[#F5EFE6] sm:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.25s" }}
        >
          The Culture.
          <br />
          Owned by the
          <br />
          <em className="italic text-[#D4A437]">Culture.</em>
        </h1>

        <p
          className="animate-fade-up mt-8 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg"
          style={{ animationDelay: "0.4s" }}
        >
          From the juke joint to the group chat — one stage, our stage. Watch,
          create, and get paid with receipts.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.55s" }}
        >
          <button
            type="button"
            onClick={() => setIntroOpen(true)}
            className="inline-flex items-center gap-3 bg-[#D4A437] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
          >
            <Play size={14} fill="currentColor" aria-hidden="true" />
            Start Watching
          </button>
          <a
            href="#studio"
            className="inline-flex items-center gap-3 border border-white/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5EFE6] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A437] hover:text-[#D4A437]"
          >
            Open the Studio
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="animate-fade-up mt-16 grid grid-cols-2 gap-8 border-t border-white/15 pt-8 md:grid-cols-4"
          style={{ animationDelay: "0.7s" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-bold text-[#F5EFE6] sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-stone-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel marquee */}
      <div className="relative z-10 border-y border-white/15 bg-[#0A0908]/80 py-4 backdrop-blur-sm">
        <div className="flex w-max animate-marquee items-center whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center">
              <span className="px-6 text-xs uppercase tracking-[0.3em] text-stone-300">
                {item}
              </span>
              <span className="text-[#D4A437]" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      <IntroVideoModal open={introOpen} onOpenChange={setIntroOpen} />
    </section>
  );
}
