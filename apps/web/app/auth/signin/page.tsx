"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createSupabaseBrowserClient();
    // Mock mode — no auth provider; fall through to the demo workspace.
    if (!supabase) {
      router.push(next);
      return;
    }
    setLoading("email");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(null);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function signInWithGoogle() {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      router.push(next);
      return;
    }
    setLoading("google");
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(null);
      setError(error.message);
    }
    // Otherwise the browser redirects to Google.
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-modal border border-navy-200 bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Welcome back</h1>
        <p className="mt-1 text-sm text-navy-500">Sign in to run your day with Vela.</p>

        <form onSubmit={signInWithEmail} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-600">
              Work email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@northwind.co"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-600">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
          )}
          <Button type="submit" className="w-full" loading={loading === "email"}>
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wide text-navy-400">
          <div className="h-px flex-1 bg-navy-200" />
          or
          <div className="h-px flex-1 bg-navy-200" />
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading !== null}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 transition hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {loading === "google" ? "Redirecting…" : "Continue with Google"}
        </button>

        {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            Demo mode — no auth configured. Any submit lands you in the demo workspace.
          </p>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-navy-500">
        New to Vela?{" "}
        <Link href="/auth/signup" className="font-semibold text-indigo-600 hover:underline">
          Start free
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.09-1.93 3.27-4.78 3.27-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.05-3.71 1.05-2.86 0-5.28-1.93-6.14-4.52H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.86 14.11A6.58 6.58 0 0 1 5.5 12c0-.73.13-1.43.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.68-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.14C17.45 2.16 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.68 2.84C6.72 7.3 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
