import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const GRIOT_PORTRAIT = "/images/griot.png";
const GRIOT_VIDEO = "/videos/griot-welcome.mp4";
const BUBBLE_KEY = "rootline:griot-bubble";

const GRIOT_QUOTE =
  "\u201CEvery story is a thread. Every thread is a life. Welcome home, child of the Line \u2014 the ancestors have been waiting for you to listen.\u201D";

export default function Griot() {
  const [theaterOpen, setTheaterOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // One-time invitation bubble: appears 2.5s after first visit, remembers dismissal.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(BUBBLE_KEY) === "dismissed";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    const timer = window.setTimeout(() => setBubbleVisible(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissBubble = () => {
    setBubbleVisible(false);
    try {
      window.localStorage.setItem(BUBBLE_KEY, "dismissed");
    } catch {
      /* localStorage unavailable — bubble simply re-shows next visit */
    }
  };

  const closeTheater = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setTheaterOpen(false);
  };

  // ESC to close + body scroll lock while the theater is open.
  useEffect(() => {
    if (!theaterOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTheater();
    };
    window.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [theaterOpen]);

  const openTheater = () => {
    setVideoFailed(false);
    setVideoEnded(false);
    dismissBubble();
    setTheaterOpen(true);
  };

  return (
    <>
      {/* Scoped keyframes — keeps Griot self-contained */}
      <style>{`
        @keyframes griot-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }
        @keyframes griot-bubble-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes griot-theater-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes griot-frame-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* First-visit invitation bubble */}
      {bubbleVisible && !theaterOpen && (
        <div
          role="status"
          className="fixed bottom-28 right-6 z-40 w-60 rounded-xl border border-[#D4A437]/60 bg-[#0A0908]/95 p-4 shadow-[0_8px_40px_rgba(212,164,55,0.18)] backdrop-blur-md"
          style={{ animation: "griot-bubble-in 0.6s ease-out both" }}
        >
          <button
            type="button"
            onClick={dismissBubble}
            aria-label="Dismiss invitation"
            className="absolute right-2 top-2 text-stone-500 transition-colors hover:text-[#D4A437]"
          >
            <X size={14} />
          </button>
          <p className="font-display text-sm italic leading-relaxed text-[#F5EFE6]">
            The Griot wants to welcome you
          </p>
          <button
            type="button"
            onClick={openTheater}
            className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4A437] transition-colors hover:text-[#E5BB54]"
          >
            Receive his words
          </button>
        </div>
      )}

      {/* Floating host orb */}
      <button
        type="button"
        onClick={openTheater}
        aria-label="Meet the Griot"
        className="fixed bottom-6 right-6 z-40 h-16 w-16 overflow-hidden rounded-full border-2 border-[#D4A437] shadow-[0_0_24px_rgba(212,164,55,0.35)] transition-shadow duration-500 hover:shadow-[0_0_36px_rgba(212,164,55,0.55)]"
        style={{ animation: "griot-breathe 4s ease-in-out infinite" }}
      >
        <img
          src={GRIOT_PORTRAIT}
          alt="The Griot"
          className="h-full w-full object-cover"
        />
      </button>

      {/* The Griot's Theater */}
      {theaterOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="The Griot's Theater"
            onClick={closeTheater}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A0908]/96 px-4 backdrop-blur-md"
            style={{ animation: "griot-theater-in 0.5s ease-out both" }}
          >
            {/* His presence, faded large behind */}
            <img
              src={GRIOT_PORTRAIT}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-15 blur-md"
            />

            {/* Close — always visible */}
            <button
              type="button"
              onClick={closeTheater}
              aria-label="Close the Griot's Theater"
              className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A437]/40 text-[#D4A437] transition-all duration-300 hover:rotate-90 hover:border-[#D4A437] hover:bg-[#D4A437]/10"
            >
              <X size={20} />
            </button>

            {/* Centered composition */}
            <div
              className="relative flex w-full max-w-2xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
              style={{ animation: "griot-frame-in 0.7s ease-out 0.15s both" }}
            >
              {/* Eyebrow + serif line */}
              <p className="gold-text text-[10px] font-semibold uppercase tracking-[0.45em]">
                The Griot
              </p>
              <h2 className="font-display mt-2 mb-6 text-center text-3xl italic text-[#F5EFE6] sm:text-4xl">
                Keeper of the Stories.
              </h2>

              {videoFailed ? (
                /* Portrait fallback when the welcome video cannot play */
                <div className="gold-frame w-full max-w-md overflow-hidden rounded-2xl">
                  <img
                    src={GRIOT_PORTRAIT}
                    alt="The Griot, Keeper of the Stories"
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                /* Gold-framed player */
                <div className="gold-frame w-full overflow-hidden rounded-2xl">
                  <video
                    ref={videoRef}
                    src={GRIOT_VIDEO}
                    poster={GRIOT_PORTRAIT}
                    autoPlay
                    controls
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    onError={() => setVideoFailed(true)}
                    className="h-auto w-full bg-[#0A0908]"
                  />
                </div>
              )}

              {/* His words — small at first, full weight once he has spoken */}
              <blockquote
                className={`mt-6 max-w-xl text-center font-display italic leading-relaxed text-[#F5EFE6]/85 transition-all duration-700 ${
                  videoEnded || videoFailed ? "text-base sm:text-lg" : "text-sm"
                }`}
              >
                {GRIOT_QUOTE}
              </blockquote>

              <button
                type="button"
                onClick={closeTheater}
                className="gold-btn mt-7 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 hover:-translate-y-0.5"
              >
                Enter the Line
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
