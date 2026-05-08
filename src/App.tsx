import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Drawer } from "@/components/layout/Drawer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ParticleSystem } from "@/components/layout/ParticleSystem";
import { AnimatePresence } from "framer-motion";

import Home from "@/pages/home";
import Database from "@/pages/database";
import Summon from "@/pages/summon";
import Rankings from "@/pages/rankings";
import Missions from "@/pages/missions";
import Sanctuary from "@/pages/sanctuary";
import Events from "@/pages/events";
import Pokedex from "@/pages/pokedex";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/database" component={Database} />
        <Route path="/summon" component={Summon} />
        <Route path="/rankings" component={Rankings} />
        <Route path="/missions" component={Missions} />
        <Route path="/sanctuary" component={Sanctuary} />
        <Route path="/events" component={Events} />
        <Route path="/pokedex" component={Pokedex} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base="">
          <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            <div className="scanline" />
            <ParticleSystem />
            <CustomCursor />
            <Navbar onMenuClick={() => setDrawerOpen(true)} />
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <main className="pt-20 relative z-10">
              <Router />
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
