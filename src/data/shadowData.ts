export const shadowOperatives = [
  {
    id: "SG-001",
    name: "Alpha",
    rank: "First of the Seven",
    threat: "UR",
    specialty: "Absolute Command",
    aura: "#f59e0b",
    auraHex: "#f59e0b",
    quote: "We lurk in the shadows, and hunt the shadows.",
    bgTheme: "from-yellow-900/40 via-amber-900/20 to-transparent",
    shadowColor: "rgba(245,158,11,0.4)",
    cardCount: 9999,
    collectionPct: 100,
    powerLevel: 99999,
    status: "ACTIVE",
    clearance: "OMEGA-1",
    specialAbility: "Absolute Supremacy — All stats exceed limits",
  },
  {
    id: "SG-002",
    name: "Beta",
    rank: "Second of the Seven",
    threat: "SSR",
    specialty: "Chronicles & Grand Strategy",
    aura: "#a8b5c4",
    auraHex: "#a8b5c4",
    quote: "Everything goes according to Lord Shadow's plan.",
    bgTheme: "from-slate-600/40 via-slate-700/20 to-transparent",
    shadowColor: "rgba(168,181,196,0.4)",
    cardCount: 4821,
    collectionPct: 72,
    powerLevel: 87500,
    status: "ACTIVE",
    clearance: "OMEGA-2",
    specialAbility: "Perfect Memory — Recall any information instantly",
  },
  {
    id: "SG-003",
    name: "Gamma",
    rank: "Third of the Seven",
    threat: "SSR",
    specialty: "Commerce & Global Intelligence",
    aura: "#38bdf8",
    auraHex: "#38bdf8",
    quote: "Shadow Garden's network covers every corner of the globe.",
    bgTheme: "from-sky-700/40 via-sky-900/20 to-transparent",
    shadowColor: "rgba(56,189,248,0.4)",
    cardCount: 3640,
    collectionPct: 65,
    powerLevel: 81000,
    status: "ACTIVE",
    clearance: "OMEGA-3",
    specialAbility: "Economic Warfare — Control markets at will",
  },
  {
    id: "SG-004",
    name: "Delta",
    rank: "Fourth of the Seven",
    threat: "UR",
    specialty: "Vanguard & Close Combat",
    aura: "#ef4444",
    auraHex: "#ef4444",
    quote: "Boss! Can I hunt them now?!",
    bgTheme: "from-red-900/50 via-red-950/30 to-transparent",
    shadowColor: "rgba(239,68,68,0.5)",
    cardCount: 7812,
    collectionPct: 89,
    powerLevel: 95000,
    status: "ACTIVE",
    clearance: "OMEGA-1",
    specialAbility: "Beast Realm — Unleash primal shadow energy",
  },
  {
    id: "SG-005",
    name: "Epsilon",
    rank: "Fifth of the Seven",
    threat: "SSR",
    specialty: "Deep Cover Espionage",
    aura: "#00d17a",
    auraHex: "#00d17a",
    quote: "My slime suit is perfection. I am undetectable.",
    bgTheme: "from-emerald-900/40 via-emerald-950/20 to-transparent",
    shadowColor: "rgba(0,209,122,0.4)",
    cardCount: 2944,
    collectionPct: 58,
    powerLevel: 76000,
    status: "INFILTRATING",
    clearance: "OMEGA-4",
    specialAbility: "Shapeshifter — Perfect mimicry of any target",
  },
  {
    id: "SG-006",
    name: "Zeta",
    rank: "Sixth of the Seven",
    threat: "SSR",
    specialty: "Solo Reconnaissance",
    aura: "#c5cfd8",
    auraHex: "#c5cfd8",
    quote: "I travel alone. That is my strength.",
    bgTheme: "from-neutral-600/40 via-neutral-800/20 to-transparent",
    shadowColor: "rgba(197,207,216,0.4)",
    cardCount: 2108,
    collectionPct: 51,
    powerLevel: 72000,
    status: "FIELD OP",
    clearance: "OMEGA-5",
    specialAbility: "Shadow Step — Move without trace or sound",
  },
  {
    id: "SG-007",
    name: "Eta",
    rank: "Seventh of the Seven",
    threat: "SSR",
    specialty: "Research & Development",
    aura: "#34d399",
    auraHex: "#34d399",
    quote: "Sleep... is for when the research is complete.",
    bgTheme: "from-teal-800/40 via-teal-950/20 to-transparent",
    shadowColor: "rgba(52,211,153,0.4)",
    cardCount: 1876,
    collectionPct: 44,
    powerLevel: 68000,
    status: "LAB",
    clearance: "OMEGA-6",
    specialAbility: "Alchemical Genesis — Create life from shadow",
  },
];

