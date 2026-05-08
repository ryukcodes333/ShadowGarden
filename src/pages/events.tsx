import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Zap, Star, Sword, BookOpen, Trophy, ChevronRight, Shield } from "lucide-react";
import { events, type ShadowEvent } from "@/data/shadowData";

const TYPE_CFG = {
  RAID:     { icon: Sword,    label: "RAID",       color: "#ef4444", gradient: "linear-gradient(160deg, rgba(127,29,29,0.55), rgba(13,10,30,0.97))" },
  LIMITED:  { icon: Star,     label: "LIMITED",    color: "#a78bfa", gradient: "linear-gradient(160deg, rgba(76,29,149,0.55), rgba(13,10,30,0.97))" },
  SEASONAL: { icon: Calendar, label: "SEASONAL",   color: "#f59e0b", gradient: "linear-gradient(160deg, rgba(120,53,15,0.55), rgba(13,10,30,0.97))" },
  STORY:    { icon: BookOpen, label: "STORY ARC",  color: "#00d17a", gradient: "linear-gradient(160deg, rgba(6,78,59,0.55), rgba(13,10,30,0.97))" },
  PVP:      { icon: Shield,   label: "PVP",        color: "#06b6d4", gradient: "linear-gradient(160deg, rgba(8,74,110,0.55), rgba(13,10,30,0.97))" },
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, expired: false };
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-lg text-white"
        style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        {value}
      </div>
      <span className="text-[9px] font-mono text-white/30 tracking-widest">{label}</span>
    </div>
  );
}

function EventCard({ ev, charImg }: { ev: ShadowEvent; charImg?: string }) {
  const cfg = TYPE_CFG[ev.type as keyof typeof TYPE_CFG] || TYPE_CFG.LIMITED;
  const TypeIcon = cfg.icon;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const timeLeft = getTimeLeft(ev.targetDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative rounded-3xl overflow-hidden flex flex-col h-full"
      style={{
        background: "rgba(13,10,30,0.92)",
        border: `1px solid ${cfg.color}28`,
        boxShadow: `0 0 40px ${cfg.color}05`,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${cfg.color}55`;
        el.style.boxShadow = `0 0 50px ${cfg.color}18`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${cfg.color}28`;
        el.style.boxShadow = `0 0 40px ${cfg.color}05`;
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: cfg.gradient }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 80% 20%, ${cfg.color}10, transparent 60%)` }} />

      {charImg && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={charImg}
            alt={ev.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.7) saturate(1.15)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(13,10,30,0.98) 100%), linear-gradient(to right, ${cfg.color}15, transparent 60%)` }} />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.55)", border: `1px solid ${cfg.color}40` }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: ev.isActive ? "#10b981" : "#f59e0b" }}
              animate={ev.isActive ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono font-bold" style={{ color: ev.isActive ? "#10b981" : "#f59e0b" }}>
              {ev.isActive ? "LIVE" : "UPCOMING"}
            </span>
          </div>
        </div>
      )}

      <div className="relative p-5 flex flex-col flex-1">
        {!charImg && (
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}40` }}>
                <TypeIcon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <span className="tag text-[10px]" style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}35` }}>{cfg.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full"
                style={{ background: ev.isActive ? "#10b981" : "#f59e0b" }}
                animate={ev.isActive ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-xs font-mono" style={{ color: ev.isActive ? "#10b981" : "#f59e0b" }}>
                {ev.isActive ? "LIVE" : "UPCOMING"}
              </span>
            </div>
          </div>
        )}

        {charImg && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}40` }}>
              <TypeIcon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
            </div>
            <span className="tag text-[10px]" style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}35` }}>{cfg.label}</span>
          </div>
        )}

        <h3 className="font-display font-black text-lg text-white mb-2 leading-tight">{ev.name}</h3>
        <p className="text-xs text-white/45 font-sans leading-relaxed mb-4 flex-1">{ev.description}</p>

        <div className="mb-4">
          <p className="text-[10px] font-mono text-white/25 mb-2 tracking-widest">
            {ev.isActive ? "ENDS IN" : "STARTS IN"}
          </p>
          <div className="flex gap-2">
            <CountdownUnit value={pad(timeLeft.d)} label="DAYS" />
            <CountdownUnit value={pad(timeLeft.h)} label="HRS" />
            <CountdownUnit value={pad(timeLeft.m)} label="MIN" />
            <CountdownUnit value={pad(timeLeft.s)} label="SEC" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl mb-4"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
          <div>
            <p className="text-[10px] text-white/25 font-mono tracking-wider">REWARD</p>
            <p className="text-sm text-white font-display font-bold">{ev.reward}</p>
          </div>
        </div>

        {ev.isActive && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl font-display font-bold text-sm text-white cursor-pointer flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}88)`, boxShadow: `0 0 20px ${cfg.color}30` }}>
            Join Event <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function Events() {
  const active = events.filter(e => e.isActive);
  const upcoming = events.filter(e => !e.isActive);

  const { data: characters = [] } = useQuery({
    queryKey: ["events-characters"],
    queryFn: async () => {
      const res = await fetch("https://api.jikan.moe/v4/anime/48316/characters");
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data ?? []) as Array<{ character: { images: { jpg: { image_url: string } }; name: string }; role: string }>;
    },
    staleTime: Infinity,
    retry: 2,
  });

  function charImg(idx: number): string | undefined {
    if (!characters.length) return undefined;
    const sorted = [...characters].sort((a, b) => (a.role === "Main" ? -1 : 1) - (b.role === "Main" ? -1 : 1));
    return sorted[idx % sorted.length]?.character?.images?.jpg?.image_url;
  }

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1400px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Shadow Garden</p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-white">Live Events</h1>
        <p className="text-white/40 text-sm mt-1 font-sans">Limited campaigns, raids, and seasonal operations — real countdowns.</p>
      </motion.div>

      {active.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <motion.div className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
            <h2 className="font-display font-black text-xl text-white">Active Now</h2>
            <span className="tag text-[10px]" style={{ color: "#10b981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}>{active.length} LIVE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {active.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex flex-col">
                <EventCard ev={ev} charImg={charImg(ev.characterIndex)} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Clock className="w-5 h-5 text-yellow-400/70" />
            <h2 className="font-display font-black text-xl text-white">Upcoming</h2>
            <span className="tag text-[10px]" style={{ color: "#f59e0b", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}>{upcoming.length} SOON</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="flex flex-col">
                <EventCard ev={ev} charImg={charImg(ev.characterIndex)} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
