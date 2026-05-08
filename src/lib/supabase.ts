import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export interface LeaderboardUser {
  phone: string;
  name: string | null;
  wallet: number;
  bank: number;
  xp: number;
  level: number;
  gems: number;
  streak: number;
  premium: boolean;
}

export async function fetchLeaderboard(
  limit = 20
): Promise<LeaderboardUser[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("users")
      .select("phone, name, wallet, bank, xp, level, gems, streak, premium")
      .eq("banned", false)
      .order("xp", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as LeaderboardUser[];
  } catch {
    return [];
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey);
}
