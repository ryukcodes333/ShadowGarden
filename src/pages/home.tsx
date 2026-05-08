import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Sparkles, Shield, Trophy, Heart, Calendar, BookOpen, Database, Star } from "lucide-react";
import { shadowOperatives } from "@/data/shadowData";

interface JikanChar {
  character: {
    mal_id: number;
    images: { jpg: { image_url: string; }; };
    name: string;
  };
  role: string;
}

function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18 });
  const sy = useSpring(y, { stiffness: 40, damping: 18 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 30);
      y.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [x, y]);
  return { sx, sy };
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const step = end / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 25);
    return () => clearInterval(t);
  }, [end]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { href: "/database",  label: "Operative Database", icon: Database,  color: "#38bdf8", desc: "Access classified dossiers on the Seven Shades and all Shadow Garden operatives.", badge: "7 SHADES" },
  { href: "/summon",    label: "Summon System",       icon: Sparkles,  color: "#fbbf24", desc: "Pull from darkness. SSR and UR cards await the worthy. Magic circle gacha.", badge: "0.2% UR" },
  { href: "/rankings",  label: "Global Rankings",     icon: Trophy,    color: "#f97316", desc: "OMEGA-tier operatives compete for supremacy. 247K registered worldwide.", badge: "TOP 20" },
  { href: "/missions",  label: "Mission Terminal",    icon: Shield,    color: "#ef4444", desc: "Classified active operations. High risk, exceptional rewards.", badge: "9 OPS" },
  { href: "/sanctuary", label: "The Sanctuary",       icon: Heart,     color: "#f472b6", desc: "A hidden lounge for operatives. Rain, music, and community chat.", badge: "LIVE" },
  { href: "/pokedex",   label: "Pokédex Terminal",    icon: BookOpen,  color: "#10b981", desc: "Shadow Garden's field database — all 151 Gen-I subjects classified.", badge: "151" },
];

const OPERATIVE_COLORS = ["#f59e0b","#a8b5c4","#38bdf8","#ef4444","#00d17a","#c5cfd8","#34d399"];

