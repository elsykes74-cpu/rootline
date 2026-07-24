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

export default function Hero() {
  const [introOpen, setIntroOpen] = useState(false);

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0908]">
      {/* Kente stripe along the very top */}
      <div className="kente-stripe absolute inset-x-0 top-0 z-30 h-1" aria-hidden="true" />

      {/* Background image + overlays */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/hero.png"
          alt="A Black filmmaker framing a shot on a city rooftop at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/70 via-[#0A0908]/30 to-[#0A0908]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/45 to-transparent" />
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
