import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Play, X } from "lucide-react";

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

/* Living-hero overlay: 3 subtle gold sun rays drifting above the video */
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
@media (prefers-reduced-motion: reduce) {
  .rl-hero-video { display: none; }
  .rl-hero-fallback { display: block; }
  .rl-hero-ray { animation: none !important; opacity: 0.25; }
}
`;

interface CinemaOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Pop-out media player for the intro film. Portaled to document.body so it
 * sits above ALL page chrome (nav included). Closes on ✕, ESC, or backdrop
 * click; pauses + resets the film on close; locks body scroll while open.
 */
function CinemaOverlay({ open, onClose }: CinemaOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ended, setEnded] = useState(false);

  const handleClose = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setEnded(false);
    onClose();
  }, [onClose]);

  // ESC to close + body scroll lock — both cleaned up on close/unmount.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, handleClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#0A0908]/97 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="ROOTLINE intro film"
      onClick={handleClose}
    >
      {/* Slim chrome */}
      <div className="flex items-center justify-between px-6 py-5">
        <span className="font-display text-lg font-bold tracking-[0.25em] text-[#F5EFE6]">
          Rootline<span className="text-[#D4A437]">.</span>
        </span>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close player"
          className="inline-flex items-center gap-2 border border-[#D4A437]/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4A437] transition-colors duration-300 hover:bg-[#D4A437] hover:text-[#0A0908]"
        >
          <X size={14} aria-hidden="true" />
          Close
        </button>
      </div>

      {/* Centered gold-framed 16:9 player — clicks here must not close */}
      <div className="flex flex-1 items-center justify-center px-6 pb-10">
        <div
          className="w-full max-w-5xl border border-[#D4A437]/40 bg-black shadow-[0_0_80px_rgba(212,164,55,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          {ended ? (
            <div className="flex aspect-video flex-col items-center justify-center px-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4A437]">
                Rootline
              </p>
              <p className="mt-4 font-display text-3xl italic text-[#F5EFE6] sm:text-5xl">
                The line starts here.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 inline-block bg-[#D4A437] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
              >
                Enter ROOTLINE
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              className="aspect-video h-auto w-full"
              autoPlay
              controls
              playsInline
              preload="auto"
              onEnded={() => setEnded(true)}
              onError={handleClose}
              title="ROOTLINE intro film"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Hero() {
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0908]">
      <style>{HERO_ALIVE_CSS}</style>

      {/* Kente stripe along the very top */}
      <div
        className="kente-stripe absolute inset-x-0 top-0 z-30 h-1"
        aria-hidden="true"
      />

      {/* Background video + overlays — the hero always stays in this ambient state */}
      <div className="absolute inset-0" aria-hidden="true">
        {/*
          Framing: her face sits at ~43% x / ~30% y of the source frame.
          Zoom + anchor re-composes so she lands on the RIGHT third of the
          screen (under the login button) while the crew on the left stays
          behind the text column. Mobile anchors to the right edge instead.
        */}
        <video
          className="rl-hero-video h-full w-full object-cover object-[35%_center] scale-[1.4] origin-[100%_20%] md:object-center md:scale-[1.6] md:origin-[0%_18%] lg:scale-[1.8] lg:origin-[0%_15%]"
          src="/videos/hero-alive.mp4"
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
          className="rl-hero-fallback h-full w-full object-cover object-[35%_center] scale-[1.4] origin-[100%_20%] md:object-center md:scale-[1.6] md:origin-[0%_18%] lg:scale-[1.8] lg:origin-[0%_15%]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,9,8,0.92),rgba(10,9,8,0.55)_45%,rgba(10,9,8,0.15)_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/45 to-transparent" />

        {/* Living-hero overlay: sun rays, above video, below text */}
        <div className="rl-hero-alive">
          <div className="rl-hero-ray rl-hero-ray-1" />
          <div className="rl-hero-ray rl-hero-ray-2" />
          <div className="rl-hero-ray rl-hero-ray-3" />
        </div>

        <div className="grain-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-16 pt-36">
        {/* Left-aligned text column — never wide enough to cover her face */}
        <div className="max-w-xl lg:max-w-2xl">
          <p
            className="gold-text animate-fade-up text-[11px] uppercase tracking-[0.3em]"
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
            <em className="gold-text italic">Culture.</em>
          </h1>

          <p
            className="animate-fade-up mt-8 text-base leading-relaxed text-stone-300 sm:text-lg"
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
              onClick={() => setPlayerOpen(true)}
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

      {/* Pop-out cinema player for the intro film */}
      <CinemaOverlay open={playerOpen} onClose={() => setPlayerOpen(false)} />
    </section>
  );
}
