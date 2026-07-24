import { useEffect, useRef, useState } from "react";
import { Check, Heart, Share2, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryAudioSrc, categoryVideoSrc, type Video } from "@/components/VideoCard";

interface PlayerModalProps {
  video: Video | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUPPORT_AMOUNTS = [5, 10, 25] as const;

const COMMENTS = [
  {
    name: "Marcus T.",
    text: "This is what the algorithm could never give us. Rooted, warm, real — I feel like I'm sitting with family.",
    likes: "2.1K",
  },
  {
    name: "Denise W.",
    text: "Played it three times back to back. Somebody finally built the room we deserved. The ancestors are smiling.",
    likes: "876",
  },
];

function formatLikeCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;
}

/** Shared category stinger element — only one stinger ever plays at a time. */
const stingerAudio =
  typeof Audio !== "undefined" ? new Audio() : (null as unknown as HTMLAudioElement);
const STINGER_VOLUME = 0.45;

function stopStinger() {
  if (!stingerAudio) return;
  stingerAudio.pause();
  stingerAudio.currentTime = 0;
}

export default function PlayerModal({ video, open, onOpenChange }: PlayerModalProps) {
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportedAmount, setSupportedAmount] = useState<number | null>(null);
  const [stingerMuted, setStingerMuted] = useState(false);
  const [loopFailed, setLoopFailed] = useState(false);
  const shareTimeoutRef = useRef<number | null>(null);

  // Play the category stinger once when the modal opens for a video;
  // stop it when the modal closes or the video changes.
  useEffect(() => {
    if (!open || !video || video.src || !stingerAudio) {
      stopStinger();
      return;
    }
    stopStinger();
    stingerAudio.src = categoryAudioSrc(video.category);
    stingerAudio.volume = STINGER_VOLUME;
    stingerAudio.muted = stingerMuted;
    stingerAudio.play().catch(() => {
      // Missing file or autoplay block — fail silently.
    });
    return stopStinger;
  }, [open, video]);

  // Retry the living loop for each newly opened video.
  useEffect(() => {
    setLoopFailed(false);
  }, [open, video]);

  // Keep the shared element in sync with the mute toggle.
  useEffect(() => {
    if (stingerAudio) stingerAudio.muted = stingerMuted;
  }, [stingerMuted]);

  // Clear any pending share-reset timeout on unmount.
  useEffect(
    () => () => {
      if (shareTimeoutRef.current !== null) {
        window.clearTimeout(shareTimeoutRef.current);
      }
    },
    []
  );

  if (!video) return null;

  const likeBase = 3200 + video.id * 271;
  const likeCount = likeBase + (liked ? 1 : 0);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {
        // Clipboard unavailable (permissions/context) — visual confirmation still shows.
      });
    }
    setShared(true);
    if (shareTimeoutRef.current !== null) {
      window.clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = window.setTimeout(() => setShared(false), 2000);
  };

  const handleSupport = (amount: number) => {
    setSupportedAmount(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full gap-0 overflow-hidden border-white/10 bg-[#0A0908] p-0 text-[#F5EFE6] sm:max-w-6xl [&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:text-[#F5EFE6]">
        <div className="grid max-h-[92vh] lg:grid-cols-[3fr_2fr]">
          {/* Player area */}
          <div className="relative aspect-video overflow-hidden bg-black lg:aspect-auto lg:min-h-[540px]">
            {video.src ? (
              /* Real creator upload — actual playback */
              <video
                key={video.src}
                src={video.src}
                controls
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full bg-black object-contain"
              />
            ) : loopFailed ? (
              <>
                <img
                  src={video.thumb}
                  alt={`${video.title} — now playing preview`}
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
              </>
            ) : (
              <>
                {/* Living category cinemagraph under the overlays */}
                <video
                  key={categoryVideoSrc(video.category)}
                  src={categoryVideoSrc(video.category)}
                  poster={video.thumb}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setLoopFailed(true)}
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                  title={`${video.title} — now playing preview`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
              </>
            )}

            {/* DEMO PREVIEW / CREATOR UPLOAD tag */}
            <span className="absolute left-4 top-4 z-10 rounded-sm border border-[#D4A437]/70 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4A437] backdrop-blur-sm">
              {video.src ? "Creator Upload" : "Demo Preview"}
            </span>

            {/* Stinger mute toggle (demo preview only) */}
            {!video.src && (
              <button
                type="button"
                onClick={() => setStingerMuted((m) => !m)}
                aria-pressed={stingerMuted}
                aria-label={stingerMuted ? "Unmute category stinger" : "Mute category stinger"}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#D4A437]/60 bg-black/60 text-[#D4A437] backdrop-blur-sm transition-all duration-300 hover:bg-[#D4A437] hover:text-black"
              >
                {stingerMuted ? (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}

            {/* Now playing label */}
            <p className="absolute bottom-5 left-5 hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5EFE6]/70 sm:block">
              Now Playing · {video.category}
            </p>
          </div>

          {/* Info panel */}
          <div className="max-h-[46vh] overflow-y-auto p-6 sm:p-8 lg:max-h-[92vh]">
            <DialogTitle className="font-display text-2xl leading-tight tracking-tight text-[#F5EFE6] sm:text-3xl">
              {video.title}
            </DialogTitle>
            <p className="mt-2 text-sm text-stone-400">
              {video.views} {video.duration === "LIVE" ? "watching now" : "views"} ·{" "}
              {video.category}
            </p>

            {/* Creator row */}
            <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4A437] text-base font-bold text-black">
                {video.creator.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#F5EFE6]">{video.creator}</p>
                <p className="text-xs text-stone-400">Verified creator · Rooted Network</p>
              </div>
              <button
                type="button"
                onClick={() => setFollowing((f) => !f)}
                className={`shrink-0 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  following
                    ? "border border-white/20 text-stone-300 hover:border-white/40"
                    : "gold-btn"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>

            {/* Description */}
            <DialogDescription className="mt-4 text-sm leading-relaxed text-stone-400">
              {video.description}
            </DialogDescription>

            {/* Action row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setLiked((l) => !l)}
                aria-pressed={liked}
                className={`flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  liked
                    ? "border-[#B5372A] bg-[#B5372A]/20 text-[#F5EFE6]"
                    : "border-white/20 text-stone-300 hover:border-white/40 hover:text-[#F5EFE6]"
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-300 ${
                    liked ? "fill-[#B5372A] text-[#B5372A] scale-110" : ""
                  }`}
                />
                {formatLikeCount(likeCount)}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-300 transition-all duration-300 hover:border-white/40 hover:text-[#F5EFE6]"
              >
                {shared ? (
                  <>
                    <Check className="h-4 w-4 text-[#1E6B4F]" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSupportOpen((o) => !o);
                  setSupportedAmount(null);
                }}
                className="gold-btn rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                Support Creator
              </button>
            </div>

            {/* Support panel */}
            {supportOpen && (
              <div className="gold-frame mt-4 rounded-sm p-4">
                {supportedAmount === null ? (
                  <>
                    <p className="text-sm font-semibold text-[#F5EFE6]">
                      Direct Support — 90% to creator.
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      Every dollar has a receipt.
                    </p>
                    <div className="mt-4 flex gap-2.5">
                      {SUPPORT_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleSupport(amount)}
                          className="flex-1 rounded-sm border border-[#D4A437]/60 py-2.5 text-sm font-bold text-[#D4A437] transition-all duration-300 hover:bg-[#D4A437] hover:text-black"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E6B4F]">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#F5EFE6]">
                        ${supportedAmount} on its way to {video.creator}.
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        90% direct. Receipt #RL-{video.id}
                        {String(supportedAmount).padStart(4, "0")} — thank you for pouring back in.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSupportedAmount(null)}
                        className="mt-3 text-xs font-bold uppercase tracking-widest text-[#D4A437] hover:underline"
                      >
                        Give again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comments teaser */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                From the Community
              </p>
              <div className="mt-4 space-y-5">
                {COMMENTS.map((comment) => (
                  <div key={comment.name} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4A437]/50 text-xs font-bold text-[#D4A437]">
                      {comment.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#F5EFE6]">
                        {comment.name}{" "}
                        <span className="ml-2 font-normal text-stone-500">
                          {comment.likes} likes
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-stone-400">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-stone-500">
                4,208 more voices in the room — join the conversation.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
