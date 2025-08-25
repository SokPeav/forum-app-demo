import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  signInWithGitHub: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = () => {
    const redirectTo = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });
  };

  const signInWithGoogle = () => {
    const redirectTo = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };
  const signOut = () => {
    supabase.auth.signOut();
  };

  return {
    user,
    signInWithGitHub,
    signInWithGoogle,
    signOut,
  };
};
