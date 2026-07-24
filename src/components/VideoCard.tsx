import { useRef, useState, type CSSProperties } from "react";
import { Play } from "lucide-react";

export interface Video {
  id: number;
  title: string;
  creator: string;
  views: string;
  /** "MM:SS" or "LIVE" */
  duration: string;
  category: string;
  thumb: string;
  description: string;
  /** Real playback URL for creator uploads; when present PlayerModal plays it. */
  src?: string;
  /** Marks freshly fetched creator uploads in the Watch grid. */
  isNew?: boolean;
}

const CATEGORY_AUDIO_SLUGS: Record<string, string> = {
  "Film Room": "film-room",
  Afrobeats: "afrobeats",
  "Hip Hop": "hip-hop",
  "HBCU Sports": "hbcu-sports",
  "Black Tech": "black-tech",
  Culture: "culture",
  "Soul Food": "soul-food",
  Gospel: "gospel",
  Style: "style",
  Roots: "roots",
  Jazz: "jazz",
};

/** Maps a video category to its category stinger audio file. */
export function categoryAudioSrc(category: string): string {
  const slug = CATEGORY_AUDIO_SLUGS[category];
  return slug ? `/audio/${slug}.mp3` : "/audio/culture.mp3";
}

/** Maps a video category to its living cinemagraph loop. */
export function categoryVideoSrc(category: string): string {
  const slug = CATEGORY_AUDIO_SLUGS[category];
  return slug ? `/videos/loop-${slug}.mp4` : "/videos/loop-culture.mp4";
}

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  style?: CSSProperties;
}

export default function VideoCard({ video, onSelect, style }: VideoCardProps) {
  const isLive = video.duration === "LIVE";
  const loopRef = useRef<HTMLVideoElement | null>(null);
  const [loopPlaying, setLoopPlaying] = useState(false);
  const [loopFailed, setLoopFailed] = useState(false);

  const startLoop = () => {
    const v = loopRef.current;
    if (!v || loopFailed) return;
    v.play().catch(() => {
      // Autoplay blocked or missing file — stay on the still image.
    });
  };

  const stopLoop = () => {
    const v = loopRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setLoopPlaying(false);
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(video)}
      onMouseEnter={startLoop}
      onMouseLeave={stopLoop}
      style={style}
      className="group rl-card-enter w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A437] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0908] rounded-sm"
      aria-label={`Play ${video.title} by ${video.creator}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-stone-900">
        <img
          src={video.thumb}
          alt={`${video.title} — thumbnail`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Living cinemagraph — crossfades in over the still on hover */}
        {!loopFailed && (
          <video
            ref={loopRef}
            src={categoryVideoSrc(video.category)}
            poster={video.thumb}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onPlaying={() => setLoopPlaying(true)}
            onError={() => setLoopFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              loopPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 transition-opacity duration-500 group-hover:opacity-80" />

        {/* Gold play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A437] text-black shadow-[0_0_30px_rgba(212,164,55,0.45)] opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
            <Play className="h-6 w-6 fill-current pl-0.5" />
          </span>
        </div>

        {/* Category tag */}
        <span className="absolute left-3 top-3 rounded-sm border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE6]/90 backdrop-blur-sm">
          {video.category}
        </span>

        {/* New badge — creator uploads freshly added to the lineup */}
        {video.isNew && (
          <span className="absolute right-3 top-3 rounded-sm bg-[#D4A437] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A0908] shadow-[0_0_14px_rgba(212,164,55,0.4)]">
            New
          </span>
        )}

        {/* Duration / LIVE badge */}
        {isLive ? (
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm bg-[#B5372A] px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white">
            <span className="rl-live-dot h-1.5 w-1.5 rounded-full bg-white" />
            Live
          </span>
        ) : (
          <span className="absolute bottom-3 right-3 rounded-sm bg-black/75 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-[#F5EFE6]">
            {video.duration}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="mt-4 flex items-start gap-3">
        {/* Creator initial avatar */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4A437] text-sm font-bold text-black">
          {video.creator.charAt(0)}
        </span>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#F5EFE6] transition-colors duration-300 group-hover:text-[#D4A437]">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-stone-400">
            {video.creator} · {isLive ? `${video.views} watching` : `${video.views} views`}
          </p>
        </div>
      </div>
    </button>
  );
}
