import { useEffect, useRef, useState } from "react";
import VideoCard, { type Video } from "@/components/VideoCard";
import PlayerModal from "@/components/PlayerModal";
import { supabase, type VideoRow } from "@/lib/supabase";

const FILTERS = [
  "All",
  "Film Room",
  "Afrobeats",
  "Hip Hop",
  "HBCU Sports",
  "Black Tech",
  "Culture",
  "Soul Food",
  "Gospel",
  "Style",
  "Roots",
  "Jazz",
] as const;

export const VIDEOS: Video[] = [
  {
    id: 1,
    title: "The New Black Indie Film Circuit",
    creator: "Amina Cole",
    views: "1.8M",
    duration: "02:11",
    category: "Film Room",
    thumb: "/images/thumb-film.png",
    description:
      "From rooftop premieres to borrowed church basements — a new generation of Black indie filmmakers is building its own circuit, its own critics, and its own box office.",
  },
  {
    id: 2,
    title: "Lagos to Brooklyn: Producers on the Bounce",
    creator: "Tempo Kitchen",
    views: "942K",
    duration: "01:26",
    category: "Afrobeats",
    thumb: "/images/thumb-afrobeats.png",
    description:
      "Two cities, one rhythm. The producers carrying the Afrobeats bounce across the Atlantic break down the log drums, the swing, and the group chats that built the sound.",
  },
  {
    id: 3,
    title: "Cypher Sundays: The Bronx Is Still Speaking",
    creator: "Mic Lineage",
    views: "1.3M",
    duration: "02:24",
    category: "Hip Hop",
    thumb: "/images/thumb-hiphop.png",
    description:
      "Every Sunday, the park fills up and the circle forms. Fifty years after the birth of hip hop, the Bronx cypher is still the truest open mic on earth.",
  },
  {
    id: 4,
    title: "Halftime Blueprint",
    creator: "Yardline Sports",
    views: "703K",
    duration: "LIVE",
    category: "HBCU Sports",
    thumb: "/images/thumb-hbcu.png",
    description:
      "Live from the yard: band formations, play breakdowns, and the pageantry that makes HBCU Saturday the best show in sports. Bring your cooler and your school pride.",
  },
  {
    id: 5,
    title: "Silicon Roots: Build What Works",
    creator: "Black Tech Office",
    views: "518K",
    duration: "01:59",
    category: "Black Tech",
    thumb: "/images/thumb-blacktech.png",
    description:
      "No hype cycles, no vanity metrics. Black founders and engineers talk shipping real products, owning the stack, and hiring the neighborhood first.",
  },
  {
    id: 6,
    title: "Protective Styles, Scalp Science, Real Routine",
    creator: "Crown Lab",
    views: "1.1M",
    duration: "02:13",
    category: "Culture",
    thumb: "/images/thumb-culture.png",
    description:
      "Knotless, knotty, twisted, loc'd — a trichologist and two braiders get honest about what protective styling actually protects, and the routine your scalp has been asking for.",
  },
  {
    id: 7,
    title: "The Jollof Debate Gets a Blind Taste Test",
    creator: "Sunday Pot",
    views: "2.4M",
    duration: "01:55",
    category: "Soul Food",
    thumb: "/images/thumb-soulfood.png",
    description:
      "Ghana, Nigeria, Senegal, and Grandma's cast-iron all enter the kitchen — but nobody knows whose plate is whose. The jollof wars, settled by the only judges that matter: taste buds.",
  },
  {
    id: 8,
    title: "Sunday Sound: Choirs That Raised Us",
    creator: "Higher Ground",
    views: "860K",
    duration: "02:08",
    category: "Gospel",
    thumb: "/images/thumb-gospel.png",
    description:
      "Before the playlists, there was the choir stand. A tribute to the directors, the altos who carried the key change, and the sound that raised generations.",
  },
  {
    id: 9,
    title: "Kente Meets Street: The New Silhouette",
    creator: "Thread & Root",
    views: "764K",
    duration: "01:47",
    category: "Style",
    thumb: "/images/thumb-style.png",
    description:
      "Heritage cloth on modern blocks. Designers weaving kente, mudcloth, and Ankara into streetwear silhouettes — without asking anybody's permission.",
  },
  {
    id: 10,
    title: "Granddaddy's Porch: Stories We Can't Lose",
    creator: "Elder Archive",
    views: "1.5M",
    duration: "02:31",
    category: "Roots",
    thumb: "/images/thumb-roots.png",
    description:
      "Sweet tea, a slow fan, and seventy years of memory. We sit with elders recording the family stories, recipes, and migration routes that can't be allowed to fade.",
  },
  {
    id: 11,
    title: "Blue Light Sessions: The Sax Never Left",
    creator: "Velvet Note",
    views: "612K",
    duration: "02:02",
    category: "Jazz",
    thumb: "/images/thumb-jazz.png",
    description:
      "In a basement club lit blue, a quartet proves the saxophone never went anywhere — it was just waiting for the room to get quiet enough to hear it.",
  },
  {
    id: 12,
    title: "Roots of the Rhythm",
    creator: "Kojo Beats",
    views: "812K",
    duration: "02:11",
    category: "Hip Hop",
    thumb: "/images/thumb-hiphop.png",
    description:
      "From djembe to 808: a beatmaker traces the drum's journey from West Africa through the Caribbean to the trap, chopping samples with the ancestors in the room.",
  },
];

