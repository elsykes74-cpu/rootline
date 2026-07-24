import { useEffect, useRef, useState } from "react";
import { Radio, Users } from "lucide-react";

interface Room {
  id: number;
  title: string;
  host: string;
  image: string;
  alt: string;
  baseViewers: number;
}

const ROOMS: Room[] = [
  {
    id: 1,
    title: "Sunday Choir Rehearsal",
    host: "ROOTLINE Studio",
    image: "/images/thumb-gospel.png",
    alt: "Gospel choir rehearsing under warm stage light",
    baseViewers: 18600,
  },
  {
    id: 2,
    title: "HBCU Halftime Watch Party",
    host: "Yardline Sports",
    image: "/images/thumb-hbcu.png",
    alt: "HBCU marching band performing at halftime",
    baseViewers: 42100,
  },
  {
    id: 3,
    title: "The Cypher: Open Mic Friday",
    host: "Mic Lineage",
    image: "/images/thumb-hiphop.png",
    alt: "MCs gathered in a cypher circle under street lights",
    baseViewers: 27400,
  },
  {
    id: 4,
    title: "Sunday Debate: Culture Critics",
    host: "Film Room",
    image: "/images/thumb-culture.png",
    alt: "Two culture critics debating in a studio set",
    baseViewers: 9800,
  },
];

function formatViewers(n: number): string {
  return (n / 1000).toFixed(1) + "K";
}

function useInView<T extends HTMLElement>() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function LiveCard({ room, index, visible }: { room: Room; index: number; visible: boolean }) {
  const [viewers, setViewers] = useState(room.baseViewers);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = 2000 + Math.random() * 2000;
      timeout = setTimeout(() => {
        setViewers((v) => v + 1 + Math.floor(Math.random() * 9));
        tick();
      }, delay);
    };
    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <article
      className="group relative w-[300px] shrink-0 snap-start overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4A437]/40 sm:w-[340px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={room.image}
          alt={room.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/40 to-[#0A0908]/10" />

        {/* LIVE badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-[#B5372A] px-2 py-1">
          <span className="live-dot relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Live
          </span>
        </div>

        {/* Viewer count */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-sm bg-[#0A0908]/70 px-2 py-1 backdrop-blur-sm">
          <Users className="h-3 w-3 text-[#D4A437]" />
          <span className="text-[11px] font-semibold tabular-nums text-[#F5EFE6]">
            {formatViewers(viewers)}
          </span>
        </div>

        {/* Join button on hover */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setJoined((j) => !j)}
            aria-pressed={joined}
            className="gold-btn translate-y-2 rounded-sm px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group-hover:translate-y-0"
          >
            {joined ? "Joined" : "Join Room"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg leading-snug text-[#F5EFE6] transition-colors group-hover:text-[#D4A437]">
          {room.title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-stone-400">
          {room.host}
        </p>
      </div>
    </article>
  );
}

export default function LiveRooms() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="live" className="bg-[#0A0908] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={ref}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="gold-text mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                <Radio className="h-4 w-4 text-[#D4A437]" />
                Live on the Line
              </p>
              <h2 className="font-display text-4xl leading-tight tracking-tight text-[#F5EFE6] sm:text-5xl">
                Pull Up <em className="gold-text italic">Right Now.</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-stone-400">
              The block is always open. Tune in, talk back, and be part of the
              moment — not the replay.
            </p>
          </div>

          <div
            className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#D4A437_transparent]"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {ROOMS.map((room, i) => (
              <LiveCard key={room.id} room={room} index={i} visible={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
