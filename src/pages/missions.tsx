import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Lock, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Clock, Users } from "lucide-react";
import { missions, type Mission } from "@/data/shadowData";

const STATUS_CFG = {
  ACTIVE:     { color: "#10b981", bg: "rgba(16,185,129,0.12)",  icon: Zap },
  CLASSIFIED: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  icon: Lock },
  COMPLETED:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)",  icon: CheckCircle2 },
};
const DANGER_CFG = {
  CRITICAL: { color: "#ef4444" },
  HIGH:     { color: "#f97316" },
  MEDIUM:   { color: "#fbbf24" },
  LOW:      { color: "#10b981" },
};

const FILTERS = ["ALL", "ACTIVE", "CLASSIFIED", "COMPLETED"] as const;

function MissionCard({ m }: { m: Mission }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CFG[m.status];
  const danger = DANGER_CFG[m.danger];
  const StatusIcon = status.icon;

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden transition-all duration-300"
      style={{ background: "rgba(13,10,30,0.8)", border: `1px solid ${status.color}18` }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${status.color}40`}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = `${status.color}18`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: status.bg, border: `1px solid ${status.color}30` }}>
              <StatusIcon className="w-4 h-4" style={{ color: status.color }} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] text-white/30">{m.id}</span>
                <span className="tag text-[10px]" style={{ color: danger.color, background: `${danger.color}15`, border: `1px solid ${danger.color}30` }}>{m.danger}</span>
                <span className="tag text-[10px]" style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}30` }}>{m.status}</span>
              </div>
              <h3 className="font-display font-black text-xl text-white leading-tight">{m.codename}</h3>
              <p className="text-xs text-white/35 font-sans mt-0.5">{m.location}</p>
            </div>
          </div>
          <button onClick={() => setExpanded(p => !p)}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white/30 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/30">
          {m.status === "ACTIVE" && m.timeRemaining && (
            <span className="flex items-center gap-1.5 text-red-400">
              <Clock className="w-3 h-3" /> {m.timeRemaining} REMAINING
            </span>
          )}
          <span>REWARD: <span className="text-white/55">{m.reward}</span></span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />{m.participants} operative{m.participants !== 1 ? "s" : ""}
          </span>
          {m.status !== "CLASSIFIED" && m.successRate > 0 && (
            <span>SUCCESS: <span style={{ color: m.successRate >= 90 ? "#10b981" : m.successRate >= 70 ? "#fbbf24" : "#ef4444" }}>{m.successRate}%</span></span>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-5 pt-5 border-t border-white/5">
              <p className="text-xs font-mono text-white/25 mb-1 tracking-widest">OBJECTIVE</p>
              <p className="text-sm text-white/55 leading-relaxed font-sans mb-3">{m.objective}</p>
              <p className="text-xs font-mono text-white/25 mb-1 tracking-widest">BRIEFING</p>
              <p className="text-sm text-white/55 leading-relaxed font-sans mb-5">{m.briefing}</p>

              {m.status === "ACTIVE" && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-xl font-display font-bold text-sm text-white cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${status.color}, ${status.color}88)`, boxShadow: `0 0 16px ${status.color}30` }}>
                  Accept Mission
                </motion.button>
              )}
              {m.status === "CLASSIFIED" && (
                <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "#f59e0b" }}>
                  <Lock className="w-3 h-3" /> Higher clearance required to access full briefing
                </div>
              )}
              {m.status === "COMPLETED" && m.completedAt && (
                <div className="flex items-center gap-2 text-xs font-mono text-white/30">
                  <CheckCircle2 className="w-3 h-3" /> Completed {m.completedAt} — logs archived
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${status.color}50, transparent)` }} />
    </motion.div>
  );
}

export default function Missions() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const filtered = missions.filter(m => filter === "ALL" || m.status === filter);
  const counts = {
    ALL: missions.length,
    ACTIVE: missions.filter(m => m.status === "ACTIVE").length,
    CLASSIFIED: missions.filter(m => m.status === "CLASSIFIED").length,
    COMPLETED: missions.filter(m => m.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1200px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Shadow Garden Ops</p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-white">Mission Terminal</h1>
        <p className="text-white/40 text-sm mt-1 font-sans">Classified operations. Accept at your own risk.</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => {
          const c = f === "ACTIVE" ? "#10b981" : f === "CLASSIFIED" ? "#f59e0b" : f === "COMPLETED" ? "#6b7280" : "#a78bfa";
          const isActive = filter === f;
          return (
            <motion.button key={f} onClick={() => setFilter(f)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-sm cursor-pointer transition-all"
              style={{ background: isActive ? `${c}20` : "rgba(13,10,30,0.8)", border: `1px solid ${isActive ? c + "50" : "rgba(255,255,255,0.06)"}`, color: isActive ? c : "rgba(241,245,249,0.4)" }}>
              {f}
              <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: isActive ? `${c}25` : "rgba(255,255,255,0.06)", color: isActive ? c : "rgba(241,245,249,0.3)" }}>
                {counts[f]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {counts.ACTIVE > 0 && filter !== "COMPLETED" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl text-xs font-mono"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
          <AlertTriangle className="w-3 h-3 animate-pulse" />
          {counts.ACTIVE} active operation{counts.ACTIVE !== 1 ? "s" : ""} require immediate attention
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((m, i) => (
            <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.06 }}>
              <MissionCard m={m} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
