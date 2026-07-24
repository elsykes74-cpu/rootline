import { useEffect, useRef, useState } from "react";
import { Check, Plus, Users } from "lucide-react";

type Creator = {
  name: string;
  handle: string;
  category: string;
  followers: string;
  featured: string;
  badges: string[];
  initial: string;
  ring: string;
};

const CREATORS: Creator[] = [
  {
    name: "Nia Frame",
    handle: "@niaframe",
    category: "Documentary",
    followers: "4.2M",
    featured: "\u201cThe New Black Indie Film Circuit\u201d",
    badges: ["Members", "Licensing Desk", "Direct Support"],
    initial: "N",
    ring: "ring-[#D4A437]/70",
  },
  {
    name: "Kojo Beats",
    handle: "@kojobuilds",
    category: "Music",
    followers: "3.7M",
    featured: "\u201cSample Packs & the Sound of Accra\u201d",
    badges: ["Premium Ads", "Members", "Licensing Desk"],
    initial: "K",
    ring: "ring-[#B5372A]/70",
  },
  {
    name: "Maya Builds",
    handle: "@mayabuilds",
    category: "Tech",
    followers: "2.9M",
    featured: "\u201cI Taught My Grandma to Ship an App\u201d",
    badges: ["Premium Ads", "Members", "Direct Support"],
    initial: "M",
    ring: "ring-[#1E6B4F]/70",
  },
  {
    name: "Chef Ola",
    handle: "@chefola",
    category: "Food",
    followers: "2.1M",
    featured: "\u201cJollof Wars: The Definitive Episode\u201d",
    badges: ["Members", "Direct Support", "Licensing Desk"],
    initial: "O",
    ring: "ring-[#C97C3E]/70",
  },
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

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  const [following, setFollowing] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 90}ms` }}
      className={`group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-700 ease-out hover:-translate-y-2 hover:border-[#D4A437]/40 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_-20px_rgba(212,164,55,0.25)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-[#16110C] ring-2 ring-offset-2 ring-offset-[#0A0908] ${creator.ring}`}
          aria-hidden="true"
        >
          <span className="gold-text font-display text-3xl italic">
            {creator.initial}
          </span>
        </div>
        <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
          {creator.category}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="font-display text-2xl leading-tight text-[#F5EFE6]">
          {creator.name}
        </h3>
        <p className="mt-0.5 text-sm text-stone-400">{creator.handle}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-[#F5EFE6]">
        <Users className="h-4 w-4 text-[#D4A437]" aria-hidden="true" />
        <span className="font-semibold">{creator.followers}</span>
        <span className="text-stone-400">followers</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-stone-400">
        Featured upload:{" "}
        <span className="text-[#F5EFE6]/90">{creator.featured}</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {creator.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-[#D4A437]/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#D4A437]"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => setFollowing((prev) => !prev)}
          aria-pressed={following}
          className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 ${
            following
              ? "border border-[#D4A437]/60 bg-transparent text-[#D4A437]"
              : "gold-btn"
          }`}
        >
          {following ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {following ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default function Creators() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section id="creators" className="bg-[#0A0908] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="gold-text text-xs font-semibold uppercase tracking-[0.3em]">
            The Next Line
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-[#F5EFE6] sm:text-5xl lg:text-6xl">
            Rising Creators,{" "}
            <em className="gold-text italic">Real Ownership</em>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-400">
            They came for the audience. They stayed for the equity. Every
            creator on the Line keeps their masters, their data, and the
            majority of every dollar they earn.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CREATORS.map((creator, index) => (
            <CreatorCard key={creator.handle} creator={creator} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
