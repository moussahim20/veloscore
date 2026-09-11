export type SportId =
  | 'football'
  | 'basketball'
  | 'tennis'
  | 'ice-hockey'
  | 'handball'
  | 'volleyball'
  | 'baseball'
  | 'cricket'
  | 'motorsport';

export interface Sport {
  id: SportId;
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
  liveCount: number;
  totalCount: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
}

export interface Competition {
  id: string;
  sportId: SportId;
  countryId: string;
  countryName: string;
  countryFlag: string;
  name: string;
  slug: string;
  logo?: string;
  season: string;
  isTopLeague?: boolean;
  order?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logo?: string;
  countryId?: string;
  countryName?: string;
  stadium?: string;
  stadiumCapacity?: number;
  city?: string;
  founded?: number;
  manager?: string;
  form?: ('W' | 'D' | 'L')[];
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'HT'
  | 'FT'
  | 'ET'
  | 'PEN'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'INTERRUPTED';

export interface ScoreDetail {
  home: number;
  away: number;
}

export interface MatchScore {
  current: ScoreDetail;
  halftime?: ScoreDetail;
  fulltime?: ScoreDetail;
  extraTime?: ScoreDetail;
  penalties?: ScoreDetail;
}

export type MatchEventType =
  | 'GOAL'
  | 'OWN_GOAL'
  | 'PENALTY_GOAL'
  | 'MISSED_PENALTY'
  | 'YELLOW_CARD'
  | 'SECOND_YELLOW'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'VAR_DECISION'
  | 'PERIOD_START'
  | 'PERIOD_END';

export interface MatchEvent {
  id: string;
  matchId: string;
  minute: number;
  extraMinute?: number;
  type: MatchEventType;
  teamId: string;
  playerName: string;
  assistName?: string;
  playerIn?: string;
  playerOut?: string;
  detail?: string;
}

export interface MatchStatistics {
  possession: [number, number]; // [home, away] %
  expectedGoals: [number, number];
  totalShots: [number, number];
  shotsOnTarget: [number, number];
  shotsOffTarget: [number, number];
  blockedShots: [number, number];
  cornerKicks: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  bigChances: [number, number];
  goalkeeperSaves: [number, number];
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating?: number;
  isCaptain?: boolean;
  x?: number; // 0-100 coordinates for pitch positioning
  y?: number;
}

export interface TeamLineup {
  teamId: string;
  formation: string;
  manager: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface StandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  zone?: 'CHAMPIONS_LEAGUE' | 'EUROPA_LEAGUE' | 'CONFERENCE_LEAGUE' | 'RELEGATION' | 'PROMOTION';
}

export interface HeadToHeadStats {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
  recentMeetings: Array<{
    id: string;
    date: string;
    competitionName: string;
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number;
    awayScore: number;
  }>;
}

export interface Match {
  id: string;
  slug: string;
  sportId: SportId;
  competition: Competition;
  country: Country;
  season: string;
  round: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  timestamp: number;
  status: MatchStatus;
  minute?: number;
  isLive: boolean;
  hasJustScored?: 'home' | 'away';
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  redCards?: { home: number; away: number };
  events?: MatchEvent[];
  stats?: MatchStatistics;
  lineups?: {
    home: TeamLineup;
    away: TeamLineup;
  };
  h2h?: HeadToHeadStats;
  venue?: string;
  referee?: string;
}

export interface RealtimeScoreDelta {
  type: 'score_update' | 'event_added' | 'status_change' | 'minute_tick';
  matchId: string;
  score?: MatchScore;
  status?: MatchStatus;
  minute?: number;
  event?: MatchEvent;
  hasJustScored?: 'home' | 'away';
}
