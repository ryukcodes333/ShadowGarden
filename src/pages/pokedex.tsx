import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Zap, BookOpen } from "lucide-react";

const TYPE_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  normal:   { bg: "#6b7280", text: "#fff", glow: "rgba(107,114,128,0.4)" },
  fire:     { bg: "#f97316", text: "#fff", glow: "rgba(249,115,22,0.5)" },
  water:    { bg: "#38bdf8", text: "#fff", glow: "rgba(56,189,248,0.5)" },
  electric: { bg: "#fbbf24", text: "#000", glow: "rgba(251,191,36,0.5)" },
  grass:    { bg: "#22c55e", text: "#fff", glow: "rgba(34,197,94,0.5)" },
  ice:      { bg: "#67e8f9", text: "#000", glow: "rgba(103,232,249,0.5)" },
  fighting: { bg: "#dc2626", text: "#fff", glow: "rgba(220,38,38,0.4)" },
  poison:   { bg: "#a855f7", text: "#fff", glow: "rgba(168,85,247,0.4)" },
  ground:   { bg: "#d97706", text: "#fff", glow: "rgba(217,119,6,0.4)" },
  flying:   { bg: "#818cf8", text: "#fff", glow: "rgba(129,140,248,0.4)" },
  psychic:  { bg: "#ec4899", text: "#fff", glow: "rgba(236,72,153,0.5)" },
  bug:      { bg: "#84cc16", text: "#fff", glow: "rgba(132,204,22,0.4)" },
  rock:     { bg: "#78716c", text: "#fff", glow: "rgba(120,113,108,0.4)" },
  ghost:    { bg: "#6d28d9", text: "#fff", glow: "rgba(109,40,217,0.4)" },
  dragon:   { bg: "#3730a3", text: "#fff", glow: "rgba(55,48,163,0.5)" },
  dark:     { bg: "#292524", text: "#fff", glow: "rgba(41,37,36,0.6)" },
  steel:    { bg: "#94a3b8", text: "#fff", glow: "rgba(148,163,184,0.4)" },
  fairy:    { bg: "#f9a8d4", text: "#000", glow: "rgba(249,168,212,0.4)" },
};

const STAT_COLORS: Record<string, string> = {
  hp: "#22c55e", attack: "#ef4444", defense: "#38bdf8",
  "special-attack": "#f59e0b", "special-defense": "#a855f7", speed: "#ec4899",
};
const STAT_LABELS: Record<string, string> = {
  hp: "HP", attack: "ATK", defense: "DEF",
  "special-attack": "SP.ATK", "special-defense": "SP.DEF", speed: "SPD",
};

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
const SHINY_BASE  = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny";

interface PokemonListEntry { name: string; url: string; }
interface PokemonDetail {
  id: number; name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  height: number; weight: number; base_experience: number;
}

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_COLORS[type] || { bg: "#6b7280", text: "#fff", glow: "" };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-display font-bold tracking-wider uppercase"
      style={{ background: cfg.bg, color: cfg.text }}>{type}</span>
  );
}

