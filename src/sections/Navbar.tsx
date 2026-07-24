import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal, { type AuthMode } from "@/components/auth/AuthModal";
import SupabaseAuthModal from "@/components/auth/SupabaseAuthModal";
import { useSupabaseAuth } from "@/lib/auth";
import { isSupabaseEnabled } from "@/lib/supabase";

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
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [supaAuthOpen, setSupaAuthOpen] = useState(false);
  const { user, isOwner, logout } = useAuth();
  const { user: supaUser, signOut: supaSignOut } = useSupabaseAuth();
  const navigate = useNavigate();

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMenuOpen(false);
  };

  // After any successful local sign-in/sign-up, land in the backend (/owner
  // renders The Boardroom for owners and MY LINE for creators).
  const handleAuthSuccess = () => {
    setAuthOpen(false);
    navigate("/owner");
  };

  const initials = user
    ? user.name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

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

        {/* Right CTA / auth */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          {/* Supabase creator account — gates real Studio uploads */}
          {isSupabaseEnabled &&
            (supaUser ? (
              <span className="flex items-center gap-4 border-r border-white/10 pr-6">
                <span
                  className="max-w-44 truncate text-xs text-[#F5EFE6]"
                  title={supaUser.email ?? undefined}
                >
                  {supaUser.email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void supaSignOut();
                  }}
                  className="text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors duration-300 hover:text-[#D4A437]"
                >
                  Sign out
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setSupaAuthOpen(true)}
                title="Sign in to publish real uploads from the Creator Studio"
                className="border border-[#D4A437]/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4A437] transition-all duration-300 hover:bg-[#D4A437] hover:text-[#0A0908]"
              >
                Sign in
              </button>
            ))}
          {user ? (
            <div className="flex items-center gap-5">
              {isOwner && (
                <Link
                  to="/owner"
                  className="text-[11px] uppercase tracking-[0.25em] text-stone-300 transition-colors duration-300 hover:text-[#D4A437]"
                >
                  The Boardroom
                </Link>
              )}
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center border border-[#D4A437]/60 bg-[#D4A437]/10 font-display text-xs text-[#D4A437]">
                  {initials}
                </span>
                <span className="max-w-32 truncate text-xs text-[#F5EFE6]">
                  {user.name}
                </span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors duration-300 hover:text-[#D4A437]"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuth("signup")}
              className="inline-block bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54]"
            >
              Join the Line
            </button>
          )}
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
          {/* Supabase creator account row */}
          {isSupabaseEnabled && (
            <li className="border-t border-white/10 pt-4">
              {supaUser ? (
                <div className="flex flex-wrap items-center gap-4">
                  <span className="max-w-52 truncate text-xs text-[#F5EFE6]">
                    {supaUser.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      void supaSignOut();
                      setMenuOpen(false);
                    }}
                    className="text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors hover:text-[#D4A437]"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSupaAuthOpen(true);
                    setMenuOpen(false);
                  }}
                  className="border border-[#D4A437]/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4A437] transition-colors hover:bg-[#D4A437] hover:text-[#0A0908]"
                >
                  Sign in to publish
                </button>
              )}
            </li>
          )}
          {/* Auth row */}
          <li className="border-t border-white/10 pt-4">
            {user ? (
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center border border-[#D4A437]/60 bg-[#D4A437]/10 font-display text-xs text-[#D4A437]">
                    {initials}
                  </span>
                  <span className="text-xs text-[#F5EFE6]">{user.name}</span>
                </span>
                {isOwner && (
                  <Link
                    to="/owner"
                    onClick={() => setMenuOpen(false)}
                    className="text-[11px] uppercase tracking-[0.25em] text-stone-300 transition-colors hover:text-[#D4A437]"
                  >
                    The Boardroom
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors hover:text-[#D4A437]"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="inline-block bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908]"
              >
                Join the Line
              </button>
            )}
          </li>
        </ul>
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
      <SupabaseAuthModal open={supaAuthOpen} onOpenChange={setSupaAuthOpen} />
    </header>
  );
}
