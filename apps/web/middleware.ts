import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Edge middleware. Two responsibilities:
 *
 * 1. Refresh the Supabase session cookie on every request so server
 *    components see a fresh user.
 * 2. Gate /dashboard/* behind authentication once Supabase is wired
 *    up. When NEXT_PUBLIC_SUPABASE_URL is missing we let everything
 *    through so the demo workspace remains explorable without an
 *    account (matches the rest of the mock-mode contract).
 */
export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Mock-mode: no auth provider configured, allow everything through.
  if (!url || !anonKey) return NextResponse.next();

  let response = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        req.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: req.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        req.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: req.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Refresh the session.
  const { data } = await supabase.auth.getUser();

  // Gate dashboard.
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !data.user) {
    const signin = new URL("/auth/signin", req.url);
    signin.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(signin);
  }

  return response;
}

export const config = {
  // Skip static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
