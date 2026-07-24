import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  FileSignature,
  Flag,
  HeartHandshake,
  MonitorPlay,
  ReceiptText,
  Scale,
  ShieldCheck,
  ShieldX,
  Users,
} from "lucide-react";

type Lane = {
  name: string;
  share: string;
  blurb: string;
  icon: typeof MonitorPlay;
};

const LANES: Lane[] = [
  {
    name: "Premium Ads",
    share: "70%",
    blurb: "Brand campaigns placed beside your work — you keep the majority of every placement.",
    icon: MonitorPlay,
  },
  {
    name: "Members",
    share: "90%",
    blurb: "Monthly supporters pay you directly. The platform takes a sliver, not a slice.",
    icon: Users,
  },
  {
    name: "Licensing Desk",
    share: "85%",
    blurb: "Films, music, and footage licensed to studios and brands with your name on the deal.",
    icon: FileSignature,
  },
  {
    name: "Direct Support",
    share: "90%",
    blurb: "Tips, drops, and one-time love from the community — nearly all of it lands with you.",
    icon: HeartHandshake,
  },
];

const OLD_WAY = [
  "Black-box demonetization with no explanation",
  "No appeal, no human to talk to",
  "The platform takes a 45% cut",
];

const THE_LINE = [
  "Receipts on every decision, every time",
  "Human review with cultural context",
  "Up to 90% of revenue to the creator",
];

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function ReviewExampleCard() {
  const [open, setOpen] = useState<"receipt" | "appeal" | null>(null);

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Held in review
          </p>
          <p className="mt-2 font-display text-4xl text-[#F5EFE6]">$3,420</p>
          <p className="mt-2 text-xs leading-relaxed text-stone-400">
            From &ldquo;Jollof Wars: The Definitive Episode&rdquo; &mdash;
            Chef Ola, Direct Support + Premium Ads
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[#D4A437]/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#D4A437]">
          Under review
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => setOpen((prev) => (prev === "receipt" ? null : "receipt"))}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#D4A437] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-black transition-colors hover:bg-[#E4B94F]"
        >
          <ReceiptText className="h-3.5 w-3.5" aria-hidden="true" />
          {open === "receipt" ? "Close receipt" : "Open receipt"}
        </button>
        <button
          type="button"
          onClick={() => setOpen((prev) => (prev === "appeal" ? null : "appeal"))}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#F5EFE6] transition-colors hover:border-[#D4A437]/60 hover:text-[#D4A437]"
        >
          <Scale className="h-3.5 w-3.5" aria-hidden="true" />
          {open === "appeal" ? "Close appeal" : "Submit appeal"}
        </button>
      </div>

      {open !== null && (
        <div className="mt-5 rounded-lg border border-[#D4A437]/20 bg-[#0A0908]/80 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4A437]">
              {open === "receipt" ? "Sample receipt" : "Appeal filed \u2014 sample receipt"}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1E6B4F]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4CB88A]">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Released
            </span>
          </div>
          <dl className="mt-3 space-y-2.5 text-xs leading-relaxed">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 uppercase tracking-wider text-stone-500">Date</dt>
              <dd className="text-[#F5EFE6]/90">March 14 &mdash; 10:42 AM</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 uppercase tracking-wider text-stone-500">Reason</dt>
              <dd className="text-[#F5EFE6]/90">
                Automated flag on sampled audio in the opening sequence
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 uppercase tracking-wider text-stone-500">Reviewer</dt>
              <dd className="text-[#F5EFE6]/90">
                &ldquo;Flagged for sampled audio &mdash; verified license on file.
                Released.&rdquo;
              </dd>
            </div>
          </dl>
          {open === "appeal" && (
            <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-stone-400">
              Your appeal is attached to this receipt. A second human reviewer
              responds within 48 hours &mdash; and the full paper trail stays
              visible to you the whole time.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CreatorFund() {
  const header = useInView<HTMLDivElement>(0.2);
  const lanes = useInView<HTMLDivElement>(0.1);
  const panel = useInView<HTMLDivElement>(0.1);
  const compare = useInView<HTMLDivElement>(0.1);

  return (
    <section id="fund" className="bg-[#120E0A] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={header.ref}
          className={`transition-all duration-700 ease-out ${
            header.inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4A437]">
            The Creator Fund
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-[#F5EFE6] sm:text-5xl lg:text-6xl">
            The Bag, <em className="italic text-[#D4A437]">Transparent.</em>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-400">
            A plain look at how creators get paid here. Sample numbers, real
            math.
          </p>
        </div>

        <div
          ref={lanes.ref}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {LANES.map((lane, index) => {
            const Icon = lane.icon;
            return (
              <div
                key={lane.name}
                style={{ transitionDelay: `${index * 90}ms` }}
                className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-700 ease-out hover:-translate-y-1.5 hover:border-[#D4A437]/40 ${
                  lanes.inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#D4A437]/30 bg-[#D4A437]/10">
                  <Icon className="h-5 w-5 text-[#D4A437]" aria-hidden="true" />
                </div>
                <p className="mt-5 font-display text-5xl text-[#D4A437]">{lane.share}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE6]">
                  {lane.name} &mdash; to the creator
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{lane.blurb}</p>
              </div>
            );
          })}
        </div>

        <div
          ref={panel.ref}
          className={`mt-20 rounded-2xl border border-[#D4A437]/25 bg-[#0A0908]/60 p-8 transition-all duration-700 ease-out sm:p-10 ${
            panel.inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <h3 className="font-display text-3xl leading-tight tracking-tight text-[#F5EFE6] sm:text-4xl">
                AI flags concerns. Humans review with evidence.{" "}
                <em className="italic text-[#D4A437]">Creators get receipts.</em>
              </h3>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4A437]/40 bg-[#D4A437]/10">
                      <Flag className="h-4 w-4 text-[#D4A437]" aria-hidden="true" />
                    </span>
                    <span className="font-display text-lg italic text-[#D4A437]">01</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[#F5EFE6]">
                    Flag
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-400">
                    AI marks a concern &mdash; never a verdict.
                  </p>
                </div>

                <div className="sm:border-l sm:border-white/10 sm:pl-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4A437]/40 bg-[#D4A437]/10">
                      <Scale className="h-4 w-4 text-[#D4A437]" aria-hidden="true" />
                    </span>
                    <span className="font-display text-lg italic text-[#D4A437]">02</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[#F5EFE6]">
                    Evidence
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-400">
                    A human reviews with context &mdash; cultural context counts.
                  </p>
                </div>

                <div className="sm:border-l sm:border-white/10 sm:pl-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4A437]/40 bg-[#D4A437]/10">
                      <ReceiptText className="h-4 w-4 text-[#D4A437]" aria-hidden="true" />
                    </span>
                    <span className="font-display text-lg italic text-[#D4A437]">03</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[#F5EFE6]">
                    Receipt
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-400">
                    The creator sees exactly what was decided and why &mdash; and
                    can appeal.
                  </p>
                </div>
              </div>
            </div>

            <ReviewExampleCard />
          </div>
        </div>

        <div
          ref={compare.ref}
          className={`mt-20 transition-all duration-700 ease-out ${
            compare.inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            The Old Way <span className="mx-2 text-[#D4A437]">vs</span> The Line
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#B5372A]/30 bg-[#B5372A]/5 p-7">
              <div className="flex items-center gap-3">
                <ShieldX className="h-5 w-5 text-[#B5372A]" aria-hidden="true" />
                <h4 className="font-display text-2xl text-stone-400">The Old Way</h4>
              </div>
              <ul className="mt-5 space-y-3">
                {OLD_WAY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-stone-500">
                    <span className="mt-2 h-1 w-4 shrink-0 bg-[#B5372A]/50" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#D4A437]/40 bg-[#D4A437]/5 p-7">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#D4A437]" aria-hidden="true" />
                <h4 className="font-display text-2xl text-[#F5EFE6]">
                  The <em className="italic text-[#D4A437]">Line</em>
                </h4>
              </div>
              <ul className="mt-5 space-y-3">
                {THE_LINE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#F5EFE6]/90">
                    <span className="mt-2 h-1 w-4 shrink-0 bg-[#D4A437]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
