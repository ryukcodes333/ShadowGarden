import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { X, Home, Database, Sparkles, Trophy, Shield, Heart, Calendar, BookOpen } from "lucide-react";

const LINKS = [
  { href: "/",          label: "Home",        icon: Home,      color: "#a78bfa" },
  { href: "/database",  label: "Database",    icon: Database,  color: "#38bdf8" },
  { href: "/summon",    label: "Summon",       icon: Sparkles,  color: "#fbbf24" },
  { href: "/rankings",  label: "Rankings",    icon: Trophy,    color: "#f97316" },
  { href: "/missions",  label: "Missions",    icon: Shield,    color: "#ef4444" },
  { href: "/sanctuary", label: "Sanctuary",   icon: Heart,     color: "#f472b6" },
  { href: "/events",    label: "Events",      icon: Calendar,  color: "#06b6d4" },
  { href: "/pokedex",   label: "Pokédex",     icon: BookOpen,  color: "#10b981" },
];

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col overflow-hidden"
            style={{ background: "linear-gradient(160deg, #0d0a20 0%, #090714 100%)", borderRight: "1px solid rgba(124,58,237,0.25)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.12) 0%, transparent 60%)" }}
            />

            <div className="relative flex items-center justify-between p-5 border-b border-violet-900/30">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.myanimelist.net/images/anime/1441/126927.jpg"
                  alt="Shadow Garden"
                  className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/60"
                  style={{ boxShadow: "0 0 12px rgba(124,58,237,0.5)" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div>
                  <p className="font-display font-black text-sm text-white tracking-wide leading-tight">Shadow Garden</p>
                  <p className="text-xs text-violet-400/70 font-sans">v2.0 — OMEGA</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto">
              {LINKS.map((link, i) => {
                const isActive = location === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={onClose}
                      className="relative flex items-center gap-4 mx-3 px-4 py-3.5 rounded-xl mb-1 cursor-pointer transition-all group"
                      style={{
                        background: isActive ? `${link.color}15` : "transparent",
                        border: isActive ? `1px solid ${link.color}30` : "1px solid transparent",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="drawer-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                          style={{ background: link.color }}
                        />
                      )}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                        style={{ background: `${link.color}20`, border: `1px solid ${link.color}30` }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ color: link.color }} />
                      </div>
                      <span
                        className="font-display font-bold text-sm tracking-wide transition-colors"
                        style={{ color: isActive ? link.color : "rgba(241,245,249,0.8)" }}
                      >
                        {link.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="relative p-5 border-t border-violet-900/30">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { v: "247K", l: "Users" },
                  { v: "8.4M", l: "Cards" },
                  { v: "1.2M", l: "Ops" },
                ].map(s => (
                  <div key={s.l} className="py-2 rounded-lg" style={{ background: "rgba(124,58,237,0.08)" }}>
                    <p className="font-display font-black text-sm" style={{ color: "#a78bfa" }}>{s.v}</p>
                    <p className="text-xs text-white/40 font-sans">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