export type Rarity = "N" | "R" | "SR" | "SSR" | "UR";

export interface ShadowCard {
  id: string;
  name: string;
  rarity: Rarity;
  series: string;
  element: string;
  power: number;
  ownerCount: number;
  collectionPct: number;
  ability: string;
  gradient: string;
  accentColor: string;
  imageUrl?: string;
}

export const mockCards: ShadowCard[] = [
  { id: "C-001", name: "Alpha (Awakened)", rarity: "UR", series: "Seven Shades Vol.1", element: "Light", power: 99999, ownerCount: 3, collectionPct: 0.001, ability: "Absolute Supremacy", gradient: "from-yellow-600 via-amber-500 to-orange-600", accentColor: "#f59e0b" },
  { id: "C-002", name: "Shadow (Eminence)", rarity: "UR", series: "Origin Arc", element: "Void", power: 999999, ownerCount: 1, collectionPct: 0.0001, ability: "I Am Atomic", gradient: "from-gray-900 via-gray-700 to-gray-900", accentColor: "#e0e8f0" },
  { id: "C-003", name: "Delta (Bloodlust)", rarity: "UR", series: "Seven Shades Vol.1", element: "Dark", power: 95000, ownerCount: 7, collectionPct: 0.003, ability: "Beast Realm Unleashed", gradient: "from-red-800 via-red-600 to-rose-900", accentColor: "#ef4444" },
  { id: "C-004", name: "Alpha (Coronation)", rarity: "SSR", series: "Cathedral Arc", element: "Holy", power: 88000, ownerCount: 142, collectionPct: 0.08, ability: "Divine Authority", gradient: "from-amber-600 via-yellow-500 to-amber-800", accentColor: "#f59e0b" },
  { id: "C-005", name: "Beta (Tactician)", rarity: "SSR", series: "Seven Shades Vol.1", element: "Water", power: 82000, ownerCount: 289, collectionPct: 0.15, ability: "Omniscient Planning", gradient: "from-slate-600 via-blue-700 to-slate-800", accentColor: "#94a3b8" },
  { id: "C-006", name: "Gamma (Mistress)", rarity: "SSR", series: "Seven Shades Vol.1", element: "Earth", power: 78000, ownerCount: 391, collectionPct: 0.20, ability: "Market Manipulation", gradient: "from-sky-700 via-cyan-600 to-sky-900", accentColor: "#38bdf8" },
  { id: "C-007", name: "Epsilon (Infiltrator)", rarity: "SSR", series: "Undercover Arc", element: "Shadow", power: 75000, ownerCount: 512, collectionPct: 0.25, ability: "Perfect Disguise", gradient: "from-emerald-700 via-green-600 to-emerald-900", accentColor: "#00d17a" },
  { id: "C-008", name: "Zeta (Lone Wolf)", rarity: "SSR", series: "Seven Shades Vol.2", element: "Wind", power: 71000, ownerCount: 634, collectionPct: 0.30, ability: "Shadow Step", gradient: "from-neutral-600 via-gray-500 to-neutral-800", accentColor: "#c5cfd8" },
  { id: "C-009", name: "Eta (Alchemist)", rarity: "SSR", series: "Lab Chronicles", element: "Arcane", power: 68000, ownerCount: 721, collectionPct: 0.35, ability: "Life Synthesis", gradient: "from-teal-700 via-emerald-600 to-teal-900", accentColor: "#34d399" },
  { id: "C-010", name: "Nu (Operative)", rarity: "SR", series: "Rose Operatives", element: "Shadow", power: 54000, ownerCount: 2847, collectionPct: 1.2, ability: "Shadow Clone", gradient: "from-indigo-700 via-blue-600 to-indigo-900", accentColor: "#818cf8" },
  { id: "C-011", name: "Pi (Recon)", rarity: "SR", series: "Rose Operatives", element: "Wind", power: 51000, ownerCount: 3102, collectionPct: 1.4, ability: "Vanishing Strike", gradient: "from-sky-700 via-blue-500 to-sky-900", accentColor: "#7dd3fc" },
  { id: "C-012", name: "Sigma (Guardian)", rarity: "SR", series: "Rose Operatives", element: "Earth", power: 48000, ownerCount: 4210, collectionPct: 1.8, ability: "Iron Wall Formation", gradient: "from-stone-600 via-gray-500 to-stone-800", accentColor: "#a8a29e" },
  { id: "C-013", name: "Tau (Medic)", rarity: "SR", series: "Field Ops", element: "Light", power: 45000, ownerCount: 5891, collectionPct: 2.4, ability: "Shadow Restoration", gradient: "from-lime-700 via-green-500 to-lime-900", accentColor: "#84cc16" },
  { id: "C-014", name: "Upsilon (Hacker)", rarity: "SR", series: "Cyber Division", element: "Electric", power: 43000, ownerCount: 6234, collectionPct: 2.8, ability: "System Override", gradient: "from-cyan-700 via-teal-500 to-cyan-900", accentColor: "#22d3ee" },
  { id: "C-015", name: "Phi (Sniper)", rarity: "SR", series: "Field Ops", element: "Dark", power: 41000, ownerCount: 7841, collectionPct: 3.2, ability: "One-Shot Elimination", gradient: "from-gray-700 via-slate-500 to-gray-900", accentColor: "#94a3b8" },
  { id: "C-016", name: "Chi (Saboteur)", rarity: "R", series: "Rose Operatives", element: "Fire", power: 28000, ownerCount: 18200, collectionPct: 7.5, ability: "Shadow Bomb", gradient: "from-orange-700 via-red-500 to-orange-900", accentColor: "#f97316" },
  { id: "C-017", name: "Psi (Scout)", rarity: "R", series: "Field Ops", element: "Wind", power: 24000, ownerCount: 22100, collectionPct: 9.1, ability: "Rapid Recon", gradient: "from-sky-700 via-blue-400 to-sky-900", accentColor: "#60a5fa" },
  { id: "C-018", name: "Omega (Recruit)", rarity: "R", series: "New Initiates", element: "Shadow", power: 21000, ownerCount: 31000, collectionPct: 12.4, ability: "Shadow Veil", gradient: "from-gray-600 via-slate-400 to-gray-800", accentColor: "#9ca3af" },
  { id: "C-019", name: "Lambda (Support)", rarity: "R", series: "Rose Operatives", element: "Water", power: 19000, ownerCount: 38200, collectionPct: 15.2, ability: "Aqua Shield", gradient: "from-blue-700 via-cyan-500 to-blue-900", accentColor: "#22d3ee" },
  { id: "C-020", name: "Kappa (Agent)", rarity: "N", series: "Shadow Corps", element: "Shadow", power: 8000, ownerCount: 89400, collectionPct: 35.6, ability: "Basic Infiltration", gradient: "from-gray-800 via-gray-600 to-gray-900", accentColor: "#6b7280" },
  { id: "C-021", name: "Iota (Trainee)", rarity: "N", series: "Shadow Corps", element: "Shadow", power: 5000, ownerCount: 124000, collectionPct: 48.9, ability: "Shadow Step (Basic)", gradient: "from-zinc-700 via-zinc-500 to-zinc-900", accentColor: "#71717a" },
  { id: "C-022", name: "Theta (Initiate)", rarity: "N", series: "New Initiates", element: "Shadow", power: 3000, ownerCount: 187000, collectionPct: 72.3, ability: "Beginner's Veil", gradient: "from-neutral-700 via-neutral-500 to-neutral-900", accentColor: "#737373" },
];

