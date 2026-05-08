import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, MessageCircle, Heart, Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { mockCards } from "@/data/shadowData";

function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    type Drop = { x: number; y: number; speed: number; len: number; opacity: number };
    const drops: Drop[] = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      speed: 2 + Math.random() * 4, len: 12 + Math.random() * 25, opacity: 0.04 + Math.random() * 0.12,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.strokeStyle = `rgba(167,139,250,${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const TRACKS = [
  { title: "Kage no Jitsuryokusha", artist: "Shiro SAGISU", dur: "4:12", bpm: 94, mood: "Ethereal" },
  { title: "I Am Atomic", artist: "Shadow Garden OST", dur: "3:48", bpm: 128, mood: "Intense" },
  { title: "Midnight Operation", artist: "SG Records", dur: "5:01", bpm: 72, mood: "Lo-Fi" },
  { title: "Seven Shades Theme", artist: "Kagenou Ensemble", dur: "3:33", bpm: 110, mood: "Epic" },
  { title: "Rain in Midgar", artist: "Delta's Mix", dur: "4:44", bpm: 85, mood: "Ambient" },
];

const CHAT = [
  { user: "AlphaFan99", msg: "This rain sound is so calming 🌧️", color: "#a78bfa", time: "2m" },
  { user: "ShadowLord_IX", msg: "I Am Atomic slaps every single time", color: "#38bdf8", time: "4m" },
  { user: "DeltaFang", msg: "Boss! Can I hunt them now?! 🔥", color: "#ef4444", time: "6m" },
  { user: "BetaScribe", msg: "Chapter 247 just dropped. Insane.", color: "#c5cfd8", time: "8m" },
  { user: "EtaHeal", msg: "Peace and healing, fellow operatives 💚", color: "#34d399", time: "11m" },
  { user: "GammaEcon", msg: "Shadow Garden stocks are UP today 📈", color: "#fbbf24", time: "14m" },
  { user: "Operative_7", msg: "Who else is on their 4th loop of this playlist", color: "#f472b6", time: "18m" },
];

function WaveViz({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="w-1 rounded-full" style={{ background: "linear-gradient(to top, #7c3aed, #06b6d4)" }}
          animate={playing ? { height: [4, 6 + Math.random() * 22, 4] } : { height: 3 }}
          transition={{ duration: 0.3 + Math.random() * 0.5, repeat: playing ? Infinity : 0, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function Sanctuary() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [tab, setTab] = useState<"music" | "chat" | "cards">("music");
  const [chatMsg, setChatMsg] = useState("");
  const curTrack = TRACKS[track];

  const showcaseCards = mockCards.filter(c => ["UR","SSR"].includes(c.rarity)).slice(0, 6);

  return (
    <div className="min-h-screen px-6 md:px-12 max-w-[1400px] mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-display font-bold tracking-[0.4em] text-violet-400/60 uppercase mb-2">Shadow Garden</p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-white">The Sanctuary</h1>
        <p className="text-white/40 text-sm mt-1 font-sans">A hidden lounge for operatives. Rain, music, and peace.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Rain Scene */}
          <div className="relative h-48 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(160deg, #0a0720, #060414)" }}>
            <RainCanvas />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 0 30px rgba(124,58,237,0.15)" }}
                  animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Heart className="w-7 h-7 text-violet-400/60" />
                </motion.div>
                <p className="font-display font-black text-sm text-white/40 tracking-widest">THE SANCTUARY</p>
                <div className="flex justify-center gap-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} className="w-1 h-1 rounded-full bg-violet-400/30"
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "#a78bfa" }}>
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              247 online
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[["music", Music, "Music"], ["chat", MessageCircle, "Chat"], ["cards", Heart, "Cards"]] .map(([id, Icon, label]) => (
              <motion.button key={id as string} onClick={() => setTab(id as typeof tab)} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-sm cursor-pointer transition-all"
                style={{
                  background: tab === id ? "rgba(124,58,237,0.2)" : "rgba(13,10,30,0.8)",
                  border: `1px solid ${tab === id ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: tab === id ? "#a78bfa" : "rgba(241,245,249,0.4)",
                }}>
                {/* @ts-ignore */}
                <Icon className="w-4 h-4" />
                {label as string}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "music" && (
              <motion.div key="music" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-3xl p-6 space-y-5" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
                {/* Current track */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
                    <Music className="w-7 h-7 text-white" />
                    {playing && <motion.div className="absolute inset-0 rounded-2xl border border-violet-400/30" animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-lg text-white truncate">{curTrack.title}</p>
                    <p className="text-sm text-white/40 font-sans">{curTrack.artist}</p>
                    <div className="flex gap-3 mt-1 text-xs font-mono text-white/25">
                      <span>{curTrack.dur}</span>
                      <span>{curTrack.bpm} BPM</span>
                      <span style={{ color: "#a78bfa" }}>{curTrack.mood}</span>
                    </div>
                  </div>
                  <WaveViz playing={playing} />
                </div>

                {/* Waveform bar */}
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                    animate={{ width: playing ? "100%" : "35%" }} transition={{ duration: playing ? 200 : 0.5 }} />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button onClick={() => setTrack(t => (t - 1 + TRACKS.length) % TRACKS.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                    <SkipForward className="w-5 h-5 rotate-180" />
                  </motion.button>
                  <motion.button onClick={() => setPlaying(p => !p)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 24px rgba(124,58,237,0.4)" }}>
                    {playing ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
                  </motion.button>
                  <motion.button onClick={() => setTrack(t => (t + 1) % TRACKS.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                    <SkipForward className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Playlist */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {TRACKS.map((t, i) => (
                    <motion.div key={t.title} onClick={() => { setTrack(i); setPlaying(true); }} whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors"
                      style={{ background: track === i ? "rgba(124,58,237,0.15)" : "transparent", border: track === i ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent" }}>
                      <span className="font-mono text-xs w-5 text-center" style={{ color: track === i ? "#a78bfa" : "rgba(255,255,255,0.2)" }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display font-bold text-white truncate">{t.title}</p>
                        <p className="text-xs text-white/30 font-sans truncate">{t.artist}</p>
                      </div>
                      <span className="text-xs font-mono text-white/25">{t.dur}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-3xl overflow-hidden" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {CHAT.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black flex-shrink-0"
                        style={{ background: `${c.color}20`, border: `1px solid ${c.color}40`, color: c.color }}>{c.user[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-display font-bold" style={{ color: c.color }}>{c.user}</span>
                          <span className="text-[10px] text-white/20 font-mono">{c.time} ago</span>
                        </div>
                        <p className="text-sm text-white/60 font-sans leading-snug">{c.msg}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/5">
                  <div className="flex gap-2">
                    <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Say something to the operatives..."
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none font-sans"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.2)" }} />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setChatMsg("")}
                      className="px-4 py-2.5 rounded-xl font-display font-bold text-sm text-white cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                      Send
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "cards" && (
              <motion.div key="cards" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {showcaseCards.map((card, i) => {
                  const colors = { UR: "#ef4444", SSR: "#fbbf24", SR: "#a78bfa", R: "#38bdf8", N: "#6b7280" };
                  const c = colors[card.rarity as keyof typeof colors];
                  return (
                    <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, scale: 1.03, boxShadow: `0 0 30px ${c}30` }} transition={{ delay: i * 0.07 }}
                      className="rounded-2xl overflow-hidden cursor-pointer"
                      style={{ border: `2px solid ${c}40`, background: "rgba(13,10,30,0.8)" }}>
                      <div className="h-28 relative flex items-center justify-center"
                        style={{ background: `linear-gradient(160deg, ${c}20, rgba(13,10,30,0.9))` }}>
                        <span className="font-display font-black text-5xl opacity-10 text-white">{card.name[0]}</span>
                        <span className="absolute top-2 right-2 font-display font-black text-xs px-1.5 py-0.5 rounded"
                          style={{ color: c, background: `${c}20`, border: `1px solid ${c}30` }}>{card.rarity}</span>
                      </div>
                      <div className="p-3">
                        <p className="font-display font-bold text-sm text-white truncate">{card.name}</p>
                        <p className="text-xs text-white/30 font-sans truncate">{card.series}</p>
                        <div className="flex justify-between mt-2 text-xs font-mono">
                          <span style={{ color: c }}>{card.element}</span>
                          <span className="text-white/25">{card.power.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar — online status */}
        <div className="space-y-5">
          <div className="rounded-3xl p-5" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
            <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-4">OPERATIVES ONLINE</p>
            <div className="space-y-2">
              {CHAT.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black"
                    style={{ background: `${c.color}20`, color: c.color }}>{c.user[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-display font-bold text-white/70 truncate">{c.user}</p>
                  </div>
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />
                </div>
              ))}
              <p className="text-xs text-white/20 font-mono pt-2">+240 more operatives</p>
            </div>
          </div>

          <div className="rounded-3xl p-5 space-y-3" style={{ background: "rgba(13,10,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
            <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-4">SANCTUARY VIBES</p>
            {[
              { l: "Chill Factor", v: 94 },
              { l: "Rain Intensity", v: 78 },
              { l: "Shadow Aura", v: 100 },
            ].map(s => (
              <div key={s.l}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40 font-sans">{s.l}</span>
                  <span className="font-mono text-violet-400">{s.v}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                    initial={{ width: 0 }} animate={{ width: `${s.v}%` }} transition={{ delay: 0.5, duration: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
