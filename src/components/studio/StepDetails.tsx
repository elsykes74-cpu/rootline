import { Info } from "lucide-react";
import { CATEGORIES, VIDEO_TYPES } from "./data";

export interface PackageDetails {
  title: string;
  category: string;
  description: string;
  videoType: string;
  captions: "en" | "en-es";
  thumbnail: "custom" | "frames";
  audience: "general" | "restricted";
}

export const EMPTY_DETAILS: PackageDetails = {
  title: "",
  category: "",
  description: "",
  videoType: "",
  captions: "en",
  thumbnail: "frames",
  audience: "general",
};

interface StepDetailsProps {
  details: PackageDetails;
  onChange: (details: PackageDetails) => void;
}

const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-400";
const fieldInput =
  "w-full rounded-lg border border-white/15 bg-[#141210] px-4 py-2.5 text-sm text-[#F5EFE6] placeholder:text-stone-500 outline-none transition-colors duration-300 focus:border-[#D4A437]";

export default function StepDetails({ details, onChange }: StepDetailsProps) {
  const set = <K extends keyof PackageDetails>(key: K, value: PackageDetails[K]) =>
    onChange({ ...details, [key]: value });

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="studio-title" className={fieldLabel}>
            Title
          </label>
          <input
            id="studio-title"
            type="text"
            value={details.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Give the people a title worth clicking"
            className={fieldInput}
          />
        </div>

        <div>
          <label htmlFor="studio-category" className={fieldLabel}>
            Category
          </label>
          <select
            id="studio-category"
            value={details.category}
            onChange={(e) => set("category", e.target.value)}
            className={`${fieldInput} appearance-none`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={fieldLabel}>Captions</span>
          <div className="flex gap-4 pt-1.5">
            {(
              [
                { value: "en", label: "English" },
                { value: "en-es", label: "English + Spanish" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#F5EFE6]"
              >
                <input
                  type="radio"
                  name="studio-captions"
                  checked={details.captions === opt.value}
                  onChange={() => set("captions", opt.value)}
                  className="h-4 w-4 accent-[#D4A437]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="studio-description" className={fieldLabel}>
            Description
          </label>
          <textarea
            id="studio-description"
            rows={4}
            value={details.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What is this about, who is it for, and why does it matter?"
            className={`${fieldInput} resize-none`}
          />
        </div>
      </div>

      {/* Type chips */}
      <div>
        <span className={fieldLabel}>Package type</span>
        <div className="flex flex-wrap gap-2">
          {VIDEO_TYPES.map((t) => {
            const active = details.videoType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => set("videoType", t)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "border-transparent gold-btn"
                    : "border-white/15 text-stone-300 hover:border-[#D4A437]/60 hover:text-[#D4A437]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <span className={fieldLabel}>Thumbnail</span>
          <div className="flex gap-4 pt-1.5">
            {(
              [
                { value: "frames", label: "Frame suggestions" },
                { value: "custom", label: "Custom upload" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#F5EFE6]"
              >
                <input
                  type="radio"
                  name="studio-thumbnail"
                  checked={details.thumbnail === opt.value}
                  onChange={() => set("thumbnail", opt.value)}
                  className="h-4 w-4 accent-[#D4A437]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className={fieldLabel}>Audience</span>
          <div className="flex gap-4 pt-1.5">
            {(
              [
                { value: "general", label: "General" },
                { value: "restricted", label: "Age-restricted review" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#F5EFE6]"
              >
                <input
                  type="radio"
                  name="studio-audience"
                  checked={details.audience === opt.value}
                  onChange={() => set("audience", opt.value)}
                  className="h-4 w-4 accent-[#D4A437]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A437]" />
        <p className="text-xs leading-relaxed text-stone-400">
          Monetization lanes stay planned; any restriction is held in review
          until evidence-backed human review.
        </p>
      </div>
    </div>
  );
}
