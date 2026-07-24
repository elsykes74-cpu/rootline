import { useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Lock,
  Users,
} from "lucide-react";
import { EARNING_LANES } from "./data";

const VISIBILITY_OPTIONS = [
  { value: "draft", label: "Draft", icon: FileText },
  { value: "unlisted", label: "Unlisted", icon: EyeOff },
  { value: "public", label: "Public demo", icon: Globe },
  { value: "members", label: "Members", icon: Users },
  { value: "scheduled", label: "Scheduled", icon: Clock3 },
] as const;

export default function StepPublish() {
  const [visibility, setVisibility] = useState<string>("public");
  const [published, setPublished] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (published) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#D4A437]/50 bg-[#D4A437]/5 px-6 py-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4A437] bg-[#D4A437]/15 text-[#D4A437]">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <p className="font-display text-2xl text-[#F5EFE6]">
            Published <span className="italic text-[#D4A437]">as demo.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            1080p preview live · 4K processing continues · Receipt{" "}
            <span className="font-semibold text-[#F5EFE6]">#RL-2026-0847</span>
          </p>

          <button
            type="button"
            onClick={() => setReceiptOpen((v) => !v)}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-sm border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F5EFE6] transition-colors duration-300 hover:border-[#D4A437] hover:text-[#D4A437]"
          >
            <Eye className="h-4 w-4" />
            {receiptOpen ? "Hide receipt" : "View receipt"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                receiptOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-500 ${
              receiptOpen
                ? "mt-6 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <dl className="rounded-xl border border-white/10 bg-[#0A0908]/60 text-left">
                {[
                  ["Receipt", "#RL-2026-0847"],
                  ["Visibility", "Public demo"],
                  ["Preview", "1080p live"],
                  ["4K encode", "Continuing in background"],
                  ["Rights scan", "Clear — declarations attached"],
                  ["FairPay pre-check", "Passed to human review queue"],
                  ["Review record", "Pending — no income impact while open"],
                  ["Issued", "Demo session · Feb 10, 2026 · 14:32 CST"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className={`flex items-center justify-between gap-4 px-5 py-3 ${
                      i > 0 ? "border-t border-white/5" : ""
                    }`}
                  >
                    <dt className="text-xs uppercase tracking-wider text-stone-500">
                      {k}
                    </dt>
                    <dd className="text-right text-xs font-medium text-[#F5EFE6]">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500">
          Demo only — nothing was uploaded, transcoded, or published anywhere.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visibility */}
      <div>
        <label
          htmlFor="studio-visibility"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-400"
        >
          Visibility
        </label>
        <select
          id="studio-visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/15 bg-[#141210] px-4 py-2.5 text-sm text-[#F5EFE6] outline-none transition-colors duration-300 focus:border-[#D4A437]"
        >
          {VISIBILITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="mt-3 flex flex-wrap gap-2">
          {VISIBILITY_OPTIONS.map((o) => {
            const Icon = o.icon;
            const active = visibility === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setVisibility(o.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "border-[#D4A437] bg-[#D4A437] text-[#0A0908]"
                    : "border-white/15 text-stone-400 hover:border-[#D4A437]/60 hover:text-[#D4A437]"
                }`}
              >
                <Icon className="h-3 w-3" />
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Earning lanes */}
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Earning lanes
        </span>
        <ul className="divide-y divide-white/5 rounded-xl border border-white/10">
          {EARNING_LANES.map((lane) => (
            <li
              key={lane.name}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <span className="text-sm text-[#F5EFE6]">{lane.name}</span>
              <span className="rounded-full border border-[#D4A437]/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#D4A437]">
                {lane.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Held-review summary */}
      <div className="flex gap-3 rounded-xl border border-[#B5372A]/40 bg-[#B5372A]/10 px-4 py-3">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#B5372A]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F5EFE6]">
            Held-review summary
          </p>
          <p className="mt-1 text-xs leading-relaxed text-stone-400">
            Income-impacting changes stay in held-review while a review record
            is pending. Publishing is never blocked — monetization simply waits
            on evidence-backed human review.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPublished(true)}
        className="w-full rounded-sm bg-[#D4A437] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e2b84f]"
      >
        Publish demo video
      </button>
    </div>
  );
}
