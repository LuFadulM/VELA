"use client";
import { createBrowserClient } from "@supabase/ssr";
import { readPublicEnv } from "./env";

let _client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser-side Supabase client (singleton). Returns null when Supabase
 * isn't configured — callers should branch on that to fall back to mock
 * UI flows (e.g. the demo "sign in" that just routes to /dashboard).
 */
export function createSupabaseBrowserClient() {
  if (_client) return _client;
  const env = readPublicEnv();
  if (!env) return null;
  _client = createBrowserClient(env.url, env.anonKey);
  return _client;
}
