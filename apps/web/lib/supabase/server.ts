import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { readPublicEnv } from "./env";

/**
 * Server-side Supabase client. Uses Next's cookie store to read/write
 * the session. Returns `null` when Supabase isn't configured so callers
 * can fall back to mock data without try/catch noise.
 *
 * Pattern lifted from the official @supabase/ssr docs and adapted for
 * the App Router. Cookie writes are wrapped in try/catch because Next
 * occasionally throws when called from a Server Component — the
 * subsequent middleware run will refresh the cookie correctly.
 */
export function createSupabaseServerClient() {
  const env = readPublicEnv();
  if (!env) return null;

  const cookieStore = cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Components can't write cookies; the middleware will.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Same as above.
        }
      },
    },
  });
}

/**
 * Returns the current Supabase user, or null if anonymous / unconfigured.
 * Cheap to call from any Server Component.
 */
export async function getSupabaseUser() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
