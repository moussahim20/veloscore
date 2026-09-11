-- VeloScore Database Schema for Cloudflare D1 / SQLite
-- Version: 0001_initial_schema.sql

-- 1. Sports Table
CREATE TABLE IF NOT EXISTS sports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0
);

-- 2. Countries Table
CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  flag TEXT NOT NULL
);

-- 3. Competitions Table
CREATE TABLE IF NOT EXISTS competitions (
  id TEXT PRIMARY KEY,
  sport_id TEXT NOT NULL REFERENCES sports(id),
  country_id TEXT NOT NULL REFERENCES countries(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo TEXT,
  season TEXT NOT NULL,
  is_top_league INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_competitions_sport ON competitions(sport_id);
CREATE INDEX IF NOT EXISTS idx_competitions_country ON competitions(country_id);

-- 4. Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  code TEXT NOT NULL,
  logo TEXT,
  country_id TEXT REFERENCES countries(id),
  stadium TEXT,
  founded INTEGER,
  manager TEXT
);

-- 5. Players Table
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  team_id TEXT REFERENCES teams(id),
  name TEXT NOT NULL,
  number INTEGER,
  position TEXT,
  rating REAL DEFAULT 7.0
);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);

-- 6. Fixtures / Matches Table
CREATE TABLE IF NOT EXISTS fixtures (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  sport_id TEXT NOT NULL REFERENCES sports(id),
  competition_id TEXT NOT NULL REFERENCES competitions(id),
  round TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  start_time TEXT NOT NULL, -- HH:MM
  timestamp INTEGER NOT NULL,
  status TEXT NOT NULL, -- SCHEDULED, LIVE, HT, FT, POSTPONED
  minute INTEGER DEFAULT 0,
  is_live INTEGER DEFAULT 0,
  venue TEXT,
  referee TEXT
);
CREATE INDEX IF NOT EXISTS idx_fixtures_date ON fixtures(date);
CREATE INDEX IF NOT EXISTS idx_fixtures_live ON fixtures(is_live);
CREATE INDEX IF NOT EXISTS idx_fixtures_comp ON fixtures(competition_id);

-- 7. Fixture Participants
CREATE TABLE IF NOT EXISTS fixture_participants (
  fixture_id TEXT NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id),
  is_home INTEGER NOT NULL,
  PRIMARY KEY (fixture_id, is_home)
);

-- 8. Fixture Scores
CREATE TABLE IF NOT EXISTS fixture_scores (
  fixture_id TEXT PRIMARY KEY REFERENCES fixtures(id) ON DELETE CASCADE,
  home_current INTEGER DEFAULT 0,
  away_current INTEGER DEFAULT 0,
  home_ht INTEGER,
  away_ht INTEGER,
  home_ft INTEGER,
  away_ft INTEGER,
  home_et INTEGER,
  away_et INTEGER,
  home_pen INTEGER,
  away_pen INTEGER
);

-- 9. Fixture Events (Goals, Cards, Subs, VAR)
CREATE TABLE IF NOT EXISTS fixture_events (
  id TEXT PRIMARY KEY,
  fixture_id TEXT NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  minute INTEGER NOT NULL,
  extra_minute INTEGER,
  type TEXT NOT NULL, -- GOAL, YELLOW_CARD, RED_CARD, SUBSTITUTION, VAR_DECISION
  team_id TEXT NOT NULL REFERENCES teams(id),
  player_name TEXT NOT NULL,
  assist_name TEXT,
  player_in TEXT,
  player_out TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_fixture_events ON fixture_events(fixture_id, minute);

-- 10. Fixture Statistics
CREATE TABLE IF NOT EXISTS fixture_statistics (
  fixture_id TEXT NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  stat_key TEXT NOT NULL,
  home_val REAL NOT NULL,
  away_val REAL NOT NULL,
  PRIMARY KEY (fixture_id, stat_key)
);

-- 11. Standings
CREATE TABLE IF NOT EXISTS standings (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id),
  season TEXT NOT NULL
);

-- 12. Standing Rows
CREATE TABLE IF NOT EXISTS standing_rows (
  id TEXT PRIMARY KEY,
  standing_id TEXT NOT NULL REFERENCES standings(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id),
  position INTEGER NOT NULL,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  form TEXT, -- e.g. "W,W,D,L,W"
  zone TEXT
);
CREATE INDEX IF NOT EXISTS idx_standing_rows ON standing_rows(standing_id, position);

-- 13. Sports Data Provider Mappings
CREATE TABLE IF NOT EXISTS provider_mappings (
  internal_id TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- match, team, competition, player
  provider_name TEXT NOT NULL, -- api-football, sportmonks, mock
  external_id TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider_name, entity_type, external_id)
);