export const globalRankings = [
  { rank: 1, username: "ShadowLord_IX", score: 2847291, cards: 1847, missions: 2341, tier: "OMEGA", badge: "#f59e0b", streak: 847 },
  { rank: 2, username: "AlphaCrowned", score: 2619873, cards: 1623, missions: 2109, tier: "OMEGA", badge: "#a8b5c4", streak: 612 },
  { rank: 3, username: "DeltaFang", score: 2394018, cards: 1489, missions: 1987, tier: "OMEGA", badge: "#ef4444", streak: 509 },
  { rank: 4, username: "EternityRose", score: 1891234, cards: 1201, missions: 1632, tier: "SHADOW", badge: "#38bdf8", streak: 391 },
  { rank: 5, username: "VoidWalker_Z", score: 1672901, cards: 1089, missions: 1441, tier: "SHADOW", badge: "#00d17a", streak: 298 },
  { rank: 6, username: "CrimsonSpectre", score: 1448120, cards: 987, missions: 1298, tier: "SHADOW", badge: "#ef4444", streak: 241 },
  { rank: 7, username: "SilverGhost", score: 1289341, cards: 891, missions: 1104, tier: "SHADE", badge: "#c5cfd8", streak: 198 },
  { rank: 8, username: "NightHarvest", score: 1109821, cards: 804, missions: 987, tier: "SHADE", badge: "#00d17a", streak: 167 },
  { rank: 9, username: "IceVeil_Kira", score: 987102, cards: 712, missions: 841, tier: "SHADE", badge: "#38bdf8", streak: 143 },
  { rank: 10, username: "EmberTrace", score: 872349, cards: 634, missions: 712, tier: "SHADE", badge: "#f97316", streak: 112 },
  { rank: 11, username: "VexedShadow", score: 781201, cards: 589, missions: 634, tier: "OPERATIVE", badge: "#94a3b8", streak: 89 },
  { rank: 12, username: "GhostPetal", score: 692841, cards: 523, missions: 578, tier: "OPERATIVE", badge: "#00d17a", streak: 76 },
  { rank: 13, username: "TwilightBlade", score: 612389, cards: 478, missions: 512, tier: "OPERATIVE", badge: "#a78bfa", streak: 61 },
  { rank: 14, username: "AbyssRunner", score: 541027, cards: 421, missions: 467, tier: "OPERATIVE", badge: "#6b7280", streak: 54 },
  { rank: 15, username: "SilentCrown", score: 489312, cards: 387, missions: 421, tier: "OPERATIVE", badge: "#e0e8f0", streak: 48 },
  { rank: 16, username: "DawnChaser", score: 421891, cards: 342, missions: 378, tier: "AGENT", badge: "#f59e0b", streak: 41 },
  { rank: 17, username: "NebulaBolt", score: 378234, cards: 298, missions: 334, tier: "AGENT", badge: "#38bdf8", streak: 35 },
  { rank: 18, username: "HexedRose", score: 312097, cards: 256, missions: 289, tier: "AGENT", badge: "#ef4444", streak: 28 },
  { rank: 19, username: "IronShade", score: 267841, cards: 212, missions: 248, tier: "AGENT", badge: "#94a3b8", streak: 22 },
  { rank: 20, username: "StarViper_X", score: 231204, cards: 178, missions: 212, tier: "AGENT", badge: "#00d17a", streak: 17 },
];

