import { useEffect, useRef, useState } from 'react'
import { Clapperboard, Volume2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const RECEIPT_AUDIO: Record<number, string> = {
  1: '/audio/griot-receipt-1.mp3',
  2: '/audio/griot-receipt-2.mp3',
  3: '/audio/griot-receipt-3.mp3',
}

const RECEIPT_VIDEO = '/videos/griot-receipt.mp4'
const GRIOT_PORTRAIT = '/images/griot.png'

/* Module-level singleton: only one receipt speaks at a time. */
let sharedAudio: HTMLAudioElement | null = null
let sharedOwnerStop: (() => void) | null = null

function stopShared() {
  if (sharedAudio) {
    sharedAudio.pause()
    sharedAudio.currentTime = 0
    sharedAudio = null
  }
  const stop = sharedOwnerStop
  sharedOwnerStop = null
  stop?.()
}

interface GriotReceiptProps {
  /** 1-based receipt number matching the held queue item. */
  receipt: 1 | 2 | 3
}

/** "Hear the Griot" — the elder reads this receipt aloud (receipt 1 also on film). */
export default function GriotReceipt({ receipt }: GriotReceiptProps) {
  const [playing, setPlaying] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const mineRef = useRef(false)

  useEffect(
    () => () => {
      if (mineRef.current) stopShared()
    },
    [],
  )

  const toggleAudio = () => {
    if (playing) {
      stopShared()
      return
    }
    stopShared()
    const audio = new Audio(RECEIPT_AUDIO[receipt])
    sharedAudio = audio
    mineRef.current = true
    sharedOwnerStop = () => {
      mineRef.current = false
      setPlaying(false)
    }
    audio.onended = () => {
      if (sharedAudio === audio) stopShared()
    }
    audio.play().catch(() => {})
    setPlaying(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="relative inline-flex h-8 w-8 shrink-0">
        {playing && (
          <span className="absolute inset-0 animate-ping rounded-full border border-[#D4A437]/80" />
        )}
        <img
          src={GRIOT_PORTRAIT}
          alt="The Griot"
          className={`h-8 w-8 rounded-full border object-cover transition-shadow duration-500 ${
            playing
              ? 'border-[#E5BB54] shadow-[0_0_14px_rgba(212,164,55,0.6)]'
              : 'border-[#D4A437]/50 shadow-[0_0_6px_rgba(212,164,55,0.2)]'
          }`}
        />
      </span>

      <button
        type="button"
        onClick={toggleAudio}
        aria-pressed={playing}
        className="flex items-center gap-2 border border-[#D4A437]/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A437] transition-all hover:-translate-y-0.5 hover:border-[#E5BB54] hover:bg-[#D4A437]/10 hover:text-[#E5BB54]"
      >
        <Volume2 size={14} className={playing ? 'animate-pulse' : ''} />
        {playing ? 'Silence the Griot' : 'Hear the Griot'}
      </button>

      {receipt === 1 && (
        <>
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="flex items-center gap-2 border border-[#D4A437]/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300 transition-all hover:-translate-y-0.5 hover:border-[#D4A437] hover:text-[#E5BB54]"
          >
            <Clapperboard size={14} />
            Watch him read it
          </button>

          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogContent className="z-[95] max-w-lg border-[#D4A437]/60 bg-[#0A0908] p-5 shadow-[0_0_60px_rgba(212,164,55,0.25)] sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-[#D4A437]">
                  The Griot testifies
                </DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  Receipt No. 1 — read aloud in the Boardroom
                </DialogDescription>
              </DialogHeader>
              <video
                src={RECEIPT_VIDEO}
                autoPlay
                controls
                playsInline
                className="w-full border border-[#D4A437]/30 bg-black"
              />
              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-stone-600">
                Every dollar, accounted for
              </p>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