function PokemonCard({ entry, index, onClick }: { entry: PokemonListEntry; index: number; onClick: () => void }) {
  const id = index + 1;
  const [imgError, setImgError] = useState(false);
  const spriteUrl = imgError
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    : `${SPRITE_BASE}/${id}.png`;

  return (
    <motion.div
      data-testid={`card-pokemon-${id}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.007, 0.4) }}
      whileHover={{ y: -5, scale: 1.06 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.45)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.15)"}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08), transparent 70%)" }} />
      <div className="p-3 pt-4 flex flex-col items-center gap-1.5">
        <div className="relative w-16 h-16">
          <img src={spriteUrl} alt={entry.name} onError={() => setImgError(true)}
            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
        </div>
        <span className="font-mono text-[10px] text-white/25">#{String(id).padStart(3, "0")}</span>
        <span className="font-display font-bold text-xs text-white capitalize text-center leading-tight">
          {entry.name.replace(/-/g, " ")}
        </span>
      </div>
    </motion.div>
  );
}

function StatBar({ name, value }: { name: string; value: number }) {
  const color = STAT_COLORS[name] || "#a78bfa";
  const pct = Math.min((value / 255) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-white/30 w-16 text-right flex-shrink-0">{STAT_LABELS[name] || name}</span>
      <span className="font-display font-bold text-sm w-8 flex-shrink-0" style={{ color }}>{value}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
    </div>
  );
}

function PokemonDetailView({ pokemonId, onClose }: { pokemonId: number; onClose: () => void }) {
  const [shiny, setShiny] = useState(false);
  const { data, isLoading } = useQuery<PokemonDetail>({
    queryKey: ["pokemon-detail", pokemonId],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
  });

  const primaryType = data?.types[0]?.type.name || "normal";
  const typeCfg = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  const spriteUrl = shiny ? `${SHINY_BASE}/${pokemonId}.png` : `${SPRITE_BASE}/${pokemonId}.png`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88 }}
        onClick={e => e.stopPropagation()}
        className="max-w-2xl w-full rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "linear-gradient(160deg, #0d0a20, #090714)", border: `1px solid ${typeCfg.bg}40`, boxShadow: `0 0 80px ${typeCfg.glow}, 0 40px 80px rgba(0,0,0,0.8)` }}>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${typeCfg.bg}, rgba(124,58,237,0.5))` }} />

        {isLoading ? (
          <div className="p-12 flex flex-col items-center gap-4">
            <motion.div className="w-12 h-12 border-2 rounded-full"
              style={{ borderTopColor: typeCfg.bg, borderColor: "transparent" }}
              animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
            <p className="font-mono text-sm text-white/30">ACCESSING POKÉDEX DATA...</p>
          </div>
        ) : data ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-xs text-white/30">#{String(data.id).padStart(3, "0")}</span>
                <h2 className="font-display font-black text-3xl text-white capitalize leading-tight">{data.name.replace(/-/g, " ")}</h2>
                <div className="flex gap-2 mt-2">{data.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button data-testid="button-close-pokemon" onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
                <button data-testid="button-toggle-shiny" onClick={() => setShiny(s => !s)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  style={{ background: shiny ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${shiny ? "#fbbf24" : "rgba(255,255,255,0.1)"}`, color: shiny ? "#fbbf24" : "rgba(255,255,255,0.4)" }}>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${typeCfg.bg}25, transparent 70%)` }} />
                  <motion.img src={spriteUrl} alt={data.name} key={shiny ? "shiny" : "normal"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                    transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    className="w-full h-full object-contain drop-shadow-2xl" />
                  {shiny && (
                    <div className="absolute -top-1 -right-1 font-display font-black text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#fbbf24", color: "#000" }}>✦ SHINY</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 w-full text-center font-mono text-xs">
                  {[
                    { l: "HEIGHT", v: `${(data.height / 10).toFixed(1)}m` },
                    { l: "WEIGHT", v: `${(data.weight / 10).toFixed(1)}kg` },
                  ].map(s => (
                    <div key={s.l} className="p-2.5 rounded-xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                      <p className="text-white/30 mb-0.5">{s.l}</p>
                      <p className="text-white font-bold">{s.v}</p>
                    </div>
                  ))}
                </div>

                <div className="w-full p-3.5 rounded-2xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                  <p className="font-mono text-xs text-white/30 mb-2 tracking-wider">ABILITIES</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.abilities.map(a => (
                      <span key={a.ability.name} className="font-display font-bold text-xs capitalize px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: a.is_hidden ? "#a78bfa" : "rgba(255,255,255,0.6)" }}>
                        {a.ability.name.replace(/-/g, " ")}
                        {a.is_hidden && <span className="ml-1 text-violet-400">(H)</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <p className="font-mono text-xs text-white/25 mb-4 tracking-[0.3em] flex items-center gap-2">
                  <Zap className="w-3 h-3 text-violet-400" /> BASE STATS
                </p>
                <div className="space-y-3">
                  {data.stats.map(s => <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-white/30">TOTAL BST</span>
                    <span className="font-bold text-white">{data.stats.reduce((a, s) => a + s.base_stat, 0)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-white/30">BASE EXP</span>
                    <span className="font-bold text-white">{data.base_experience}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-white/30">Failed to load data.</div>
        )}
      </motion.div>
    </motion.div>
  );
}

const ALL_TYPES = ["fire","water","grass","electric","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy","normal"];

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: listData, isLoading } = useQuery<{ results: PokemonListEntry[] }>({
    queryKey: ["pokemon-list"],
    queryFn: async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
  });

  const pokemons = listData?.results || [];
  const filtered = pokemons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    String(pokemons.indexOf(p) + 1).includes(search)
  );

  const handleSelect = useCallback((id: number) => setSelectedId(id), []);
  const handleClose = useCallback(() => setSelectedId(null), []);

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1400px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Shadow Garden Field Database</p>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h1 className="font-display font-black text-4xl md:text-5xl text-white">Pokédex Terminal</h1>
        </div>
        <p className="text-white/40 text-sm font-sans">Gen I — 151 subjects classified and indexed.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input data-testid="input-pokemon-search"
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or number..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-all font-sans"
            style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.25)" }}
            onFocus={e => (e.target as HTMLInputElement).style.border = "1px solid rgba(124,58,237,0.5)"}
            onBlur={e => (e.target as HTMLInputElement).style.border = "1px solid rgba(124,58,237,0.25)"}
          />
          {search && (
            <button data-testid="button-clear-search" onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {filterType && (
          <button data-testid="button-clear-type-filter" onClick={() => setFilterType(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-bold text-sm cursor-pointer transition-all"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa" }}>
            <X className="w-3 h-3" /> Clear Type
          </button>
        )}
        <div className="flex items-center gap-2 px-4 rounded-2xl text-xs font-mono text-white/25"
          style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {filtered.length} / 151 Pokémon
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TYPES.map(type => {
          const cfg = TYPE_COLORS[type];
          const isActive = filterType === type;
          return (
            <button key={type} data-testid={`button-type-${type}`}
              onClick={() => setFilterType(isActive ? null : type)}
              className="px-2.5 py-1 rounded-full text-xs font-display font-bold tracking-wider uppercase cursor-pointer transition-all"
              style={{ background: isActive ? cfg.bg : `${cfg.bg}20`, color: isActive ? cfg.text : cfg.bg, border: `1px solid ${isActive ? cfg.bg : `${cfg.bg}40`}`, boxShadow: isActive ? `0 0 12px ${cfg.glow}` : "none" }}>
              {type}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl animate-pulse" style={{ background: "rgba(124,58,237,0.06)" }} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filtered.map((entry) => {
              const id = pokemons.indexOf(entry) + 1;
              return <PokemonCard key={entry.name} entry={entry} index={id - 1} onClick={() => handleSelect(id)} />;
            })}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <Sparkles className="w-12 h-12 text-violet-400/20 mb-4" />
              <p className="font-display font-black text-xl text-white/30">No Pokémon found</p>
              <p className="font-mono text-sm text-white/20 mt-1">Try a different search term</p>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedId !== null && <PokemonDetailView pokemonId={selectedId} onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
}
