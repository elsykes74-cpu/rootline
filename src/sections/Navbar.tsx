import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Watch", href: "#watch" },
  { label: "Live", href: "#live" },
  { label: "Hip Hop", href: "#hiphop" },
  { label: "Creators", href: "#creators" },
  { label: "Fund", href: "#fund" },
  { label: "Studio", href: "#studio" },
  { label: "Mission", href: "#mission" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-white/10 bg-[#0A0908]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-3" aria-label="ROOTLINE home">
          <span className="flex h-10 w-10 items-center justify-center border border-[#D4A437] bg-[#0A0908]/40 transition-colors group-hover:bg-[#D4A437]/10">
            <span className="font-display text-xl italic text-[#D4A437]">R</span>
          </span>
          <span className="font-display text-lg font-bold tracking-[0.25em] text-[#F5EFE6]">
            ROOTLINE
          </span>
        </a>

        {/* Center links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors duration-300 hover:text-[#D4A437]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA */}
        <div className="hidden lg:block">
          <a
            href="#fund"
            className="inline-block bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
          >
            Join the Line
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="text-[#F5EFE6] transition-colors hover:text-[#D4A437] lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out lg:hidden ${
          menuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 border-t border-white/10 bg-[#0A0908]/95 px-6 py-6 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm uppercase tracking-[0.25em] text-stone-300 transition-colors hover:text-[#D4A437]"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <a
              href="#fund"
              onClick={() => setMenuOpen(false)}
              className="inline-block bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908]"
            >
              Join the Line
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
