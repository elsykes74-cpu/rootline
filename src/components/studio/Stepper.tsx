import { Check } from "lucide-react";
import { STEPS } from "./data";

interface StepperProps {
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}

export default function Stepper({ current, maxReached, onSelect }: StepperProps) {
  return (
    <ol className="flex flex-col gap-1">
      {STEPS.map((label, i) => {
        const isActive = i === current;
        const isComplete = i < current || (i < maxReached && i !== current);
        const reachable = i <= maxReached;
        return (
          <li key={label}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onSelect(i)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-300 ${
                isActive
                  ? "bg-[#D4A437]/10"
                  : reachable
                    ? "hover:bg-white/5"
                    : "cursor-not-allowed opacity-45"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                  isComplete
                    ? "border-[#D4A437] bg-[#D4A437] text-[#0A0908]"
                    : isActive
                      ? "border-[#D4A437] text-[#D4A437]"
                      : "border-white/20 text-stone-400"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-sm tracking-wide transition-colors duration-300 ${
                  isActive ? "font-semibold text-[#F5EFE6]" : "text-stone-400"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4A437]" />
              )}
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={`ml-[27px] block h-4 w-px ${
                  i < current ? "bg-[#D4A437]/60" : "bg-white/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
