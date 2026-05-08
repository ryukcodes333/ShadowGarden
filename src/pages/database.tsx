import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Star, Zap, Shield, Eye } from "lucide-react";
import { shadowOperatives } from "@/data/shadowData";

interface JikanChar {
  character: {
    mal_id: number;
    images: { jpg: { image_url: string; small_image_url: string; }; };
    name: string;
  };
  role: string;
}

const AURA_COLORS: Record<string, string> = {
  "SG-001": "#f59e0b",
  "SG-002": "#a8b5c4",
  "SG-003": "#38bdf8",
  "SG-004": "#ef4444",
  "SG-005": "#00d17a",
  "SG-006": "#c5cfd8",
  "SG-007": "#34d399",
};
const THREAT_COLORS: Record<string, string> = {
  UR: "#ef4444", SSR: "#fbbf24", SR: "#a78bfa", R: "#38bdf8", N: "#6b7280",
};

function useCharImages() {
  return useQuery<JikanChar[]>({
    queryKey: ["eminence-chars"],
    queryFn: async () => {
      const res = await fetch("https://api.jikan.moe/v4/anime/48316/characters");
      if (!res.ok) throw new Error("failed");
      const d = await res.json();
      return d.data as JikanChar[];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

function OperativeCard({ op, charImage, onClick }: { op: typeof shadowOperatives[0]; charImage?: string; onClick: () => void }) {
  const color = AURA_COLORS[op.id] || "#a78bfa";
  const threatColor = THREAT_COLORS[op.threat] || "#6b7280";
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      data-testid={`card-op-${op.id}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10, scale: 1.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group cursor-pointer relative rounded-3xl overflow-hidden"
      style={{
        aspectRatio: "3/4",
        border: `2px solid ${color}${hovered ? "60" : "25"}`,
        boxShadow: hovered ? `0 0 30px ${color}30, 0 20px 60px rgba(0,0,0,0.5)` : "0 4px 30px rgba(0,0,0,0.4)",
        transition: "all 0.3s ease",
        background: "rgba(13,10,30,0.9)",
      }}
    >
      {charImage ? (
        <img
          src={charImage}
          alt={op.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}15, transparent 70%)` }}>
          <span className="font-display font-black" style={{ fontSize: "6rem", color, opacity: 0.08 }}>{op.name[0]}</span>
        </div>
      )}

      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,5,18,0.98) 0%, rgba(7,5,18,0.7) 40%, rgba(7,5,18,0.2) 65%, transparent 100%)" }} />
      <AnimatePresence>
        {hovered && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${color}20 0%, transparent 60%)` }} />
        )}
      </AnimatePresence>

      <div className="absolute top-3 right-3 left-3 flex justify-between items-start">
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: color, border: `1px solid ${color}30` }}>{op.id}</span>
        <span className="font-display font-black text-xs px-2 py-0.5 rounded-full" style={{ background: `${threatColor}20`, backdropFilter: "blur(8px)", color: threatColor, border: `1px solid ${threatColor}40`, textShadow: `0 0 8px ${threatColor}` }}>{op.threat}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.div animate={{ y: hovered ? -4 : 0 }} transition={{ duration: 0.2 }}>
          <p className="font-display font-black text-2xl text-white leading-tight tracking-wide">{op.name}</p>
          <p className="text-xs text-white/50 mt-0.5 font-sans">{op.rank}</p>
          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs font-mono overflow-hidden" style={{ color: color }}>
                {op.specialty}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${color}30`, border: `2px solid ${color}60` }}>
          <Eye className="w-5 h-5" style={{ color }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function OperativeModal({ op, charImage, onClose }: { op: typeof shadowOperatives[0]; charImage?: string; onClose: () => void }) {
  const color = AURA_COLORS[op.id] || "#a78bfa";
  const threatColor = THREAT_COLORS[op.threat] || "#6b7280";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-3xl w-full rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0a20, #090714)", border: `1px solid ${color}35`, boxShadow: `0 0 80px ${color}20, 0 40px 80px rgba(0,0,0,0.8)` }}>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, rgba(6,182,212,0.5))` }} />

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-72 md:h-auto overflow-hidden">
            {charImage ? (
              <img src={charImage} alt={op.name} className="w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="h-full flex items-center justify-center" style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}15, transparent 70%)` }}>
                <span className="font-display font-black" style={{ fontSize: "8rem", color, opacity: 0.1 }}>{op.name[0]}</span>
              </div>
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(9,7,20,0.95) 100%), linear-gradient(to top, rgba(9,7,20,0.8) 0%, transparent 40%)" }} />
            <div className="absolute top-4 left-4">
              <span className="tag text-xs" style={{ background: `${threatColor}20`, color: threatColor, border: `1px solid ${threatColor}40` }}>{op.threat} TIER</span>
            </div>
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <p className="font-mono text-xs mb-1" style={{ color: `${color}80` }}>{op.id} • {op.status}</p>
              <h2 className="font-display font-black text-4xl text-white mb-1">{op.name}</h2>
              <p className="text-sm text-white/50 mb-6 font-sans">{op.rank}</p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "SPECIALTY",  value: op.specialty,          color: "#38bdf8" },
                  { label: "CLEARANCE",  value: op.clearance,          color: color },
                  { label: "STATUS",     value: op.status,             color: op.status === "ACTIVE" ? "#10b981" : "#f59e0b" },
                  { label: "ABILITY",    value: op.specialAbility,     color: "#a78bfa" },
                ].map(r => (
                  <div key={r.label} className="flex gap-3 text-xs font-mono">
                    <span className="text-white/30 w-24 flex-shrink-0">{r.label}</span>
                    <span style={{ color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { label: "POWER", value: (op.powerLevel / 1000).toFixed(0) + "K", icon: Zap },
                  { label: "CARDS", value: op.cardCount.toLocaleString(), icon: Star },
                  { label: "RATE", value: op.collectionPct + "%", icon: Shield },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                    <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                    <p className="font-display font-black text-lg text-white">{s.value}</p>
                    <p className="text-[10px] text-white/35 font-sans">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <blockquote className="border-l-2 pl-4 italic text-sm text-white/50 font-sans leading-relaxed" style={{ borderColor: color }}>
              "{op.quote}"
            </blockquote>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Database() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof shadowOperatives[0] | null>(null);
  const { data: jikanChars } = useCharImages();

  const getCharImage = (op: typeof shadowOperatives[0]) => {
    if (!jikanChars) return undefined;
    const match = jikanChars.find(c => {
      const n = c.character.name.toLowerCase();
      return n.includes(op.name.toLowerCase()) || op.name.toLowerCase().includes(n.split(",")[0]?.trim()?.toLowerCase() || "x");
    });
    return match?.character.images.jpg.image_url;
  };

  const filtered = useMemo(() =>
    shadowOperatives.filter(op =>
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.specialty.toLowerCase().includes(search.toLowerCase()) ||
      op.id.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1400px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Omega Clearance</p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-1">Operative Database</h1>
        <p className="text-white/40 text-sm font-sans">Seven Shades classified personnel files. Unauthorized access is a capital offense.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search operatives..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm text-white placeholder-white/25 outline-none transition-all font-sans"
            style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.25)", }}
            onFocus={e => (e.target as HTMLInputElement).style.border = "1px solid rgba(124,58,237,0.5)"}
            onBlur={e => (e.target as HTMLInputElement).style.border = "1px solid rgba(124,58,237,0.25)"}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-4 rounded-2xl text-xs font-mono text-white/30" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {filtered.length} / {shadowOperatives.length} operatives
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        <AnimatePresence>
          {filtered.map((op, i) => (
            <motion.div key={op.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
              <OperativeCard op={op} charImage={getCharImage(op)} onClick={() => setSelected(op)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <OperativeModal op={selected} charImage={getCharImage(selected)} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