export type MissionStatus = "ACTIVE" | "CLASSIFIED" | "COMPLETED";
export type DangerLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Mission {
  id: string;
  codename: string;
  status: MissionStatus;
  danger: DangerLevel;
  location: string;
  reward: string;
  rewardAmount: number;
  objective: string;
  briefing: string;
  timeRemaining?: string;
  completedAt?: string;
  participants: number;
  successRate: number;
}

export const missions: Mission[] = [
  {
    id: "OP-CRIMSON-01",
    codename: "OPERATION CRIMSON VEIL",
    status: "ACTIVE",
    danger: "CRITICAL",
    location: "Midgar Underground — Sector 7",
    reward: "UR Card Guarantee",
    rewardAmount: 500000,
    objective: "Neutralize the Diablos cult's dimensional gate before activation",
    briefing: "Intelligence confirms a high-ranking Diablos operative is moving a dimensional artifact through Sector 7. Intercept and eliminate before the gateway reaches critical mass. Collateral damage acceptable. Operative Alpha is on standby.",
    timeRemaining: "02:14:33",
    participants: 3,
    successRate: 71,
  },
  {
    id: "OP-SILVER-07",
    codename: "OPERATION SILVER THREAD",
    status: "ACTIVE",
    danger: "HIGH",
    location: "Rose Academy — Restricted Wing",
    reward: "SSR Card x3",
    rewardAmount: 120000,
    objective: "Extract encrypted files from the academy's sealed archive",
    briefing: "A cache of ancient magical research has been locked behind academy wards. Our contact inside has provided access timing. Move quietly — compromising academy security is not authorized. Epsilon recommended.",
    timeRemaining: "08:47:12",
    participants: 1,
    successRate: 84,
  },
  {
    id: "OP-EMBER-04",
    codename: "OPERATION EMBER PROTOCOL",
    status: "ACTIVE",
    danger: "HIGH",
    location: "Northern Border — Ice Provinces",
    reward: "SR Card x5 + Resources",
    rewardAmount: 75000,
    objective: "Establish forward operating base in enemy territory",
    briefing: "Shadow Garden requires a permanent presence in the north. Select a defensible position, neutralize local opposition, and set up automated intelligence collection. Cold weather protocols in effect.",
    timeRemaining: "23:08:55",
    participants: 8,
    successRate: 88,
  },
  {
    id: "OP-VOID-13",
    codename: "OPERATION VOID GENESIS",
    status: "CLASSIFIED",
    danger: "CRITICAL",
    location: "REDACTED",
    reward: "CLASSIFIED",
    rewardAmount: 0,
    objective: "[CLEARANCE OMEGA-1 REQUIRED]",
    briefing: "████████ ████ ███████ ██████ ████████████ ████ ███████████ authorized personnel only.",
    participants: 2,
    successRate: 0,
  },
  {
    id: "OP-MIRROR-09",
    codename: "OPERATION MIRROR LABYRINTH",
    status: "CLASSIFIED",
    danger: "HIGH",
    location: "REDACTED — DEEP COVER",
    reward: "CLASSIFIED",
    rewardAmount: 0,
    objective: "[CLEARANCE OMEGA-2 REQUIRED]",
    briefing: "████████████ double agent extraction ████████████████████ verify identity using ████████████ protocol.",
    participants: 1,
    successRate: 0,
  },
  {
    id: "OP-FROST-11",
    codename: "OPERATION FROST SIGNAL",
    status: "CLASSIFIED",
    danger: "MEDIUM",
    location: "ENCRYPTED",
    reward: "CLASSIFIED",
    rewardAmount: 0,
    objective: "[CLEARANCE OMEGA-4 REQUIRED]",
    briefing: "████ surveillance network ████████ activate sleeper cells ████████████████ upon confirmation.",
    participants: 6,
    successRate: 0,
  },
  {
    id: "OP-GHOST-02",
    codename: "OPERATION GHOST PETAL",
    status: "COMPLETED",
    danger: "MEDIUM",
    location: "Capital — Noble Quarter",
    reward: "SR Card x2",
    rewardAmount: 40000,
    objective: "Plant listening devices in the Noble Council chambers",
    briefing: "Successfully infiltrated the Noble Council quarterly summit. All 12 listening devices placed without detection. Audio quality optimal. Mission closed.",
    completedAt: "3 days ago",
    participants: 2,
    successRate: 100,
  },
  {
    id: "OP-DUSK-05",
    codename: "OPERATION DUSK HERALD",
    status: "COMPLETED",
    danger: "CRITICAL",
    location: "Shadow Manor — Inner Sanctum",
    reward: "SSR Card x2",
    rewardAmount: 180000,
    objective: "Recover Shadow's stolen research notes",
    briefing: "Notes recovered. Seven hostile agents eliminated. One escaped — tracking continues. Lord Shadow's research secured and returned.",
    completedAt: "1 week ago",
    participants: 5,
    successRate: 92,
  },
  {
    id: "OP-ECHO-08",
    codename: "OPERATION ECHO SILENCE",
    status: "COMPLETED",
    danger: "LOW",
    location: "Port City — Docks District",
    reward: "R Card x10 + Gold",
    rewardAmount: 15000,
    objective: "Intercept Diablos contraband shipment",
    briefing: "Shipment intercepted successfully. Cargo catalogued and confiscated. Three minor operatives captured for intelligence extraction. No casualties.",
    completedAt: "2 weeks ago",
    participants: 12,
    successRate: 100,
  },
];

