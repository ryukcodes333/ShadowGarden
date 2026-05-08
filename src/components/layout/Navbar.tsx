import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Menu, Home, Database, Sparkles, Trophy, Shield, Heart, Calendar, BookOpen } from "lucide-react";

const LINKS = [
  { href: "/",          label: "Home",      icon: Home },
  { href: "/database",  label: "Database",  icon: Database },
  { href: "/summon",    label: "Summon",    icon: Sparkles },
  { href: "/rankings",  label: "Rankings",  icon: Trophy },
  { href: "/missions",  label: "Missions",  icon: Shield },
  { href: "/sanctuary", label: "Sanctuary", icon: Heart },
  { href: "/events",    label: "Events",    icon: Calendar },
  { href: "/pokedex",   label: "Pokédex",   icon: BookOpen },
];

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: logoImg } = useQuery({
    queryKey: ["navbar-logo-char"],
    queryFn: async () => {
      const res = await fetch("https://api.jikan.moe/v4/anime/48316/characters");
      if (!res.ok) return null;
      const json = await res.json();
      const main = (json.data ?? []).find((c: any) => c.role === "Main");
      return main?.character?.images?.jpg?.image_url ?? null;
    },
    staleTime: Infinity,
    retry: 1,
  });

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(6,6,15,0.88)"
          : "linear-gradient(to bottom, rgba(6,6,15,0.75), transparent)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(124,58,237,0.15)" : "none",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-violet-500/50 transition-all group-hover:border-violet-400"
                style={{ boxShadow: "0 0 18px rgba(124,58,237,0.45)" }}>
                {logoImg ? (
                  <img
                    src={logoImg}
                    alt="Shadow Garden"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #4c1d95, #0d0a20)" }}>
                    <svg viewBox="0 0 44 44" className="w-7 h-7">
                      <circle cx="22" cy="22" r="14" fill="#7c3aed" opacity="0.9"/>
                      <circle cx="28" cy="18" r="10" fill="#06060f"/>
                    </svg>
                  </div>
                )}
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border border-violet-500/30"
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-black text-lg text-white tracking-wide leading-none">Shadow Garden</p>
              <p className="text-[10px] font-mono text-violet-400/60 tracking-widest">THE EMINENCE IN SHADOW</p>
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className="relative px-4 py-2 rounded-lg cursor-pointer group transition-all">
                  <span
                    className="font-display font-bold text-sm tracking-wide transition-colors"
                    style={{ color: isActive ? "#a78bfa" : "rgba(241,245,249,0.65)" }}
                  >
                    {link.label}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  {!isActive && (
                    <div
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/summon">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer font-display font-bold text-sm text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 0 20px rgba(124,58,237,0.35)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Summon
            </motion.div>
          </Link>

          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl transition-colors cursor-pointer"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}
          >
            <Menu className="w-5 h-5 text-violet-300" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
