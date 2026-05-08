# Shadow Garden — Deploy to Render

Fan site for The Eminence in Shadow. Anime MMORPG-style experience with live leaderboard, card summon, events, and more.

## Deploy in 3 steps

### 1. Push to GitHub
Push this entire folder as a GitHub repository.

### 2. Create Static Site on Render
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### 3. Add Environment Variables in Render
| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `VITE_SHOOB_API_URL` | Your Shoob scraper API URL on Render |

The site works **without any env vars** — it shows mock data as a beautiful fallback.

## Local development
```bash
npm install
cp .env.example .env    # fill in your values
npm run dev             # → http://localhost:5173
```

## Features
- Live leaderboard from your bot's Supabase database
- Card summon with real anime cards from your scraper API
- 6 events with live per-second countdowns (1–1.5 months out)
- Real anime character images from Jikan API
- 8 pages: Home, Database, Summon, Rankings, Missions, Sanctuary, Events, Pokédex
