import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import type { Competition, Match } from '../../types/sports';
import { MatchRow } from './MatchRow';
import { CountryFlag } from '../common/CountryFlag';

interface CompetitionGroupProps {
  competition: Competition;
  matches: Match[];
  favoriteMatches: string[];
  onToggleFavorite: (matchId: string) => void;
  onSelectMatch: (match: Match) => void;
  onOpenStandings: (competition: Competition) => void;
}

export const CompetitionGroup: React.FC<CompetitionGroupProps> = ({
  competition,
  matches,
  favoriteMatches,
  onToggleFavorite,
  onSelectMatch,
  onOpenStandings,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!matches.length) return null;

  return (
    <div
      id={`comp-group-${competition.id}`}
      className="mb-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs transition-colors"
    >
      {/* Group Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/70 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <CountryFlag
            countryName={competition.countryName}
            countryCode={competition.countryId}
            flagUrl={competition.countryFlag}
            className="w-5 h-3.5 shadow-xs"
            alt={competition.countryName}
          />
          <button
            onClick={() => onOpenStandings(competition)}
            className="flex items-center gap-1.5 truncate text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title={`View ${competition.name} standings`}
          >
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {competition.countryName.toUpperCase()}: {competition.name}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
              • {matches[0]?.round || competition.season}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Standings Button */}
          <button
            onClick={() => onOpenStandings(competition)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="View league table"
            aria-label={`View ${competition.name} standings`}
          >
            <Trophy className="w-3 h-3 text-amber-500" />
            <span className="hidden md:inline">Standings</span>
          </button>

          {/* Toggle Accordion */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse matches' : 'Expand matches'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Matches List */}
      {isExpanded && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {matches.map((match) => (
            <MatchRow
              key={match.id}
              match={match}
              isFavorite={favoriteMatches.includes(match.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectMatch={onSelectMatch}
            />
          ))}
        </div>
      )}
    </div>
  );
};
