import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseEnabled, supabase } from "./supabase";

/**
 * ROOTLINE — Supabase auth context.
 *
 * This is the account used for real creator uploads (Storage + public.videos).
 * It lives alongside the local demo AuthContext (Founding 50 / Boardroom),
 * which is untouched. When Supabase env is missing, every method degrades
 * gracefully and `user` stays null.
 */

export type SignUpOutcome = "session" | "confirm-email";

export interface SupabaseAuthValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpOutcome>;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthValue | null>(null);

function notConfiguredError(): Error {
  return new Error(
    "Creator accounts are not configured in this build. Showcase mode only.",
  );
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseEnabled);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw notConfiguredError();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string): Promise<SignUpOutcome> => {
      if (!supabase) throw notConfiguredError();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw new Error(error.message);
      // No session means the project requires email confirmation first.
      return data.session ? "session" : "confirm-email";
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<SupabaseAuthValue>(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth(): SupabaseAuthValue {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx)
    throw new Error("useSupabaseAuth must be used inside <SupabaseAuthProvider>");
  return ctx;
}
