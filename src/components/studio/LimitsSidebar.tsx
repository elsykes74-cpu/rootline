import { Crown, FlaskConical, Gauge } from "lucide-react";
import { LIMIT_TIERS } from "./data";

const TIER_ICONS = [Gauge, Crown, FlaskConical];

export default function LimitsSidebar() {
  return (
    <aside className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4A437]">
        Upload limits
      </p>
      {LIMIT_TIERS.map((tier, i) => {
        const Icon = TIER_ICONS[i] ?? Gauge;
        return (
          <div
            key={tier.name}
            className={`rounded-xl border px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 ${
              tier.highlight
                ? "border-[#D4A437]/60 bg-[#D4A437]/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon
                className={`h-4 w-4 ${
                  tier.highlight ? "text-[#D4A437]" : "text-stone-400"
                }`}
              />
              <p className="text-sm font-semibold text-[#F5EFE6]">{tier.name}</p>
              {tier.highlight && (
                <span className="ml-auto rounded-full bg-[#D4A437] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A0908]">
                  Yours
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {tier.specs.map((s) => (
                <li key={s} className="text-xs leading-relaxed text-stone-400">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <p className="text-[11px] leading-relaxed text-stone-500">
        Limits are demo defaults. Partners earn more room by building trust —
        not by paying for reach.
      </p>
    </aside>
  );
}
