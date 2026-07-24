import { useEffect, useRef, useState } from "react";
import { Check, CircleDashed, Loader2, Play, ShieldCheck } from "lucide-react";
import { STAGES, type StageStatus } from "./data";

interface StepProcessingProps {
  onCompleteChange: (complete: boolean) => void;
}

const STATUS_LABEL: Record<StageStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  complete: "Complete",
};

export default function StepProcessing({ onCompleteChange }: StepProcessingProps) {
  const [statuses, setStatuses] = useState<StageStatus[]>(() =>
    STAGES.map(() => "queued" as StageStatus),
  );
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const done = statuses.every((s) => s === "complete");

  useEffect(() => {
    onCompleteChange(done);
  }, [done, onCompleteChange]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const advance = (index: number) => {
    if (index >= STAGES.length) {
      setRunning(false);
      return;
    }
    setStatuses((prev) => {
      const next = [...prev];
      next[index] = "processing";
      return next;
    });
    const delay = 600 + Math.random() * 300;
    timerRef.current = window.setTimeout(() => {
      setStatuses((prev) => {
        const next = [...prev];
        next[index] = "complete";
        return next;
      });
      advance(index + 1);
    }, delay);
  };

  const start = () => {
    if (running) return;
    setStatuses(STAGES.map(() => "queued" as StageStatus));
    setRunning(true);
    timerRef.current = window.setTimeout(() => advance(0), 250);
  };

  const completedCount = statuses.filter((s) => s === "complete").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-stone-400">
            {done
              ? "All 9 stages complete. FairPay pre-check cleared for human review."
              : running
                ? `Stage ${Math.min(completedCount + 1, STAGES.length)} of ${STAGES.length} — simulated locally, no upload occurs.`
                : "Nine stages run in sequence. This is a local simulation — nothing is uploaded."}
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          disabled={running}
          className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
            running
              ? "cursor-not-allowed bg-[#D4A437]/30 text-[#0A0908]/60"
              : "bg-[#D4A437] text-[#0A0908] hover:bg-[#e2b84f]"
          }`}
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {running ? "Processing…" : done ? "Run again" : "Start Processing"}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#D4A437] transition-all duration-500"
          style={{ width: `${(completedCount / STAGES.length) * 100}%` }}
        />
      </div>

      <ol className="space-y-1">
        {STAGES.map((stage, i) => {
          const status = statuses[i];
          return (
            <li
              key={stage.id}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors duration-300 ${
                status === "processing" ? "bg-[#D4A437]/10" : ""
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                {status === "complete" ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A437] text-[#0A0908]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : status === "processing" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#D4A437]" />
                ) : (
                  <CircleDashed className="h-5 w-5 text-stone-600" />
                )}
              </span>
              <span
                className={`text-sm transition-colors duration-300 ${
                  status === "complete"
                    ? "text-[#F5EFE6]"
                    : status === "processing"
                      ? "font-semibold text-[#F5EFE6]"
                      : "text-stone-500"
                }`}
              >
                {stage.label}
              </span>
              <span
                className={`ml-auto text-[11px] font-medium uppercase tracking-wider ${
                  status === "complete"
                    ? "text-[#D4A437]"
                    : status === "processing"
                      ? "text-[#F5EFE6]"
                      : "text-stone-600"
                }`}
              >
                {STATUS_LABEL[status]}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        className={`flex gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
          done
            ? "border-[#1E6B4F]/60 bg-[#1E6B4F]/10"
            : "border-white/10 bg-white/[0.03]"
        }`}
      >
        <ShieldCheck
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            done ? "text-[#1E6B4F]" : "text-stone-500"
          }`}
        />
        <p className="text-xs leading-relaxed text-stone-400">
          AI flags concerns. Humans review with evidence. Creators get receipts.
        </p>
      </div>
    </div>
  );
}