export interface ShadowEvent {
  id: string;
  name: string;
  type: "RAID" | "LIMITED" | "SEASONAL" | "STORY" | "PVP";
  description: string;
  targetDate: string;
  reward: string;
  accentColor: string;
  isActive: boolean;
  characterIndex: number;
}

export const events: ShadowEvent[] = [
  {
    id: "EVT-001",
    name: "SHADOW DOMINION RAID",
    type: "RAID",
    description: "A dimensional rift has opened above the capital. Coordinate with fellow operatives to defeat the Void Titan before the gateway fully opens. Earn exclusive Shadow tier cards as milestone rewards.",
    targetDate: "2026-06-07T00:00:00Z",
    reward: "Shadow Card Guarantee + 100,000 Gold",
    accentColor: "#ef4444",
    isActive: true,
    characterIndex: 3,
  },
  {
    id: "EVT-002",
    name: "CRIMSON MOON FESTIVAL",
    type: "SEASONAL",
    description: "The crimson moon rises once a year. During this period, shadow magic is amplified across all group channels. Complete special moon-phase missions to earn exclusive Crimson Moon operative skins.",
    targetDate: "2026-06-21T00:00:00Z",
    reward: "UR Ticket + Crimson Moon Alpha Skin",
    accentColor: "#f59e0b",
    isActive: true,
    characterIndex: 0,
  },
  {
    id: "EVT-003",
    name: "OPERATION EMERALD DAWN",
    type: "STORY",
    description: "New story arc begins. Follow Shadow as he uncovers the truth behind the Diablos cult's deepest operation. Collect new operative cards and unlock hidden lore fragments through mission chains.",
    targetDate: "2026-05-20T00:00:00Z",
    reward: "New Story Cards + Lore Fragments",
    accentColor: "#00d17a",
    isActive: false,
    characterIndex: 4,
  },
  {
    id: "EVT-004",
    name: "SEVEN SHADES SELECTION",
    type: "LIMITED",
    description: "A rare banner featuring all Seven Shades at boosted drop rates. The only time all seven shades cards are available with a guaranteed pity. Ends permanently after this cycle — collect them all.",
    targetDate: "2026-06-01T00:00:00Z",
    reward: "Guaranteed Shades Card + Bonus Gems",
    accentColor: "#a78bfa",
    isActive: false,
    characterIndex: 1,
  },
  {
    id: "EVT-005",
    name: "FROZEN NORTH CONQUEST",
    type: "RAID",
    description: "Conquer the Ice Provinces. Claim territory for Shadow Garden against rival factions in a week-long siege. Territory control grants passive economy bonuses and exclusive region-locked cards.",
    targetDate: "2026-07-01T00:00:00Z",
    reward: "Territory Bonuses + SR Ice Province Cards",
    accentColor: "#38bdf8",
    isActive: false,
    characterIndex: 5,
  },
  {
    id: "EVT-006",
    name: "GUILD RAID CHAMPIONSHIP",
    type: "PVP",
    description: "Top guilds face off in a series of raid boss encounters. Guild treasury rewards scale with final placement. Only the strongest guilds will claim the Shadow Garden Championship title.",
    targetDate: "2026-07-15T00:00:00Z",
    reward: "Guild Treasury Boost + Champion Title",
    accentColor: "#06b6d4",
    isActive: false,
    characterIndex: 2,
  },
];