export default function Home() {
  const { sx: mouseX, sy: mouseY } = useMouseParallax();
  const layer1X = useTransform(mouseX, v => v * 0.3);
  const layer1Y = useTransform(mouseY, v => v * 0.2);
  const layer2X = useTransform(mouseX, v => v * 0.6);
  const layer2Y = useTransform(mouseY, v => v * 0.4);
  const layer3X = useTransform(mouseX, v => v * 1.0);
  const layer3Y = useTransform(mouseY, v => v * 0.7);

  const { data: jikanChars, isLoading: charsLoading } = useQuery<JikanChar[]>({
    queryKey: ["eminence-chars"],
    queryFn: async () => {
      const res = await fetch("https://api.jikan.moe/v4/anime/48316/characters");
      if (!res.ok) throw new Error("failed");
      const d = await res.json();
      return d.data as JikanChar[];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const mainChars = jikanChars?.filter(c => c.role === "Main").slice(0, 4) || [];
  const supportChars = jikanChars?.filter(c => c.role === "Supporting").slice(0, 3) || [];
  const heroChars = [...mainChars, ...supportChars].slice(0, 5);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden -mt-20">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #06060f 0%, #0d0826 40%, #07060f 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.06) 0%, transparent 50%)" }} />

        {/* Floating orbs */}
        {[
          { top: "15%", left: "8%", size: 300, color: "rgba(124,58,237,0.08)" },
          { top: "60%", left: "5%", size: 200, color: "rgba(6,182,212,0.06)" },
          { top: "20%", right: "5%", size: 250, color: "rgba(251,191,36,0.05)" },
        ].map((o, i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ width: o.size, height: o.size, background: `radial-gradient(circle, ${o.color}, transparent)`, top: o.top, left: (o as any).left, right: (o as any).right }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-24 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* LEFT: Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 self-start"
            >
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} className="h-px rounded-full" style={{ width: 30 - i * 8, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                    animate={{ scaleX: [1, 1.3, 1] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
                ))}
              </div>
              <span className="text-xs font-display font-bold tracking-[0.3em] uppercase" style={{ color: "#a78bfa" }}>The Eminence in Shadow</span>
              <motion.div className="w-1.5 h-1.5 rounded-full bg-violet-400" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black leading-[0.88] mb-6"
            >
              <span className="block text-5xl md:text-7xl xl:text-8xl text-white">We lurk in</span>
              <span className="block text-5xl md:text-7xl xl:text-8xl gradient-text mt-1">The Shadows</span>
              <span className="block text-3xl md:text-4xl xl:text-5xl text-white/30 mt-2 font-bold">And hunt them.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base md:text-lg text-white/55 max-w-lg mb-8 font-sans leading-relaxed"
            >
              The world believes us to be a myth. A story told to frighten the wicked.
              We are Shadow Garden — and the shadows are <em>very</em> real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/database">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl cursor-pointer font-display font-bold text-base text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.35)" }}
                >
                  <Database className="w-4.5 h-4.5" />
                  Enter the Garden
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </motion.div>
              </Link>
              <Link href="/summon">
                <motion.div
                  whileHover={{ scale: 1.05, borderColor: "rgba(251,191,36,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl cursor-pointer font-display font-bold text-base text-white/80 border border-white/15 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <Sparkles className="w-4.5 h-4.5 text-yellow-400" />
                  Summon Now
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-6 mt-10 pt-6 border-t border-white/5"
            >
              {[
                { label: "Operatives", end: 247891, suffix: "" },
                { label: "Cards", end: 8400000, suffix: "+" },
                { label: "Missions", end: 1200000, suffix: "+" },
              ].map((s, i) => (
                <div key={s.label}>
                  <p className="font-display font-black text-2xl gradient-text">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-white/40 font-sans tracking-wide">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Character artwork */}
          <motion.div
            style={{ x: layer2X, y: layer2Y }}
            className="relative h-[500px] lg:h-[680px] flex items-end justify-center"
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, #06060f 0%, transparent 30%)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to top, #06060f, transparent)" }} />

            {charsLoading && (
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-2xl animate-pulse" style={{ width: 130 + i * 30, height: 320 + i * 40, background: "rgba(124,58,237,0.1)", animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}

            {heroChars.length > 0 && (
              <div className="relative w-full h-full flex items-end justify-center">
                {heroChars.slice(0, 3).map((char, i) => {
                  const positions = [
                    { left: "5%",  width: 160, height: 380, zIndex: 1, delay: 0.4 },
                    { left: "28%", width: 210, height: 480, zIndex: 3, delay: 0.2 },
                    { left: "55%", width: 175, height: 400, zIndex: 2, delay: 0.5 },
                  ];
                  const pos = positions[i] || positions[0];
                  const glowColors = ["rgba(124,58,237,0.3)", "rgba(6,182,212,0.35)", "rgba(251,191,36,0.25)"];
                  return (
                    <motion.div
                      key={char.character.mal_id}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pos.delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: "absolute", left: pos.left, bottom: 0, zIndex: pos.zIndex, width: pos.width }}
                      className="animate-float-slow"
                    >
                      <div className="relative">
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-xl opacity-80" style={{ width: pos.width * 0.8, height: 40, background: glowColors[i] }} />
                        <img
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          className="object-contain object-bottom w-full drop-shadow-2xl"
                          style={{ height: pos.height, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {heroChars.length === 0 && !charsLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center opacity-20">
                  <div className="w-32 h-64 mx-auto rounded-2xl" style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.3), transparent)" }} />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="opacity-30">
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-violet-400 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative py-8 border-y border-white/5" style={{ background: "rgba(13,10,30,0.7)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "OPERATIVES",   value: "247K+", color: "#a78bfa", icon: "👥" },
            { label: "CARDS",        value: "8.4M",  color: "#38bdf8", icon: "🃏" },
            { label: "MISSIONS",     value: "1.2M",  color: "#f97316", icon: "⚔️" },
            { label: "SHADOW RANK",  value: "∞",     color: "#fbbf24", icon: "✦" },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-display font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-white/40 tracking-widest font-sans">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/70 uppercase mb-3">Explore the Shadow</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white">Everything you need</h2>
          <p className="text-white/45 mt-3 text-base max-w-lg mx-auto">Six fully interactive sections, from operative intelligence to live Pokédex terminals.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Link key={f.href} href={f.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover-lift"
                style={{ background: "rgba(13,10,30,0.8)", border: `1px solid ${f.color}20` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.border = `1px solid ${f.color}40`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.border = `1px solid ${f.color}20`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 30% 30%, ${f.color}08, transparent 60%)` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <span className="tag text-xs" style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}30` }}>{f.badge}</span>
                </div>
                <h3 className="font-display font-black text-xl text-white mb-2">{f.label}</h3>
                <p className="text-sm text-white/45 leading-relaxed font-sans">{f.desc}</p>
                <div className="flex items-center gap-1.5 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: f.color }}>
                  <span className="text-xs font-display font-bold tracking-wider">Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEVEN SHADES */}
      <section className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-10">
          <Star className="w-5 h-5 text-yellow-400" />
          <h2 className="font-display font-black text-3xl text-white">The Seven Shades</h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), transparent)" }} />
          <Link href="/database">
            <span className="text-sm font-display font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">View All →</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {shadowOperatives.map((op, i) => {
            const color = OPERATIVE_COLORS[i] || "#a78bfa";
            const heroChar = jikanChars?.find(c => {
              const n = c.character.name.toLowerCase();
              return n.includes(op.name.toLowerCase()) || op.name.toLowerCase().includes(n.split(",")[0]?.trim()?.toLowerCase() || "");
            });
            return (
              <motion.div key={op.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                style={{ border: `1.5px solid ${color}30` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1.5px solid ${color}70`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}25`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1.5px solid ${color}30`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(13,10,30,0.4) 0%, rgba(13,10,30,0.95) 100%)` }} />
                {heroChar ? (
                  <img
                    src={heroChar.character.images.jpg.image_url}
                    alt={op.name}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}20, transparent 70%)` }}>
                    <span className="font-display font-black text-5xl opacity-10" style={{ color }}>{op.name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(ellipse at 50% 100%, ${color}20, transparent 60%)` }} />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-xs opacity-50 text-white">{op.id}</p>
                      <p className="font-display font-black text-sm text-white leading-tight">{op.name}</p>
                    </div>
                    <span className="font-display font-black text-xs" style={{ color, textShadow: `0 0 10px ${color}` }}>{op.threat}</span>
                  </div>
                </div>
                <motion.div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* EVENTS BANNER */}
      <section className="mx-6 md:mx-12 max-w-[1400px] xl:mx-auto mb-20 rounded-3xl overflow-hidden relative py-14 px-10 md:px-16">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0845 0%, #0a1a3a 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.15) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 50%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-display font-bold tracking-[0.4em] text-cyan-400/70 mb-2">NOW LIVE</p>
            <h3 className="font-display font-black text-3xl md:text-4xl text-white mb-2">Shadow Dominion Raid</h3>
            <p className="text-white/50 text-sm max-w-lg">A dimensional rift has opened above the capital. Coordinate to defeat the Void Titan before time runs out.</p>
          </div>
          <Link href="/events">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-2xl cursor-pointer font-display font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
            >
              <Calendar className="w-4 h-4" />
              View Events
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
}
