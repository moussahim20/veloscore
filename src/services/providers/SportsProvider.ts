import type {
  Sport,
  SportId,
  Competition,
  Team,
  Match,
  StandingRow,
} from '../../types/sports';

export interface SearchResults {
  teams: Team[];
  competitions: Competition[];
  matches: Match[];
}

export interface SportsProvider {
  readonly providerName: string;

  getSports(): Promise<Sport[]>;
  getCompetitions(sportId?: SportId): Promise<Competition[]>;
  getMatchesByDate(date: string, sportId?: SportId): Promise<Match[]>;
  getLiveMatches(sportId?: SportId): Promise<Match[]>;
  getMatchById(id: string): Promise<Match | null>;
  getStandings(competitionId: string): Promise<StandingRow[]>;
  getTeamById(teamId: string): Promise<Team | null>;
  getTeamMatches(teamId: string): Promise<Match[]>;
  search(query: string): Promise<SearchResults>;
}
