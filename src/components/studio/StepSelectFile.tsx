import { useRef, useState } from "react";
import { Check, FileVideo, UploadCloud } from "lucide-react";
import { DEMO_PACKAGES, type DemoPackage } from "./data";

export type Source =
  | { kind: "file"; name: string; size: string; file: File }
  | { kind: "demo"; pkg: DemoPackage };

interface StepSelectFileProps {
  source: Source | null;
  onSelect: (source: Source) => void;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}

export default function StepSelectFile({ source, onSelect }: StepSelectFileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    onSelect({
      kind: "file",
      name: file.name,
      size: formatBytes(file.size),
      file,
    });
  };

  const selectedDemoId =
    source?.kind === "demo" ? source.pkg.id : null;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-300 ${
          dragOver
            ? "border-[#D4A437] bg-[#D4A437]/10"
            : "border-white/15 bg-white/[0.03]"
        }`}
      >
        <UploadCloud
          className={`mb-3 h-9 w-9 transition-colors duration-300 ${
            dragOver ? "text-[#D4A437]" : "text-stone-400"
          }`}
        />
        <p className="text-sm text-[#F5EFE6]">
          Drag a video file here — it never leaves this session.
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Demo mode: the file is read locally for its name and size only.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-sm border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F5EFE6] transition-colors duration-300 hover:border-[#D4A437] hover:text-[#D4A437]"
        >
          Choose demo file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Selected file card */}
      {source?.kind === "file" && (
        <div className="gold-frame flex items-center gap-4 rounded-xl px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#D4A437]/15 text-[#D4A437]">
            <FileVideo className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#F5EFE6]">
              {source.name}
            </p>
            <p className="text-xs text-stone-400">
              {source.size} · Duration —:— (probe runs in Processing)
            </p>
          </div>
          <Check className="ml-auto h-5 w-5 shrink-0 text-[#D4A437]" />
        </div>
      )}

      {/* Demo packages */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">
          Or start with a one-click demo package
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {DEMO_PACKAGES.map((pkg) => {
            const selected = selectedDemoId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => onSelect({ kind: "demo", pkg })}
                className={`group overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-1 ${
                  selected
                    ? "gold-frame"
                    : "border border-white/10 hover:border-white/25"
                }`}
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={pkg.thumb}
                    alt={`${pkg.title} demo package thumbnail`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/40 to-transparent" />
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A437] text-[#0A0908]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <div className="bg-[#141210] px-4 py-3">
                  <p className="truncate text-sm font-semibold text-[#F5EFE6]">
                    {pkg.fileName}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    {pkg.size} · {pkg.duration}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