const THUMB_BY_CATEGORY: Record<string, string> = {
  "Film Room": "/images/thumb-film.png",
  Afrobeats: "/images/thumb-afrobeats.png",
  "Hip Hop": "/images/thumb-hiphop.png",
  "HBCU Sports": "/images/thumb-hbcu.png",
  "Black Tech": "/images/thumb-blacktech.png",
  Culture: "/images/thumb-culture.png",
  "Soul Food": "/images/thumb-soulfood.png",
  Gospel: "/images/thumb-gospel.png",
  Style: "/images/thumb-style.png",
  Roots: "/images/thumb-roots.png",
  Jazz: "/images/thumb-jazz.png",
};

/** Stable negative numeric id derived from a uuid — avoids showcase id collisions. */
function uploadId(uuid: string): number {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) {
    h = (Math.imul(h, 31) + uuid.charCodeAt(i)) | 0;
  }
  return h === 0 ? -1 : -Math.abs(h);
}

function formatViews(views: number): string {
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K`;
  return `${views}`;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0)
    return "—:—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Row shape returned by the published-videos select below. */
type VideoListRow = Pick<
  VideoRow,
  | "id"
  | "title"
  | "description"
  | "category"
  | "duration_seconds"
  | "file_path"
  | "views"
  | "created_at"
>;

function rowToVideo(row: VideoListRow): Video {
  const src = supabase
    ? supabase.storage.from("videos").getPublicUrl(row.file_path).data
        .publicUrl
    : undefined;
  const category = row.category ?? "Culture";
  return {
    id: uploadId(row.id),
    title: row.title,
    creator: "ROOTLINE Creator",
    views: formatViews(row.views ?? 0),
    duration: formatDuration(row.duration_seconds),
    category,
    thumb: THUMB_BY_CATEGORY[category] ?? "/images/thumb-culture.png",
    description: row.description ?? "",
    src,
    isNew: true,
  };
}

export default function Watch() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Video | null>(null);
  const [uploads, setUploads] = useState<Video[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  // Fetch real creator uploads; any failure silently falls back to showcase-only.
  useEffect(() => {
    // Capture into a local const so the non-null narrowing survives into the closure.
    const client = supabase;
    if (!client) return;
    let cancelled = false;
    const load = async () => {
      try {
        const { data, error } = await client
          .from("videos")
          .select(
            "id,title,description,category,duration_seconds,file_path,views,created_at",
          )
          .eq("status", "published")
          .order("created_at", { ascending: false });
        if (cancelled || error) return;
        setUploads((data ?? []).map(rowToVideo));
      } catch {
        // Network/RLS failure — keep the showcase lineup.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lineup = uploads.length > 0 ? [...uploads, ...VIDEOS] : VIDEOS;

  const visible =
    activeFilter === "All"
      ? lineup
      : lineup.filter((v) => v.category === activeFilter);

  return (
    <section id="watch" className="bg-[#0A0908] py-24">
      {/* Local keyframes: card entrance + LIVE pulse (shared class names prefixed rl-) */}
      <style>{`
        @keyframes rl-card-enter {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .rl-card-enter { animation: rl-card-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes rl-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        .rl-live-dot { animation: rl-live-pulse 1.2s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`transition-all duration-700 ease-out ${
            headerVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <p className="gold-text text-xs font-semibold uppercase tracking-[0.3em]">
            The Lineup
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl leading-[1.05] tracking-tight text-[#F5EFE6] sm:text-5xl lg:text-6xl">
            Every Window of the{" "}
            <em className="gold-text italic">Culture</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-400">
            One network, every frequency. Jazz basements and gospel choirs,
            cyphers and codebases — pick a window and step inside.
          </p>

          {/* Filter rail */}
          <div
            className="mt-10 flex flex-wrap gap-2.5"
            role="tablist"
            aria-label="Filter videos by category"
          >
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? "gold-btn"
                      : "border border-white/20 text-stone-300 hover:border-[#D4A437]/60 hover:text-[#F5EFE6]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kente accent divider */}
        <div className="mt-12 flex h-[3px] w-full overflow-hidden rounded-full" aria-hidden="true">
          <span className="w-1/3 bg-[#D4A437]" />
          <span className="w-1/3 bg-[#B5372A]" />
          <span className="w-1/3 bg-[#1E6B4F]" />
        </div>

        {/* Grid — keying by filter re-mounts cards so the entrance stagger replays */}
        <div
          key={activeFilter}
          className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={setSelected}
              style={{ animationDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
      </div>

      <PlayerModal
        key={selected?.id ?? "none"}
        video={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </section>
  );
}
