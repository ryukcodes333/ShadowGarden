import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Zap, TrendingUp, Award, Flame, Wifi, WifiOff } from "lucide-react";
import { globalRankings } from "@/data/shadowData";
import { fetchLeaderboard, isSupabaseConfigured, type LeaderboardUser } from "@/lib/supabase";

const TIER_STYLE: Record<string, { color: string; bg: string; glow: string }> = {
  OMEGA:     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",     glow: "rgba(239,68,68,0.3)"  },
  SHADOW:    { color: "#a78bfa", bg: "rgba(167,139,250,0.12)",   glow: "rgba(167,139,250,0.25)" },
  SHADE:     { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",    glow: "rgba(56,189,248,0.2)" },
  OPERATIVE: { color: "#10b981", bg: "rgba(16,185,129,0.12)",    glow: "rgba(16,185,129,0.2)" },
  AGENT:     { color: "#6b7280", bg: "rgba(107,114,128,0.1)",    glow: "rgba(107,114,128,0.1)" },
};

const MEDALS: Record<number, { color: string; emoji: string }> = {
  1: { color: "#fbbf24", emoji: "🥇" },
  2: { color: "#c5cfd8", emoji: "🥈" },
  3: { color: "#ef4444", emoji: "🥉" },
};

const BADGE_COLORS = ["#f59e0b","#a8b5c4","#ef4444","#38bdf8","#00d17a","#a78bfa","#06b6d4","#f97316","#84cc16","#e879f9"];

function getTier(rank: number) {
  if (rank <= 3) return "OMEGA";
  if (rank <= 10) return "SHADOW";
  if (rank <= 50) return "SHADE";
  if (rank <= 100) return "OPERATIVE";
  return "AGENT";
}

function mapUser(u: LeaderboardUser, rank: number) {
  const score = (u.wallet || 0) + (u.bank || 0);
  const displayName = u.name?.trim() || `User ···${u.phone.slice(-4)}`;
  return {
    rank,
    username: displayName,
    score,
    cards: u.level ? u.level * 12 + Math.floor((u.xp || 0) / 500) : 0,
    missions: Math.floor((u.xp || 0) / 200),
    tier: getTier(rank),
    badge: BADGE_COLORS[(rank - 1) % BADGE_COLORS.length],
    streak: u.streak || 0,
    premium: u.premium,
    level: u.level || 1,
    xp: u.xp || 0,
  };
}

export default function Rankings() {
  const [hovered, setHovered] = useState<number | null>(null);

  const supabaseEnabled = isSupabaseConfigured();

  const { data: liveUsers, isLoading, isError } = useQuery({
    queryKey: ["leaderboard-live"],
    queryFn: () => fetchLeaderboard(20),
    enabled: supabaseEnabled,
    staleTime: 60_000,
    retry: 2,
  });

  const useLive = supabaseEnabled && !isLoading && !isError && liveUsers && liveUsers.length > 0;
  const leaderboard = useLive
    ? liveUsers.map((u, i) => mapUser(u, i + 1))
    : globalRankings;

  const topThree = [leaderboard[1], leaderboard[0], leaderboard[2]];

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1200px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Performance Index</p>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-black text-4xl md:text-5xl text-white">Global Rankings</h1>
          {supabaseEnabled && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
              style={{
                background: useLive ? "rgba(16,185,129,0.12)" : "rgba(107,114,128,0.12)",
                border: `1px solid ${useLive ? "rgba(16,185,129,0.3)" : "rgba(107,114,128,0.3)"}`,
                color: useLive ? "#10b981" : "#6b7280",
              }}>
              {useLive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isLoading ? "SYNCING…" : useLive ? "LIVE DATA" : "OFFLINE"}
            </div>
          )}
        </div>
        <p className="text-white/40 text-sm mt-1 font-sans">
          {useLive ? "Real-time bot leaderboard — updated live from the database." : "Shadow Garden operative performance leaderboard."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {topThree.map((entry, podI) => {
          if (!entry) return null;
          const isFirst = podI === 1;
          const tier = TIER_STYLE[entry.tier];
          const medal = MEDALS[entry.rank];
          return (
            <motion.div key={entry.rank}
              initial={{ opacity: 0, y: 30, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: podI * 0.12, type: "spring", stiffness: 200 }}
              className={`relative rounded-3xl p-6 overflow-hidden ${isFirst ? "md:order-2 md:-mt-4" : podI === 0 ? "md:order-1" : "md:order-3"}`}
              style={{
                background: "linear-gradient(160deg, rgba(20,15,45,0.9), rgba(10,8,22,0.95))",
                border: `2px solid ${medal.color}40`,
                boxShadow: `0 0 40px ${medal.color}20, 0 20px 40px rgba(0,0,0,0.5)`,
              }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${medal.color}10, transparent 60%)` }} />
              {isFirst && (
                <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Award className="w-8 h-8" style={{ color: medal.color, filter: `drop-shadow(0 0 8px ${medal.color})` }} />
                </motion.div>
              )}
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl font-display font-black" style={{ color: medal.color, textShadow: `0 0 20px ${medal.color}` }}>#{entry.rank}</span>
                <span className="tag" style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.color}30` }}>{entry.tier}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-display font-black"
                  style={{ background: `${entry.badge}20`, border: `1px solid ${entry.badge}40`, color: entry.badge }}>
                  {entry.username[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-display font-black text-lg text-white leading-tight">{entry.username}</p>
                  <p className="text-xs text-white/35 font-sans">
                    {(entry as any).premium ? "👑 Premium Operative" : "Shadow Operative"}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white/35">BALANCE</span>
                  <span className="text-white font-bold">${entry.score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">CARDS</span>
                  <span style={{ color: medal.color }}>{entry.cards.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">STREAK</span>
                  <span className="text-orange-400">{entry.streak}d 🔥</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
        <div className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-white/5 text-xs font-mono text-white/25 tracking-widest">
          <span className="col-span-1">RANK</span>
          <span className="col-span-4">OPERATIVE</span>
          <span className="col-span-2">TIER</span>
          <span className="col-span-2">BALANCE</span>
          <span className="col-span-1 hidden md:block">CARDS</span>
          <span className="col-span-1 hidden md:block">XP/MISS</span>
          <span className="col-span-1 hidden md:block">STREAK</span>
        </div>
        {isLoading && supabaseEnabled ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <motion.div className="w-2 h-2 rounded-full bg-violet-400" animate={{ scale: [1,1.5,1] }} transition={{ duration: 0.8, repeat: Infinity }} />
            <motion.div className="w-2 h-2 rounded-full bg-violet-400" animate={{ scale: [1,1.5,1] }} transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }} />
            <motion.div className="w-2 h-2 rounded-full bg-violet-400" animate={{ scale: [1,1.5,1] }} transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }} />
            <span className="text-white/30 text-sm font-mono ml-2">SYNCING LIVE DATA…</span>
          </div>
        ) : (
          leaderboard.map((entry, i) => {
            const tier = TIER_STYLE[entry.tier];
            const medal = MEDALS[entry.rank];
            return (
              <motion.div key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                onMouseEnter={() => setHovered(entry.rank)}
                onMouseLeave={() => setHovered(null)}
                className="grid grid-cols-12 gap-2 px-6 py-3.5 border-b border-white/5 relative transition-colors cursor-default"
                style={{ background: hovered === entry.rank ? "rgba(124,58,237,0.06)" : "transparent" }}>
                {hovered === entry.rank && <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r" style={{ background: tier.color }} />}

                <div className="col-span-1 flex items-center">
                  {medal ? (
                    <span className="text-base">{medal.emoji}</span>
                  ) : (
                    <span className="font-display font-bold text-sm text-white/40">#{entry.rank}</span>
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-display font-black flex-shrink-0"
                    style={{ background: `${entry.badge}18`, color: entry.badge, border: `1px solid ${entry.badge}30` }}>
                    {entry.username[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-display font-bold text-sm text-white truncate block">{entry.username}</span>
                    {(entry as any).premium && <span className="text-[9px] text-yellow-400/70 font-mono">👑 PREMIUM</span>}
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="tag text-[10px]" style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.color}25` }}>{entry.tier}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="font-display font-bold text-sm text-white">${entry.score.toLocaleString()}</span>
                </div>
                <div className="col-span-1 hidden md:flex items-center">
                  <span className="text-sm text-white/45 font-mono">{entry.cards}</span>
                </div>
                <div className="col-span-1 hidden md:flex items-center">
                  <span className="text-sm text-white/45 font-mono">{(entry as any).xp?.toLocaleString?.() ?? entry.missions}</span>
                </div>
                <div className="col-span-1 hidden md:flex items-center">
                  <span className="text-sm text-orange-400/70 font-mono">{entry.streak}d</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL OPERATIVES", value: "247,891", icon: TrendingUp, color: "#a78bfa" },
          { label: "CARDS IN CIRCULATION", value: "8.4M", icon: Star, color: "#fbbf24" },
          { label: "TOTAL XP EARNED", value: "1.2B", icon: Zap, color: "#38bdf8" },
          { label: "ACTIVE TODAY", value: "12,441", icon: Flame, color: "#ef4444" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.08 }}
            className="p-4 rounded-2xl text-center" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
            <p className="font-display font-black text-2xl text-white">{s.value}</p>
            <p className="text-[10px] text-white/30 font-sans tracking-wider mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
