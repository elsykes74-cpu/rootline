import { useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  CloudUpload,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Loader2,
  Lock,
  LogIn,
  Clock3,
  Users,
} from "lucide-react";
import { EARNING_LANES } from "./data";
import type { Source } from "./StepSelectFile";
import type { PackageDetails } from "./StepDetails";
import { useSupabaseAuth } from "@/lib/auth";
import { isSupabaseEnabled, supabase } from "@/lib/supabase";
import type { VideoInsert } from "@/lib/supabase";

const VISIBILITY_OPTIONS = [
  { value: "draft", label: "Draft", icon: FileText },
  { value: "unlisted", label: "Unlisted", icon: EyeOff },
  { value: "public", label: "Public demo", icon: Globe },
  { value: "members", label: "Members", icon: Users },
  { value: "scheduled", label: "Scheduled", icon: Clock3 },
] as const;

/** Wizard category labels → exact public.videos / Watch filter strings. */
const CATEGORY_MAP: Record<string, string> = {
  Film: "Film Room",
  "Hip-Hop": "Hip Hop",
  HBCU: "HBCU Sports",
};

type UploadState = "idle" | "uploading" | "saving" | "done" | "error";

interface StepPublishProps {
  source: Source | null;
  details: PackageDetails;
  onRequestSignIn: () => void;
}

function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return cleaned.length > 0 ? cleaned : "upload";
}

export default function StepPublish({
  source,
  details,
  onRequestSignIn,
}: StepPublishProps) {
  const { user } = useSupabaseAuth();
  const [visibility, setVisibility] = useState<string>("public");
  const [published, setPublished] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasRealFile = source?.kind === "file";
  const canRealPublish = isSupabaseEnabled && user !== null && hasRealFile;
  const busy = uploadState === "uploading" || uploadState === "saving";

  const handleRealPublish = async () => {
    if (!supabase || !user || !source || source.kind !== "file") return;
    setUploadError(null);
    setUploadState("uploading");
    try {
      const objectPath = `${user.id}/${crypto.randomUUID()}-${sanitizeFileName(
        source.file.name,
      )}`;
      const { error: storageError } = await supabase.storage
        .from("videos")
        .upload(objectPath, source.file, {
          contentType: source.file.type || "video/mp4",
        });
      if (storageError) throw new Error(storageError.message);

      setUploadState("saving");
      // Typed as VideoInsert; the `as never` cast works around supabase-js v2.110
      // resolving hand-written (non-generated) Database Insert types to never[].
      const payload: VideoInsert = {
        creator_id: user.id,
        title: details.title.trim(),
        description: details.description.trim() || null,
        category: CATEGORY_MAP[details.category] ?? details.category,
        file_path: objectPath,
        status: "published",
      };
      const { error: insertError } = await supabase
        .from("videos")
        .insert(payload as never);
      if (insertError) throw new Error(insertError.message);

      setUploadState("done");
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      setUploadState("error");
    }
  };

  /* -------- Real upload success -------- */
  if (uploadState === "done") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#1E6B4F]/60 bg-[#1E6B4F]/10 px-6 py-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#1E6B4F] bg-[#1E6B4F]/15 text-[#9FD6BC]">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <p className="font-display text-2xl text-[#F5EFE6]">
            Published to <span className="gold-text italic">ROOTLINE.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            <span className="font-semibold text-[#F5EFE6]">
              {details.title.trim()}
            </span>{" "}
            is live — it now leads the Watch lineup under{" "}
            <span className="font-semibold text-[#F5EFE6]">
              {CATEGORY_MAP[details.category] ?? details.category}
            </span>
            .
          </p>
          <p className="mt-2 text-xs text-stone-500">
            Signed in as {user?.email}
          </p>
        </div>
        <p className="text-center text-xs text-stone-500">
          Real upload — stored in the videos bucket and listed in
          public.videos.
        </p>
      </div>
    );
  }

  /* -------- Simulated demo success (unchanged) -------- */
  if (published) {
    return (
      <div className="space-y-6">
        <div className="gold-frame rounded-2xl px-6 py-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4A437] bg-[#D4A437]/15 text-[#D4A437]">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <p className="font-display text-2xl text-[#F5EFE6]">
            Published <span className="gold-text italic">as demo.</span>
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

  /* -------- Publish plan form -------- */
  return (
    <div className="space-y-6">
      {/* Supabase sign-in gate for real publishing */}
      {isSupabaseEnabled && !user && (
        <div className="gold-frame flex flex-wrap items-center gap-4 rounded-xl px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D4A437]/15 text-[#D4A437]">
            <LogIn className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#F5EFE6]">
              Sign in to publish for real
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-stone-400">
              A creator account uploads your file to the ROOTLINE lineup.
              Without one, this stays a local demo.
            </p>
          </div>
          <button
            type="button"
            onClick={onRequestSignIn}
            className="gold-btn shrink-0 rounded-sm px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Signed in but a demo package (no real file) is selected */}
      {isSupabaseEnabled && user && !hasRealFile && (
        <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <CloudUpload className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A437]" />
          <p className="text-xs leading-relaxed text-stone-400">
            You’re signed in as{" "}
            <span className="font-semibold text-[#F5EFE6]">{user.email}</span>{" "}
            — but a demo package has no real file to upload. Go back to Select
            File and drop a video to publish it for real, or continue with the
            simulated demo below.
          </p>
        </div>
      )}

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
                    ? "border-transparent gold-btn"
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

      {/* Real upload error + retry */}
      {uploadState === "error" && uploadError && (
        <div className="rounded-xl border border-[#B5372A]/40 bg-[#B5372A]/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#E8A79F]">
            Upload failed
          </p>
          <p className="mt-1 text-xs leading-relaxed text-stone-300">
            {uploadError}
          </p>
        </div>
      )}

      {canRealPublish ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => void handleRealPublish()}
            disabled={busy}
            className="gold-btn inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CloudUpload className="h-4 w-4" />
            )}
            {uploadState === "uploading"
              ? "Uploading…"
              : uploadState === "saving"
                ? "Saving details…"
                : uploadState === "error"
                  ? "Retry publish"
                  : "Publish to ROOTLINE"}
          </button>
          <p className="text-center text-xs text-stone-500">
            Signed in as {user?.email} — uploads to your creator folder and
            appears first in Watch.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPublished(true)}
          className="gold-btn w-full rounded-sm px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5"
        >
          Publish demo video
        </button>
      )}
    </div>
  );
}
