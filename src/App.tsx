import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Match,
  SportId,
  Competition,
  Team,
  StandingRow,
  RealtimeScoreDelta,
} from './types/sports';
import { getSportsProvider } from './services/providers/SportsProviderFactory';
import { realtimeService } from './services/realtime/RealtimeService';
import { FavoritesService } from './services/favorites/FavoritesService';

import { Header } from './components/layout/Header';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Footer } from './components/layout/Footer';
import { DateNavigator, MatchFilterTab } from './components/scoreboard/DateNavigator';
import { CompetitionGroup } from './components/scoreboard/CompetitionGroup';
import { MatchDetailView } from './components/match/MatchDetailView';
import { CompetitionView } from './components/competition/CompetitionView';
import { TeamView } from './components/team/TeamView';
import { SearchModal } from './components/search/SearchModal';
import { TrustPages } from './components/trust/TrustPages';
import { CookieConsentBanner } from './components/trust/CookieConsentBanner';
import { AdSlot } from './components/ads/AdSlot';

import { Radio, AlertCircle, Star } from 'lucide-react';

export function App() {
  // Navigation & Filter State
  const [currentSport, setCurrentSport] = useState<SportId>('football');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-11');
  const [activeFilter, setActiveFilter] = useState<MatchFilterTab>('ALL');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | undefined>();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Active Views
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedCompView, setSelectedCompView] = useState<Competition | null>(null);
  const [compStandings, setCompStandings] = useState<StandingRow[]>([]);
  const [activeTrustPage, setActiveTrustPage] = useState<'about' | 'privacy' | 'terms' | 'cookies' | 'contact' | null>(null);

  // Search & Settings State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Data State
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize Dark Mode on HTML tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial Data Load
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const provider = getSportsProvider();
      const [allCompetitions, allMatches] = await Promise.all([
        provider.getCompetitions(currentSport),
        provider.getMatchesByDate(selectedDate, currentSport),
      ]);
      setCompetitions(allCompetitions);
      setMatches(allMatches);
      setFavoriteMatches(FavoritesService.getFavorites().matches);
      setIsLoading(false);
    }
    loadInitialData();
  }, [currentSport, selectedDate]);

  // Realtime Live Match Listener
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((delta: RealtimeScoreDelta) => {
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id === delta.matchId) {
            const updatedMatch: Match = {
              ...m,
              minute: delta.minute !== undefined ? delta.minute : m.minute,
              score: delta.score ? delta.score : m.score,
              status: delta.status ? delta.status : m.status,
              hasJustScored: delta.hasJustScored,
              events: delta.event ? [...(m.events || []), delta.event] : m.events,
            };

            // If user currently inspecting this match, update active view too
            if (selectedMatch && selectedMatch.id === m.id) {
              setSelectedMatch(updatedMatch);
            }

            return updatedMatch;
          }
          return m;
        })
      );
    });

    return () => unsubscribe();
  }, [selectedMatch]);

  // Favorites Toggle
  const handleToggleFavorite = useCallback((matchId: string) => {
    FavoritesService.toggleMatchFavorite(matchId);
    setFavoriteMatches([...FavoritesService.getFavorites().matches]);
  }, []);

  // Open Standings Handler
  const handleOpenStandings = useCallback(async (comp: Competition) => {
    setSelectedMatch(null);
    setSelectedTeam(null);
    setActiveTrustPage(null);
    const standings = await getSportsProvider().getStandings(comp.id);
    setCompStandings(standings);
    setSelectedCompView(comp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open Team Handler
  const handleOpenTeam = useCallback(async (teamId: string) => {
    setSelectedMatch(null);
    setSelectedCompView(null);
    setActiveTrustPage(null);
    const team = await getSportsProvider().getTeamById(teamId);
    if (team) {
      setSelectedTeam(team);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Open Match Handler
  const handleSelectMatch = useCallback((match: Match) => {
    setSelectedTeam(null);
    setSelectedCompView(null);
    setActiveTrustPage(null);
    setSelectedMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigation Home Reset
  const handleNavigateHome = useCallback(() => {
    setSelectedMatch(null);
    setSelectedTeam(null);
    setSelectedCompView(null);
    setActiveTrustPage(null);
    setSelectedCompetitionId(undefined);
    setShowOnlyFavorites(false);
  }, []);

  // Live Matches Count
  const liveCount = useMemo(() => {
    return matches.filter((m) => m.isLive).length;
  }, [matches]);

  // Filter Matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // 1. Sport filter
      if (m.sportId !== currentSport) return false;

      // 2. Tab filter
      if (activeFilter === 'LIVE' && !m.isLive) return false;
      if (activeFilter === 'FINISHED' && m.status !== 'FT') return false;
      if (activeFilter === 'SCHEDULED' && m.status !== 'SCHEDULED') return false;

      // 3. Favorites filter
      if (showOnlyFavorites && !favoriteMatches.includes(m.id)) return false;

      // 4. Sidebar League filter
      if (selectedCompetitionId && m.competition.id !== selectedCompetitionId) {
        return false;
      }

      return true;
    });
  }, [
    matches,
    currentSport,
    activeFilter,
    showOnlyFavorites,
    favoriteMatches,
    selectedCompetitionId,
  ]);

  // Group filtered matches by competition
  const groupedMatches = useMemo(() => {
    const map = new Map<string, { comp: Competition; matches: Match[] }>();

    filteredMatches.forEach((m) => {
      if (!map.has(m.competition.id)) {
        map.set(m.competition.id, { comp: m.competition, matches: [] });
      }
      map.get(m.competition.id)!.matches.push(m);
    });

    return Array.from(map.values());
  }, [filteredMatches]);

  // Matches for team page view if selected
  const teamMatches = useMemo(() => {
    if (!selectedTeam) return [];
    return matches.filter(
      (m) => m.homeTeam.id === selectedTeam.id || m.awayTeam.id === selectedTeam.id
    );
  }, [selectedTeam, matches]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Header */}
      <Header
        currentSport={currentSport}
        onSelectSport={(sport) => {
          setCurrentSport(sport);
          handleNavigateHome();
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => {
          setShowOnlyFavorites(!showOnlyFavorites);
          handleNavigateHome();
        }}
        favoriteCount={favoriteMatches.length}
        liveMatchesCount={liveCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const newState = !soundEnabled;
          setSoundEnabled(newState);
          realtimeService.setSoundEnabled(newState);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onNavigateHome={handleNavigateHome}
        onOpenPage={(page: any) => {
          setSelectedMatch(null);
          setSelectedTeam(null);
          setSelectedCompView(null);
          setActiveTrustPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* VIEW 1: Trust / Policy Page */}
        {activeTrustPage ? (
          <TrustPages
            page={activeTrustPage}
            onBack={() => setActiveTrustPage(null)}
          />
        ) : selectedMatch ? (
          /* VIEW 2: Match Detail View */
          <MatchDetailView
            match={selectedMatch}
            onBack={() => setSelectedMatch(null)}
            isFavorite={favoriteMatches.includes(selectedMatch.id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenTeam={handleOpenTeam}
            onOpenCompetition={(compId) => {
              const comp = competitions.find((c) => c.id === compId);
              if (comp) handleOpenStandings(comp);
            }}
          />
        ) : selectedCompView ? (
          /* VIEW 3: Full Competition / Standings View */
          <CompetitionView
            competition={selectedCompView}
            standings={compStandings}
            onBack={() => setSelectedCompView(null)}
            onOpenTeam={handleOpenTeam}
          />
        ) : selectedTeam ? (
          /* VIEW 4: Team Profile View */
          <TeamView
            team={selectedTeam}
            matches={teamMatches}
            favoriteMatches={favoriteMatches}
            onToggleFavorite={handleToggleFavorite}
            onSelectMatch={handleSelectMatch}
            onBack={() => setSelectedTeam(null)}
          />
        ) : (
          /* VIEW 5: Primary Live Scoreboard with 3-Column Layout */
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Left Column: Leagues & Favorites Sidebar */}
            <LeftSidebar
              competitions={competitions}
              selectedCompetitionId={selectedCompetitionId}
              onSelectCompetition={(id) =>
                setSelectedCompetitionId(id === selectedCompetitionId ? undefined : id)
              }
              showOnlyFavorites={showOnlyFavorites}
              onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
              favoriteCount={favoriteMatches.length}
            />

            {/* Center Column: Date Navigator + Grouped Match Feed */}
            <section
              id="main-scoreboard-feed"
              aria-label="Today's Live Scores"
              className="flex-1 w-full min-w-0"
            >
              {/* Top Banner Ad with strictly reserved CLS dimensions */}
              <AdSlot placement="home_feed_top" />

              {/* Date Navigator & Status Filter */}
              <DateNavigator
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                activeFilter={activeFilter}
                onChangeFilter={setActiveFilter}
                liveCount={liveCount}
              />

              {/* Active Filter Indicator */}
              {(selectedCompetitionId || showOnlyFavorites) && (
                <div className="flex items-center justify-between px-3 py-2 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>
                    Filtered by:{' '}
                    {showOnlyFavorites
                      ? 'My Favorites'
                      : competitions.find((c) => c.id === selectedCompetitionId)?.name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCompetitionId(undefined);
                      setShowOnlyFavorites(false);
                    }}
                    className="hover:underline font-bold"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Match Feed Content */}
              {isLoading ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-8 h-8 mx-auto border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-medium">Loading live scoreboards...</p>
                </div>
              ) : groupedMatches.length === 0 ? (
                /* Empty States */
                <div className="p-8 sm:p-12 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    {showOnlyFavorites ? (
                      <Star className="w-6 h-6 text-amber-500" />
                    ) : activeFilter === 'LIVE' ? (
                      <Radio className="w-6 h-6 text-red-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {showOnlyFavorites
                      ? 'No Favorite Matches Selected'
                      : activeFilter === 'LIVE'
                      ? 'No Live Games at this Moment'
                      : 'No Matches Scheduled for this Date'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {showOnlyFavorites
                      ? 'Click the star icon next to any match or team to pin it to your favorites.'
                      : activeFilter === 'LIVE'
                      ? 'Check the "All" or "Upcoming" tab to view upcoming fixtures.'
                      : 'Try selecting Today or Yesterday from the date bar above.'}
                  </p>
                  {(showOnlyFavorites || activeFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setShowOnlyFavorites(false);
                        setActiveFilter('ALL');
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Show All Today's Matches
                    </button>
                  )}
                </div>
              ) : (
                /* Groups of Matches */
                <div>
                  {groupedMatches.map((group, idx) => (
                    <React.Fragment key={group.comp.id}>
                      <CompetitionGroup
                        competition={group.comp}
                        matches={group.matches}
                        favoriteMatches={favoriteMatches}
                        onToggleFavorite={handleToggleFavorite}
                        onSelectMatch={handleSelectMatch}
                        onOpenStandings={handleOpenStandings}
                      />
                      {/* Mid-feed AdSlot after second league */}
                      {idx === 1 && <AdSlot placement="home_feed_mid" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </section>

            {/* Right Column: Featured Matches & Non-Intrusive Ad */}
            <RightSidebar
              trendingMatches={matches.filter((m) => m.isLive || m.status === 'SCHEDULED')}
              onSelectMatch={handleSelectMatch}
              onOpenPage={(page: any) => {
                setActiveTrustPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* 3. Search Modal Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTeam={handleOpenTeam}
        onSelectCompetition={(compId) => {
          const comp = competitions.find((c) => c.id === compId);
          if (comp) handleOpenStandings(comp);
        }}
        onSelectMatch={handleSelectMatch}
      />

      {/* 4. Compliant Cookie Consent Banner */}
      <CookieConsentBanner
        onOpenPolicy={() => {
          setActiveTrustPage('privacy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Accessible Footer */}
      <Footer
        onOpenPage={(page) => {
          setSelectedMatch(null);
          setSelectedTeam(null);
          setSelectedCompView(null);
          setActiveTrustPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
