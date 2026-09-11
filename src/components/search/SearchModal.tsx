import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Trophy, Shield, Calendar } from 'lucide-react';
import type { Team, Competition, Match } from '../../types/sports';
import { getSportsProvider } from '../../services/providers/SportsProviderFactory';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId: string) => void;
  onSelectCompetition: (compId: string) => void;
  onSelectMatch: (match: Match) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  onSelectCompetition,
  onSelectMatch,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    teams: Team[];
    competitions: Competition[];
    matches: Match[];
  }>({ teams: [], competitions: [], matches: [] });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ teams: [], competitions: [], matches: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isOpen) {
        e.preventDefault();
        // Triggered by parent if needed
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ teams: [], competitions: [], matches: [] });
      return;
    }

    const timer = setTimeout(async () => {
      const res = await getSportsProvider().search(query);
      setResults(res);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const hasResults =
    results.teams.length > 0 ||
    results.competitions.length > 0 ||
    results.matches.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search teams and leagues"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, leagues, or matches..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() && !hasResults && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No results found for "{query}"
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Type to search Premier League, Champions League, Real Madrid, Arsenal, Barcelona...
            </div>
          )}

          {/* Competitions */}
          {results.competitions.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Competitions
              </div>
              <div className="space-y-1">
                {results.competitions.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onSelectCompetition(comp.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {comp.name}
                      </span>
                    </span>
                    <span className="text-slate-400">{comp.countryName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {results.teams.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Teams
              </div>
              <div className="space-y-1">
                {results.teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      onSelectTeam(team.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {team.name}
                      </span>
                    </span>
                    <span className="text-slate-400 font-mono">{team.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matches */}
          {results.matches.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Matches
              </div>
              <div className="space-y-1">
                {results.matches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => {
                      onSelectMatch(match);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors text-xs"
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                      </span>
                    </span>
                    <span className="font-mono text-slate-400 shrink-0">
                      {match.date} • {match.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
