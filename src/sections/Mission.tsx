import { KeyRound, Receipt, Users } from "lucide-react";
import Timeline, { type TimelineNode } from "@/components/Timeline";
import { useEffect, useRef, useState, type ReactNode } from "react";

const VALUES = [
  {
    icon: KeyRound,
    title: "Ownership",
    body: "Creators keep their masters, their audience, and their data. What's yours stays yours — we just give it a stage.",
  },
  {
    icon: Receipt,
    title: "Transparency",
    body: "Every decision that touches your money comes with a receipt. No black boxes, no fine print, no funny math.",
  },
  {
    icon: Users,
    title: "Lineage",
    body: "We honor the elders and the innovators on the same stage — jazz to trap, gospel to Afrobeats, one unbroken line.",
  },
];

const TIMELINE: TimelineNode[] = [
  {
    year: "1920s",
    title: "The Jazz Age",
    line: "The sound that started it all.",
    image: "/images/thumb-jazz.png",
    alt: "A jazz band performing in a smoky 1920s club",
  },
  {
    year: "1930s–50s",
    title: "Gospel & the Church",
    line: "Where the voices were raised.",
    image: "/images/thumb-gospel.png",
    alt: "A gospel choir singing in a sunlit church",
  },
  {
    year: "1960s–70s",
    title: "Soul, Funk & the Porch",
    line: "Stories, struggle, and Saturday night.",
    image: "/images/thumb-roots.png",
    alt: "Family and neighbors gathered on a porch with a record player",
  },
  {
    year: "1973",
    title: "Hip Hop Is Born",
    line: "1520 Sedgwick Avenue, the Bronx.",
    image: "/images/thumb-hiphop.png",
    alt: "A Bronx block party with turntables and a crowd",
  },
  {
    year: "1990s–2000s",
    title: "The Golden Era to the Blog Era",
    line: "The culture goes global.",
    image: "/images/thumb-culture.png",
    alt: "A wall of vinyl records and mixtapes spanning decades",
  },
  {
    year: "2010s",
    title: "Afrobeats & the Diaspora Link",
    line: "Lagos, London, Brooklyn — one rhythm.",
    image: "/images/thumb-afrobeats.png",
    alt: "A vibrant Afrobeats concert crowd lit in gold and green",
  },
  {
    year: "TODAY",
    title: "ROOTLINE",
    line: "The culture owns the stage.",
    image: "/images/hero.png",
    alt: "A filmmaker on a rooftop at golden hour, camera in hand",
  },
];

/** Simple scroll-reveal wrapper for the manifesto blocks. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Mission() {
  return (
    <section id="mission" className="relative bg-[#0A0908] py-32 text-[#F5EFE6]">
      {/* Thin kente divider at the very top of the section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#D4A437_0%,#D4A437_33%,#B5372A_33%,#B5372A_66%,#1E6B4F_66%,#1E6B4F_100%)]"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* ---------- PART 1: MANIFESTO ---------- */}
        <Reveal>
          <p className="gold-text text-xs font-semibold uppercase tracking-[0.3em]">
            Why Rootline Exists
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-display mt-8 max-w-5xl text-4xl leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            They built empires on our culture{" "}
            <em className="gold-text italic">and paid us in exposure.</em>
            <br />
            <span className="text-stone-300">ROOTLINE flips the deal:</span>{" "}
            the people who make the culture{" "}
            <em className="gold-text italic">
              own the platform that profits from it.
            </em>
          </h2>
        </Reveal>

        {/* Value cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 120}>
              <div className="group h-full rounded-lg border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4A437]/40 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A437]/40 bg-[#D4A437]/10 text-[#D4A437] transition-colors duration-500 group-hover:bg-[#D4A437] group-hover:text-[#0A0908]">
                  <value.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display mt-6 text-2xl tracking-tight text-[#F5EFE6]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ---------- PART 2: TIMELINE ---------- */}
        <div className="mt-32">
          <Reveal className="text-center">
            <p className="gold-text text-xs font-semibold uppercase tracking-[0.3em]">
              The Lineage
            </p>
            <h3 className="font-display mx-auto mt-6 max-w-3xl text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              From the Roots{" "}
              <em className="gold-text italic">to Right Now</em>
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-400">
              Every era fed the next. We didn't arrive — we've been here. This
              is the line we stand on.
            </p>
          </Reveal>

          <div className="mt-20">
            <Timeline nodes={TIMELINE} />
          </div>
        </div>

        {/* ---------- PART 3: CLOSING CTA BAND ---------- */}
        <Reveal className="mt-32">
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            {/* Kente stripe */}
            <div
              aria-hidden="true"
              className="h-1.5 bg-[linear-gradient(90deg,#D4A437_0%,#D4A437_33%,#B5372A_33%,#B5372A_66%,#1E6B4F_66%,#1E6B4F_100%)]"
            />
            <div className="relative bg-white/[0.03] px-8 py-16 text-center sm:px-16">
              <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                The line starts here.{" "}
                <em className="gold-text italic">Get on it.</em>
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-400">
                One platform. Every generation. Owned by the people who built
                the sound.
              </p>
              <a
                href="#studio"
                className="gold-btn mt-10 inline-flex items-center justify-center rounded-sm px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
              >
                Join the Line
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
