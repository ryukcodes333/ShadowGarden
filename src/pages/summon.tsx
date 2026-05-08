import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, RefreshCw, Star, Database } from "lucide-react";
import { mockCards, type ShadowCard } from "@/data/shadowData";
import { fetchCardByRarity, isApiConfigured, SHOOB_TIER_MAP, type ShoobCard } from "@/lib/shoobApi";

const RARITY_CFG = {
  N:   { label: "COMMON",           color: "#6b7280", glow: "rgba(107,114,128,0.35)", gradient: "from-gray-700 to-gray-900",    ring: "#374151" },
  R:   { label: "RARE",             color: "#38bdf8", glow: "rgba(56,189,248,0.4)",   gradient: "from-sky-700 to-blue-900",    ring: "#0ea5e9" },
  SR:  { label: "EPIC",             color: "#a78bfa", glow: "rgba(167,139,250,0.45)", gradient: "from-violet-700 to-indigo-900",ring: "#7c3aed" },
  SSR: { label: "LEGENDARY",        color: "#fbbf24", glow: "rgba(251,191,36,0.5)",   gradient: "from-amber-600 to-yellow-900", ring: "#f59e0b" },
  UR:  { label: "SHADOW ULTIMATE",  color: "#ef4444", glow: "rgba(239,68,68,0.6)",    gradient: "from-red-700 to-rose-900",    ring: "#ef4444" },
};

type Rarity = keyof typeof RARITY_CFG;

const SPAWN_RATES: [Rarity, number][] = [
  ["UR",  0.002],
  ["SSR", 0.030],
  ["SR",  0.120],
  ["R",   0.420],
  ["N",   1.000],
];

function pickRarity(): Rarity {
  const r = Math.random();
  let cumulative = 0;
  for (const [rarity, threshold] of SPAWN_RATES) {
    cumulative += threshold - (cumulative > 0 ? SPAWN_RATES[SPAWN_RATES.findIndex(([r]) => r === rarity) - 1]?.[1] ?? 0 : 0);
    if (r < threshold) return rarity;
  }
  return "N";
}

function pickMockCard(rarity: Rarity): ShadowCard {
  const pool = mockCards.filter(c => c.rarity === rarity);
  return pool.length
    ? pool[Math.floor(Math.random() * pool.length)]
    : mockCards.filter(c => c.rarity === "N")[0];
}

interface DisplayCard {
  name: string;
  series: string;
  rarity: Rarity;
  imageUrl?: string;
  tierLabel?: string;
  power?: number;
  element?: string;
  ownerCount?: number;
}

