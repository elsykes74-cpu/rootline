import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface IntroVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function IntroVideoModal({ open, onOpenChange }: IntroVideoModalProps) {
  const [errored, setErrored] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset the error state each time the modal opens so a video that
  // appears later (e.g. file finished generating) can still play.
  useEffect(() => {
    if (open) {
      setErrored(false);
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden border-[#D4A437]/30 bg-[#0A0908] p-0 text-[#F5EFE6] sm:max-w-4xl"
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4A437]">
            Welcome to the Line
          </p>
          {/* Custom gold close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close intro film"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4A437]/60 text-[#D4A437] transition-all duration-300 hover:bg-[#D4A437] hover:text-[#0A0908]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <DialogTitle className="sr-only">ROOTLINE intro film</DialogTitle>
        <DialogDescription className="sr-only">
          A short welcome film introducing the ROOTLINE creator network.
        </DialogDescription>

        {/* Gold-framed 16:9 player */}
        <div className="px-5 pb-6 pt-4 sm:px-8 sm:pb-8">
          <div className="rounded-sm border border-[#D4A437]/70 bg-black p-1 shadow-[0_0_50px_rgba(212,164,55,0.18)]">
            {errored ? (
              /* Graceful placeholder while the intro film is being developed */
              <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-b from-[#0A0908] via-[#141210] to-[#0A0908] px-6 text-center">
                <span className="text-[#D4A437]" aria-hidden="true">
                  ✦
                </span>
                <p className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight text-[#F5EFE6] sm:text-3xl">
                  The intro film is being developed —
                  <br />
                  welcome to <em className="italic text-[#D4A437]">ROOTLINE</em>.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="mt-8 inline-flex items-center gap-2 bg-[#D4A437] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
                >
                  Explore the lineup
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                src="/videos/intro.mp4"
                className="aspect-video w-full bg-black"
                controls
                autoPlay
                playsInline
                onError={() => setErrored(true)}
              />
            )}
          </div>

          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-stone-500">
            One stage · Our stage
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
