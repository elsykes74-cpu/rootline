import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const CHANNEL_LINKS = [
  { label: "Film Room", href: "#watch" },
  { label: "Afrobeats", href: "#watch" },
  { label: "Hip Hop", href: "#hiphop" },
  { label: "HBCU Sports", href: "#watch" },
  { label: "Black Tech", href: "#watch" },
];

const CREATOR_LINKS = [
  { label: "Open the Studio", href: "#studio" },
  { label: "The Creator Fund", href: "#fund" },
  { label: "Payout Receipts", href: "#fund" },
  { label: "Creator Guidelines", href: "#creators" },
  { label: "Go Live", href: "#live" },
];

const PROMISE_ITEMS = [
  "100% of creator receipts, shown plain",
  "Fair review before any payout hold",
  "No shadowbans, no mystery algorithms",
  "Owned by us. Built different.",
];

export default function Footer() {
  const heading = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();
  const bottom = useReveal<HTMLDivElement>();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 0) setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#0A0908]">
      {/* Newsletter band */}
      <div
        ref={heading.ref}
        className={`reveal ${heading.visible ? "reveal-visible" : ""} border-t border-white/10`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4A437]">
              Stay on the Line
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#F5EFE6] sm:text-4xl">
              New drops, new creators,{" "}
              <em className="italic text-[#D4A437]">straight to you.</em>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              One letter a week. No noise, no selling your data — just the
              culture, first.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="h-12 flex-1 border border-white/20 bg-transparent px-4 text-sm text-[#F5EFE6] placeholder:text-stone-500 focus:border-[#D4A437] focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 bg-[#D4A437] px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:bg-[#E5BB54]"
            >
              {subscribed ? (
                <>
                  On the Line <Check size={14} aria-hidden="true" />
                </>
              ) : (
                <>
                  Sign Up <ArrowRight size={14} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div
        ref={grid.ref}
        className={`reveal ${grid.visible ? "reveal-visible" : ""} border-t border-white/10`}
        style={{ transitionDelay: "0.1s" }}
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
          {/* About / manifesto */}
          <div>
            <a href="#top" className="flex items-center gap-3" aria-label="ROOTLINE home">
              <span className="flex h-9 w-9 items-center justify-center border border-[#D4A437]">
                <span className="font-display text-lg italic text-[#D4A437]">R</span>
              </span>
              <span className="font-display text-base font-bold tracking-[0.25em] text-[#F5EFE6]">
                ROOTLINE
              </span>
            </a>
            <p className="mt-6 text-sm leading-relaxed text-stone-400">
              A creator network owned by the culture it carries. From the juke
              joint to the group chat, every view, every dollar, every receipt
              stays in the family.
            </p>
          </div>

          {/* Channels */}
          <nav aria-label="Channels">
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#D4A437]">
              Channels
            </h3>
            <ul className="mt-6 space-y-3">
              {CHANNEL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-[#F5EFE6]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Creator */}
          <nav aria-label="Creator">
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#D4A437]">
              Creator
            </h3>
            <ul className="mt-6 space-y-3">
              {CREATOR_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-[#F5EFE6]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The Promise */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#D4A437]">
              The Promise
            </h3>
            <ul className="mt-6 space-y-3">
              {PROMISE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 text-[#D4A437]" aria-hidden="true">
                    ✦
                  </span>
                  <span className="text-sm leading-relaxed text-stone-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div
        ref={bottom.ref}
        className={`reveal ${bottom.visible ? "reveal-visible" : ""}`}
        style={{ transitionDelay: "0.15s" }}
      >
        <div className="kente-stripe h-1 w-full" aria-hidden="true" />
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
            © 2026 ROOTLINE · Built different. Owned by us.
          </p>
          <p className="text-xs tracking-wide text-stone-600">
            Concept demo — sample data
          </p>
        </div>
      </div>
    </footer>
  );
}
