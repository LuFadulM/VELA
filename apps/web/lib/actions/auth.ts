"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Sign the user out of Supabase and bounce them to the marketing site.
 * Mock-mode (no Supabase configured) just redirects — there's nothing
 * to invalidate.
 */
export async function signOutAction() {
  const supabase = createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  }
  redirect("/");
}