function MagicCircle({ rarity }: { rarity: Rarity }) {
  const cfg = RARITY_CFG[rarity];
  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      {[...Array(4)].map((_, i) => (
        <motion.div key={i}
          className="absolute border rounded-full"
          style={{ width: 60 + i * 44, height: 60 + i * 44, borderColor: `${cfg.color}${60 - i * 12}` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 3 + i * 1.5, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ background: cfg.color, top: "50%", left: "50%", transformOrigin: `0px -${60 + i * 8}px` }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`, border: `2px solid ${cfg.color}60`, boxShadow: `0 0 40px ${cfg.glow}` }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}>
        <Sparkles className="w-9 h-9" style={{ color: cfg.color }} />
      </motion.div>
    </div>
  );
}

function CardReveal({ card, onClose }: { card: DisplayCard; onClose: () => void }) {
  const cfg = RARITY_CFG[card.rarity];
  const isLegend = card.rarity === "UR" || card.rarity === "SSR";
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(30px)" }}>
      {isLegend && (
        <motion.div className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.25] }} transition={{ duration: 0.5 }}
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${cfg.glow} 0%, transparent 65%)` }} />
      )}

      <motion.div className="relative z-10 flex flex-col items-center gap-6"
        initial={{ scale: 0.2, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.15 }}>

        {[...Array(isLegend ? 24 : 8)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ background: cfg.color, left: "50%", top: "50%" }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i / (isLegend ? 24 : 8)) * Math.PI * 2) * (80 + Math.random() * 140),
              y: Math.sin((i / (isLegend ? 24 : 8)) * Math.PI * 2) * (80 + Math.random() * 140),
              opacity: 0, scale: 0,
            }}
            transition={{ delay: 0.2 + i * 0.02, duration: 1.5, ease: "easeOut" }}
          />
        ))}

        <div className="relative w-64 rounded-3xl overflow-hidden"
          style={{ boxShadow: `0 0 60px ${cfg.glow}, 0 0 120px ${cfg.glow}50`, border: `2px solid ${cfg.ring}` }}>

          <div className={`h-64 bg-gradient-to-br ${cfg.gradient} relative flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)" }} />
            {isLegend && (
              <motion.div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, transparent 40%, ${cfg.color}20 50%, transparent 60%)` }}
                animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
            )}

            {card.imageUrl && !imgError ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.85) saturate(1.1)" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-display font-black opacity-10 text-white" style={{ fontSize: "5rem" }}>
                {card.name[0]}
              </span>
            )}

            <div className="absolute bottom-0 inset-x-0 h-20" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
          </div>

          <div className="p-4" style={{ background: "rgba(10,8,22,0.98)" }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-display font-black text-lg text-white leading-tight">{card.name}</h3>
                <p className="text-xs text-white/40 font-sans">{card.series}</p>
              </div>
              <span className="font-display font-black text-xs px-2 py-0.5 rounded-full"
                style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}40` }}>
                {card.tierLabel ?? card.rarity}
              </span>
            </div>
            <div className="flex gap-4 text-xs font-mono mt-2">
              {card.element && <><span className="text-white/30">ELEMENT:</span><span className="text-white">{card.element}</span></>}
              {card.power && <><span className="text-white/30">PWR:</span><span style={{ color: cfg.color }}>{card.power.toLocaleString()}</span></>}
            </div>
          </div>

          {isLegend && (
            <motion.div className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: `linear-gradient(135deg, transparent 40%, ${cfg.color}10 50%, transparent 60%)` }}
              animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }} />
          )}
        </div>

        <div className="text-center">
          <p className="font-display font-black text-sm tracking-[0.3em]" style={{ color: cfg.color }}>{cfg.label}</p>
          {card.ownerCount != null && (
            <p className="text-xs text-white/30 font-mono mt-1">OWNED BY {card.ownerCount.toLocaleString()}</p>
          )}
        </div>

        <motion.button onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="px-10 py-3.5 rounded-2xl font-display font-bold text-sm text-white/70 hover:text-white border border-white/10 hover:border-white/25 transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

type Phase = "idle" | "casting" | "flash" | "reveal";

export default function Summon() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [card, setCard] = useState<DisplayCard | null>(null);
  const [history, setHistory] = useState<DisplayCard[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ UR: 0, SSR: 0, SR: 0, R: 0, N: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const apiEnabled = isApiConfigured();

  const doSummon = useCallback(async () => {
    if (phase !== "idle") return;
    const rarity = pickRarity();
    const isLegend = rarity === "UR" || rarity === "SSR";
    const dur = isLegend ? 2800 : 1800;

    setPhase("casting");

    let displayCard: DisplayCard;

    if (apiEnabled) {
      const shoobCard: ShoobCard | null = await fetchCardByRarity(rarity);
      if (shoobCard) {
        const tierCfg = SHOOB_TIER_MAP[shoobCard.tier] ?? SHOOB_TIER_MAP.T1;
        const mappedRarity = tierCfg.display as Rarity;
        displayCard = {
          name: shoobCard.name,
          series: shoobCard.series,
          rarity: mappedRarity,
          imageUrl: shoobCard.imageUrl || shoobCard.thumbnailUrl,
          tierLabel: `${shoobCard.tier} · ${tierCfg.label}`,
        };
      } else {
        const mock = pickMockCard(rarity);
        displayCard = { name: mock.name, series: mock.series, rarity, element: mock.element, power: mock.power, ownerCount: mock.ownerCount };
      }
    } else {
      const mock = pickMockCard(rarity);
      displayCard = { name: mock.name, series: mock.series, rarity, element: mock.element, power: mock.power, ownerCount: mock.ownerCount };
    }

    timerRef.current = setTimeout(() => {
      setPhase("flash");
      setTimeout(() => {
        setCard(displayCard);
        setHistory(p => [displayCard, ...p.slice(0, 9)]);
        setTotal(t => t + 1);
        setCounts(prev => ({ ...prev, [displayCard.rarity]: prev[displayCard.rarity] + 1 }));
        setPhase("reveal");
      }, 400);
    }, dur);
  }, [phase, apiEnabled]);

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1200px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Shadow Garden</p>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-black text-4xl md:text-5xl text-white">Card Summon</h1>
          {apiEnabled && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
              <Database className="w-3 h-3" />
              LIVE CARDS
            </div>
          )}
        </div>
        <p className="text-white/40 text-sm mt-1 font-sans">
          {apiEnabled ? "Pulling from the live card database. Real cards, real artwork." : "Recruit from the darkness. Who will answer the call?"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full max-w-sm h-72 rounded-3xl flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(160deg, rgba(20,15,45,0.9), rgba(10,8,22,0.95))", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.08), transparent 70%)" }} />
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", boxShadow: "0 0 30px rgba(124,58,237,0.15)" }}>
                    <Sparkles className="w-9 h-9 text-violet-400/50" />
                  </div>
                  <p className="font-mono text-xs text-white/25 tracking-[0.3em]">AWAITING COMMAND</p>
                </motion.div>
              )}
              {phase === "casting" && (
                <motion.div key="casting" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <MagicCircle rarity={card?.rarity ?? "N"} />
                </motion.div>
              )}
              {phase === "flash" && (
                <motion.div key="flash" className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }} transition={{ duration: 0.4 }} />
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={doSummon}
            disabled={phase !== "idle"}
            whileHover={{ scale: phase === "idle" ? 1.03 : 1, boxShadow: phase === "idle" ? "0 0 40px rgba(124,58,237,0.5)" : "none" }}
            whileTap={{ scale: phase === "idle" ? 0.97 : 1 }}
            className="w-full max-w-sm py-4 rounded-2xl font-display font-black text-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: phase === "idle" ? "0 0 24px rgba(124,58,237,0.35)" : "none" }}>
            <Sparkles className="inline w-5 h-5 mr-2 mb-0.5" />
            SUMMON ×1
          </motion.button>

          <div className="w-full max-w-sm p-5 rounded-2xl" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
            <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-4">SESSION STATS</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(["UR","SSR","SR"] as const).map(r => {
                const cfg = RARITY_CFG[r];
                return (
                  <div key={r} className="rounded-xl p-3 text-center" style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}>
                    <p className="font-display font-black text-xl" style={{ color: cfg.color }}>{counts[r]}</p>
                    <p className="text-[10px] font-mono text-white/30">{r}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-xs font-mono text-white/25">TOTAL SUMMONS: <span className="text-white font-bold">{total}</span></div>
          </div>

          <div className="w-full max-w-sm p-4 rounded-2xl" style={{ background: "rgba(13,10,30,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs font-mono text-white/25 mb-3 flex items-center gap-2"><Zap className="w-3 h-3" /> DROP RATES</p>
            <div className="flex flex-wrap gap-3">
              {(["UR","SSR","SR","R","N"] as const).map(r => {
                const rates = { UR: "0.2%", SSR: "2.8%", SR: "9%", R: "30%", N: "58%" };
                return (
                  <div key={r} className="flex items-center gap-1.5">
                    <span className="font-display font-black text-sm" style={{ color: RARITY_CFG[r].color }}>{r}</span>
                    <span className="text-xs font-mono text-white/30">{rates[r]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-mono text-white/25 tracking-[0.3em] mb-4 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> PULL HISTORY</p>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-white/8">
              <Star className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-sm text-white/25 font-sans">No pulls yet — summon to begin</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((c, i) => {
                const cfg = RARITY_CFG[c.rarity];
                return (
                  <motion.div key={`${c.name}-${i}`}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                    style={{ background: "rgba(13,10,30,0.8)", border: `1px solid ${cfg.color}18` }}>
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        style={{ border: `1px solid ${cfg.color}40` }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-black text-xs"
                        style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>{c.rarity}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm text-white truncate">{c.name}</p>
                      <p className="text-xs text-white/35 font-sans truncate">{c.series}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-mono font-bold" style={{ color: cfg.color }}>{c.tierLabel ?? c.rarity}</p>
                      {c.element && <p className="text-xs text-white/25 font-mono">{c.element}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {phase === "reveal" && card && <CardReveal card={card} onClose={() => { setCard(null); setPhase("idle"); }} />}
      </AnimatePresence>
    </div>
  );
}
