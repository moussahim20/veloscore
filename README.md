# ⚽ VeloScore - High-Performance Sports Live-Score Platform

**VeloScore** is an ultra-fast, mobile-first multi-sport live scoreboard and sports information platform engineered for real-time scores, match statistics, lineups, and league tables. Built with clean typography, high information density, and accessibility inspired by leading platforms such as Flashscore and SofaScore, while maintaining a distinct, original visual identity.

---

## ⚡ Key Highlights

* **Speed & Web Vitals:** Zero layout shift (CLS), minimal client runtime overhead, rapid hydration.
* **Multi-Sport Architecture:** Football (Soccer) reference sport with ready schema and adapters for Basketball, Tennis, Ice Hockey, and more.
* **Provider Abstraction Layer:** Completely decoupled from external vendor schemas (`SportsProvider` interface with interchangeable mock and real API adapters).
* **Realtime Engine:** Low-latency score delta protocol, animated score flash highlights, live minute ticker, and optional Web Audio goal ping.
* **Interactive Pitch & Lineups:** 4-3-3 / 4-2-3-1 pitch visualizer with player ratings, captains, and bench substitutes.
* **Full Match Statistics:** Comparative visual bar charts for Possession %, xG, Shots on Target, Corners, Fouls, Offsides, and Saves.
* **Full Standings & Head-to-Head:** Color-coded UEFA qualification and relegation zones, form pills (W/D/L), and historic H2H encounters.
* **Google AdSense Ready:** Strict pre-allocated CSS dimensions for zero CLS, fully compliant non-deceptive placements, documented `ads.txt`.
* **SEO & GEO/AEO Engineered:** Native JSON-LD `SportsEvent` schemas, Open Graph, Twitter cards, semantic HTML, `robots.txt`, and `sitemap.xml`.
* **Privacy Compliant:** Discreet EEA/UK GDPR cookie consent banner, detailed Privacy Policy, Terms of Service, and Cookie disclosures.

---

## 🏛️ Architecture & Project Structure

```text
├── migrations/
│   └── 0001_initial_schema.sql       # Cloudflare D1 / SQLite complete sports schema
├── public/
│   ├── ads.txt                       # Authorized digital sellers declaration
│   ├── favicon.svg                   # Vector brand identity icon
│   ├── robots.txt                    # Search crawler rules & sitemap pointer
│   └── sitemap.xml                   # Canonical XML sitemap
├── src/
│   ├── components/
│   │   ├── ads/                      # Compliant AdSense container (<AdSlot />)
│   │   ├── competition/              # Full league table and standings view
│   │   ├── layout/                   # Header, LeftSidebar, RightSidebar, Footer
│   │   ├── match/                    # Rich match view (Timeline, Stats, Lineups, H2H)
│   │   ├── scoreboard/               # DateNavigator, CompetitionGroup, MatchRow
│   │   ├── search/                   # Instant debounced search modal
│   │   └── trust/                    # About, Privacy, Terms, Cookies, Contact, GDPR banner
│   ├── config/
│   │   └── ads.ts                    # Ad slots configuration and dimensions
│   ├── data/
│   │   └── mockSportsData.ts         # Realistic multi-league sports dataset
│   ├── services/
│   │   ├── favorites/                # LocalStorage favorites service
│   │   ├── providers/                # SportsProvider interface, Mock & API adapters
│   │   └── realtime/                 # Real-time event ticker & Web Audio goal alert
│   ├── types/
│   │   ├── ads.ts                    # Ad layout and placement interfaces
│   │   └── sports.ts                 # Domain models (Match, Team, Event, Lineup, Stats)
│   ├── App.tsx                       # Core application coordinator
│   ├── index.css                     # Tailwind CSS & design tokens
│   └── main.tsx                      # Application mounting entrypoint
├── tests/
│   └── sports.test.ts                # Unit and integration test suite
├── .env.example                      # Production and local environment variables
├── wrangler.jsonc                    # Cloudflare Workers & D1 configuration
└── package.json                      # Build scripts and dependencies
```

---

## 💾 Database Schema (Cloudflare D1 / SQLite)

The schema is defined in `migrations/0001_initial_schema.sql` and includes:

