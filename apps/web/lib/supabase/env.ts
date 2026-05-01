/**
 * Supabase env helpers. We treat missing keys as "mock mode" — the app
 * still runs end-to-end without Supabase configured, which keeps the
 * local dev experience zero-setup and lets the marketing site ship
 * before the user has provisioned a project.
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function readPublicEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return readPublicEnv() !== null;
}
