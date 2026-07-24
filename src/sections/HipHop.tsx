import { useEffect, useRef, useState } from "react";
import { Mic2, Disc3, Users, SprayCan, FileCheck2, HandCoins, Play, Pause } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  plays: string;
}

const GOLDEN_ERA: Track[] = [
  { title: "The Message", artist: "Grandmaster Flash & The Furious Five", plays: "14.2M" },
  { title: "Fight the Power", artist: "Public Enemy", plays: "11.8M" },
  { title: "93 Til Infinity", artist: "Souls of Mischief", plays: "9.4M" },
];

const NEW_WAVE: Track[] = [
  { title: "Cypher Sundays Vol. 12", artist: "Mic Lineage", plays: "2.6M" },
  { title: "ROOTS OF THE RHYTHM", artist: "Kojo Beats", plays: "1.9M" },
  { title: "Brooklyn Bounce (Lagos Remix)", artist: "Tempo Kitchen", plays: "1.3M" },
];

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Mic2,
    title: "The Four Elements",
    description:
      "MC, DJ, B-Boy, Graffiti — honored, not forgotten. Every archive set and every new drop keeps the foundation visible.",
  },
  {
    icon: FileCheck2,
    title: "Bars With Receipts",
    description:
      "Every sample cleared, every producer paid. Transparency isn't a press release here — it's policy, printed on the ledger.",
  },
  {
    icon: HandCoins,
    title: "Open Cypher",
    description:
      "Anyone can spit. The community votes, the best rise, and creators get the bag. No gatekeepers, just the crowd.",
  },
];

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function TrackRow({ track, index, visible }: { track: Track; index: number; visible: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="group flex items-center gap-3 rounded-md border border-white/5 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:border-[#D4A437]/30 hover:bg-white/[0.06]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-16px)",
        transition: `opacity 0.5s ease ${index * 90}ms, transform 0.5s ease ${index * 90}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4A437]/50 text-[#D4A437] transition-all duration-300 group-hover:bg-[#D4A437] group-hover:text-[#0A0908]"
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#F5EFE6]">{track.title}</p>
        <p className="truncate text-xs text-stone-400">{track.artist}</p>
      </div>
      <span className="shrink-0 text-xs font-medium tabular-nums text-[#D4A437]">
        {track.plays}
      </span>
    </div>
  );
}

function EraColumn({
  label,
  tagline,
  tracks,
  visible,
}: {
  label: string;
  tagline: string;
  tracks: Track[];
  visible: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4A437]">
        {label}
      </p>
      <p className="font-display mb-6 text-xl italic text-[#F5EFE6]">{tagline}</p>
      <div className="flex flex-col gap-3">
        {tracks.map((t, i) => (
          <TrackRow key={t.title} track={t} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}

export default function HipHop() {
  const banner = useInView<HTMLDivElement>();
  const split = useInView<HTMLDivElement>();
  const pillars = useInView<HTMLDivElement>();

  return (
    <section id="hiphop" className="bg-[#0A0908] py-32">
      {/* Kente stripe top */}
      <div
        className="mb-0 flex h-1.5 w-full"
        aria-hidden="true"
      >
        <span className="h-full flex-[2] bg-[#D4A437]" />
        <span className="h-full flex-[1] bg-[#B5372A]" />
        <span className="h-full flex-[2] bg-[#1E6B4F]" />
        <span className="h-full flex-[1] bg-[#D4A437]" />
        <span className="h-full flex-[2] bg-[#B5372A]" />
        <span className="h-full flex-[1] bg-[#1E6B4F]" />
      </div>

      {/* Full-bleed banner */}
      <div ref={banner.ref} className="relative overflow-hidden">
        <img
          src="/images/thumb-hiphop.png"
          alt="Hip hop cypher at night, MCs circled under street lights"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/85 via-[#0A0908]/70 to-[#0A0908]" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
          <div
            style={{
              opacity: banner.inView ? 1 : 0,
              transform: banner.inView ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#D4A437]">
              Est. 1973 — The Bronx
            </p>
            <h2 className="font-display max-w-4xl text-6xl leading-[0.95] tracking-tight text-[#F5EFE6] sm:text-7xl lg:text-8xl">
              Hip Hop Is{" "}
              <em className="italic text-[#D4A437]">Home.</em>
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
              Fifty years strong. From the Sedgwick Avenue block parties where two
              turntables rewired the world, to Lagos drill rattling car speakers
              continents away — this is the culture that taught the world to
              speak. We don't just stream it. We keep it.
            </p>
          </div>
        </div>
      </div>

      {/* Golden Era vs New Wave split */}
      <div
        ref={split.ref}
        className="mx-auto max-w-7xl px-6 pt-20"
        style={{
          opacity: split.inView ? 1 : 0,
          transform: split.inView ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <EraColumn
            label="Golden Era"
            tagline="The blueprint never fades."
            tracks={GOLDEN_ERA}
            visible={split.inView}
          />
          <EraColumn
            label="The New Wave"
            tagline="The lineage lives on ROOTLINE."
            tracks={NEW_WAVE}
            visible={split.inView}
          />
        </div>
      </div>

      {/* Pillars */}
      <div ref={pillars.ref} className="mx-auto max-w-7xl px-6 pt-20">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group rounded-lg border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4A437]/40"
                style={{
                  opacity: pillars.inView ? 1 : 0,
                  transform: pillars.inView ? "translateY(0)" : "translateY(32px)",
                  transition: `opacity 0.7s ease ${i * 140}ms, transform 0.7s ease ${i * 140}ms, border-color 0.3s ease`,
                }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-[#D4A437]/30 bg-[#D4A437]/10 text-[#D4A437] transition-colors duration-300 group-hover:bg-[#D4A437] group-hover:text-[#0A0908]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl text-[#F5EFE6]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Small icons strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-10 text-stone-500">
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <Mic2 className="h-4 w-4 text-[#D4A437]" /> MC
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D4A437]/50" />
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <Disc3 className="h-4 w-4 text-[#D4A437]" /> DJ
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D4A437]/50" />
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <Users className="h-4 w-4 text-[#D4A437]" /> B-Boy
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D4A437]/50" />
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <SprayCan className="h-4 w-4 text-[#D4A437]" /> Graffiti
          </span>
        </div>
      </div>
    </section>
  );
}