* `sports` & `countries`
* `competitions` & `seasons`
* `teams`, `venues`, `players`
* `fixtures` (indexed on `date`, `is_live`, `competition_id`)
* `fixture_participants` & `fixture_scores`
* `fixture_events` (Goals, Yellow/Red Cards, VAR decisions, Substitutions)
* `fixture_statistics` (Possession, xG, Shots, Corners, Fouls)
* `standings` & `standing_rows`
* `provider_mappings` (Maps internal IDs to external provider IDs like `api-football` or `sportmonks`)

To apply the migration on Cloudflare D1:
```bash
npx wrangler d1 migrations apply veloscore-db --remote
```

---

## 🔌 Sports Provider Abstraction Layer

The application interacts strictly with the `SportsProvider` interface (`src/services/providers/SportsProvider.ts`):

```typescript
export interface SportsProvider {
  getSports(): Promise<Sport[]>;
  getCompetitions(sportId?: SportId): Promise<Competition[]>;
  getMatchesByDate(date: string, sportId?: SportId): Promise<Match[]>;
  getLiveMatches(sportId?: SportId): Promise<Match[]>;
  getMatchById(id: string): Promise<Match | null>;
  getStandings(competitionId: string): Promise<StandingRow[]>;
  getTeamById(teamId: string): Promise<Team | null>;
  search(query: string): Promise<SearchResults>;
}
```

### Connecting a Real Sports API

1. In `.env`, set:
   ```env
   SPORTS_PROVIDER=api-football
   SPORTS_API_KEY=your_actual_api_key
   ```
2. The `SportsProviderFactory` will automatically activate `ApiFootballProvider` without requiring any changes to UI components.

---

## 📡 Realtime Architecture

* **Delta Messaging:** Broadcasts minimal payload deltas:
  ```json
  {
    "type": "score_update",
    "matchId": "m-ars-liv-1",
    "score": { "current": { "home": 3, "away": 1 } },
    "minute": 75,
    "event": { "type": "GOAL", "playerName": "Kai Havertz" },
    "hasJustScored": "home"
  }
  ```
* **Score Flash Animation:** Visual green glow highlighting changes instantaneously.
* **Audio Alerts:** Built-in dual-tone synthesizer (A5 + E6 harmonic ping) that sounds on goals when audio is enabled by the user.

---

## 📈 Google AdSense Monetization & CLS Safety

* **Zero Layout Shift:** Every `<AdSlot />` container enforces strict `minHeight` styling (90px for leaderboards, 250px for sidebar rectangles) reserving space before script execution.
* **Policy Compliant:** Positioned with generous spacing away from interactive match rows, score digits, and tab navigation.
* **Authorized Sellers:** Documented in `/public/ads.txt`.
* **Switching from Demo to Live Ads:**
  In `src/config/ads.ts`:
  ```typescript
  export const ADS_CONFIG = {
    isDevelopmentMode: false,
    publisherId: 'pub-YOUR_ACTUAL_16_DIGIT_ID',
    enabled: true
  };
  ```

---

## 🛠️ Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Type check & lint
npm run lint

# 4. Start local development server
npm run dev
```

---

## ☁️ Cloudflare Deployment Guide

1. Ensure Wrangler is installed:
   ```bash
   npm install -g wrangler
   ```
2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```
3. Create your Cloudflare D1 database:
   ```bash
   wrangler d1 create veloscore-db
   ```
   Copy the `database_id` into `wrangler.jsonc`.
4. Apply the database migrations:
   ```bash
   wrangler d1 execute veloscore-db --file=migrations/0001_initial_schema.sql
   ```
5. Build and deploy:
   ```bash
   npm run build
   npx wrangler deploy
   ```

---

## 📋 Production Launch Placeholders Checklist

Before pointing your custom domain in production, supply your real details:
- [ ] **Brand Domain:** Point DNS to Cloudflare Workers / Pages (`veloscore.live`).
- [ ] **AdSense ID:** Update `ADSENSE_PUBLISHER_ID` in `.env` and `public/ads.txt`.
- [ ] **Provider API:** Enter `SPORTS_API_KEY` in environment secrets.
- [ ] **Business Contact:** Update placeholder address in `/src/components/trust/TrustPages.tsx`.
