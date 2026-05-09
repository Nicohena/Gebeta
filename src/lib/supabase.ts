import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function submitFeedback(data: { item_id: string; rating: number; comment?: string; customer_name?: string }) {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, skipping feedback submission");
    return { error: null }; // Mock success for local dev without Supabase
  }

  const supabase = createClient();
  const { error } = await supabase.from('feedback').insert([data]);
  return { error };
}
