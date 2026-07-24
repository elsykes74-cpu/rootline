import { DECLARATIONS } from "./data";

export interface RightsState {
  declarations: Record<string, boolean>;
  advisory: string;
}

interface StepRightsProps {
  rights: RightsState;
  onChange: (rights: RightsState) => void;
}

export default function StepRights({ rights, onChange }: StepRightsProps) {
  const toggle = (id: string) =>
    onChange({
      ...rights,
      declarations: {
        ...rights.declarations,
        [id]: !rights.declarations[id],
      },
    });

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-stone-400">
        Declarations are how creators stand on their word. Each one is attached
        to this package and becomes part of its review record.
      </p>

      <ul className="space-y-3">
        {DECLARATIONS.map((d) => {
          const checked = Boolean(rights.declarations[d.id]);
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => toggle(d.id)}
                aria-pressed={checked}
                className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                  checked
                    ? "border-[#D4A437]/50 bg-[#D4A437]/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-300 ${
                    checked
                      ? "border-[#D4A437] bg-[#D4A437] text-[#0A0908]"
                      : "border-white/25 text-transparent"
                  }`}
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 6.5 4.8 9 10 3" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#F5EFE6]">
                    {d.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-stone-400">
                    {d.hint}
                  </span>
                  <span
                    className={`mt-1.5 block text-[11px] font-medium uppercase tracking-wider transition-colors duration-300 ${
                      checked ? "text-[#D4A437]" : "text-stone-500"
                    }`}
                  >
                    Declared for this demo package
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div>
        <label
          htmlFor="studio-advisory"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-400"
        >
          Cultural / context advisory
        </label>
        <textarea
          id="studio-advisory"
          rows={3}
          value={rights.advisory}
          onChange={(e) => onChange({ ...rights, advisory: e.target.value })}
          placeholder="Add context for a human reviewer when needed."
          className="w-full resize-none rounded-lg border border-white/15 bg-[#141210] px-4 py-2.5 text-sm text-[#F5EFE6] placeholder:text-stone-500 outline-none transition-colors duration-300 focus:border-[#D4A437]"
        />
      </div>
    </div>
  );
}
