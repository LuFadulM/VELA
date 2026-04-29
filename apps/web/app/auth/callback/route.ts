import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase OAuth callback. After the provider redirects back here with
 * `?code=…`, we exchange the code for a session (which writes the
 * cookie via the server client) and then forward the user to wherever
 * they were trying to go (defaults to /dashboard).
 *
 * If Supabase isn't configured the user shouldn't have hit this URL,
 * but we send them home rather than 500-ing.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/signin?error=missing_code`);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/signin?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
