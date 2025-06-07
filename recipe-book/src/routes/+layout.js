// src/routes/+layout.js
import { supabase } from '$lib/supabaseClient';

export async function load() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    user: session?.user ?? null
  };
}
