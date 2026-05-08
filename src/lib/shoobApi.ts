const API_BASE = (import.meta.env.VITE_SHOOB_API_URL ?? "").replace(/\/+$/, "");

export interface ShoobCard {
  id: string;
  name: string;
  series: string;
  tier: string;
  rarity: string;
  imageUrl: string;
  thumbnailUrl: string;
  totalIssues?: number;
}

export const SHOOB_TIER_MAP: Record<
  string,
  { display: string; label: string; color: string; glow: string; gradient: string; ring: string }
> = {
  T1: { display: "N",   label: "Common",    color: "#6b7280", glow: "rgba(107,114,128,0.35)", gradient: "from-gray-700 to-gray-900",     ring: "#374151" },
  T2: { display: "R",   label: "Uncommon",  color: "#38bdf8", glow: "rgba(56,189,248,0.4)",   gradient: "from-sky-700 to-blue-900",     ring: "#0ea5e9" },
  T3: { display: "R",   label: "Rare",      color: "#38bdf8", glow: "rgba(56,189,248,0.4)",   gradient: "from-sky-700 to-blue-900",     ring: "#0ea5e9" },
  T4: { display: "SR",  label: "Epic",      color: "#a78bfa", glow: "rgba(167,139,250,0.45)", gradient: "from-violet-700 to-indigo-900", ring: "#7c3aed" },
  T5: { display: "SSR", label: "Legendary", color: "#fbbf24", glow: "rgba(251,191,36,0.5)",   gradient: "from-amber-600 to-yellow-900", ring: "#f59e0b" },
  T6: { display: "SSR", label: "Mythic",    color: "#fbbf24", glow: "rgba(251,191,36,0.5)",   gradient: "from-amber-600 to-yellow-900", ring: "#f59e0b" },
  TS: { display: "UR",  label: "Shadow",    color: "#ef4444", glow: "rgba(239,68,68,0.6)",    gradient: "from-red-700 to-rose-900",     ring: "#ef4444" },
  TZ: { display: "UR",  label: "Void",      color: "#c084fc", glow: "rgba(192,132,252,0.6)",  gradient: "from-purple-800 to-indigo-950", ring: "#a855f7" },
};

const RARITY_TIER_POOLS: Record<string, string[]> = {
  UR:  ["TS", "TZ"],
  SSR: ["T5", "T6"],
  SR:  ["T4"],
  R:   ["T3", "T2"],
  N:   ["T1"],
};

export function isApiConfigured(): boolean {
  return !!API_BASE;
}

async function apiFetch(path: string): Promise<ShoobCard | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchRandomCard(tier?: string): Promise<ShoobCard | null> {
  if (!API_BASE) return null;
  return apiFetch(`/api/cards/random${tier ? `?tier=${encodeURIComponent(tier)}` : ""}`);
}

export async function fetchCardByRarity(
  rarity: "UR" | "SSR" | "SR" | "R" | "N"
): Promise<ShoobCard | null> {
  if (!API_BASE) return null;
  const pool = RARITY_TIER_POOLS[rarity] ?? ["T1"];
  const tier = pool[Math.floor(Math.random() * pool.length)];
  return fetchRandomCard(tier);
}
