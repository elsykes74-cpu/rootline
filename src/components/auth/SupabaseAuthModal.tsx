import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSupabaseAuth } from "@/lib/auth";

export type SupabaseAuthMode = "signin" | "signup";

interface SupabaseAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: SupabaseAuthMode;
}

/**
 * Supabase-backed auth modal — the account that gates real Studio uploads.
 * Visual language mirrors the existing demo AuthModal (bg #0A0908, text
 * #F5EFE6, accent #D4A437, kente stripe).
 */
export default function SupabaseAuthModal({
  open,
  onOpenChange,
  initialMode = "signin",
}: SupabaseAuthModalProps) {
  const { signIn, signUp } = useSupabaseAuth();
  const [mode, setMode] = useState<SupabaseAuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setNotice(null);
      setBusy(false);
    }
  }, [open, initialMode]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("That email doesn’t look right.");
      return;
    }
    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        onOpenChange(false);
        resetForm();
      } else {
        const outcome = await signUp(email, password);
        if (outcome === "session") {
          onOpenChange(false);
          resetForm();
        } else {
          // Email confirmation required — keep the modal open on sign-in.
          setNotice(
            "Account created. Confirm the email we just sent you, then sign in.",
          );
          setMode("signin");
          setPassword("");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-[#F5EFE6] placeholder:text-stone-500 outline-none transition-colors focus:border-[#D4A437]/70 focus:bg-white/[0.06]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-white/10 bg-[#0A0908] p-0 text-[#F5EFE6] sm:max-w-md">
        <div className="relative px-8 py-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B5372A] via-[#D4A437] to-[#1E6B4F]"
          />
          <DialogHeader>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A437]">
              {mode === "signup" ? "Creator account" : "Welcome back"}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl text-[#F5EFE6]">
              {mode === "signup"
                ? "Create your account."
                : "Sign in to publish."}
            </DialogTitle>
            <DialogDescription className="pt-1 text-stone-400">
              {mode === "signup"
                ? "One account uploads your work straight to the ROOTLINE lineup."
                : "Sign in with the account you publish with."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={inputClass}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              className={inputClass}
            />

            {error && (
              <p className="border border-[#B5372A]/40 bg-[#B5372A]/10 px-4 py-2.5 text-xs text-[#E8A79F]">
                {error}
              </p>
            )}
            {notice && (
              <p className="border border-[#1E6B4F]/50 bg-[#1E6B4F]/10 px-4 py-2.5 text-xs text-[#9FD6BC]">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#D4A437] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0908] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5BB54] disabled:opacity-60"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
              setNotice(null);
            }}
            className="mt-5 w-full text-center text-xs text-stone-500 transition-colors hover:text-[#D4A437]"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
