import React from 'react';
import { Star } from 'lucide-react';
import type { Match } from '../../types/sports';

interface MatchRowProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (matchId: string) => void;
  onSelectMatch: (match: Match) => void;
}

export const MatchRow: React.FC<MatchRowProps> = ({
  match,
  isFavorite,
  onToggleFavorite,
  onSelectMatch,
}) => {
  const isLive = match.status === 'LIVE';
  const isHT = match.status === 'HT';
  const isFT = match.status === 'FT';
  const isPostponed = match.status === 'POSTPONED';

  // Format status badge text
  let statusDisplay = match.startTime;
  if (isLive) {
    statusDisplay = `${match.minute}'`;
  } else if (isHT) {
    statusDisplay = 'HT';
  } else if (isFT) {
    statusDisplay = 'FT';
  } else if (isPostponed) {
    statusDisplay = 'POSTP.';
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectMatch(match);
    }
  };

  const hasRedCardHome = (match.redCards?.home || 0) > 0;
  const hasRedCardAway = (match.redCards?.away || 0) > 0;

  return (
    <div
      id={`match-row-${match.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelectMatch(match)}
      onKeyDown={handleKeyDown}
      className={`group relative flex items-center justify-between px-3 py-2.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
        match.hasJustScored ? 'animate-goal-flash bg-emerald-500/10' : ''
      }`}
      aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}, status: ${match.status}, score ${match.score.current.home} to ${match.score.current.away}`}
    >
      {/* Left: Star Favorite & Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-20 sm:w-24">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(match.id);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="p-1 text-slate-300 hover:text-amber-500 dark:text-slate-600 dark:hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded"
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite
                ? 'fill-amber-500 text-amber-500'
                : 'stroke-current'
            }`}
          />
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {isLive ? (
            <div className="flex items-center gap-1 text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-dot" />
              <span>{statusDisplay}</span>
            </div>
          ) : isHT ? (
            <span className="font-bold text-amber-500 text-[11px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              HT
            </span>
          ) : isFT ? (
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              FT
            </span>
          ) : (
            <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">
              {statusDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Teams */}
      <div className="flex-1 flex flex-col justify-center min-w-0 px-2 sm:px-4">
        {/* Home Team */}
        <div className="flex items-center justify-between py-0.5">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
              {match.homeTeam.code?.substring(0, 3) || match.homeTeam.shortName.substring(0, 2)}
            </span>
            <span
              className={`truncate text-sm ${
                isLive || isFT
                  ? match.score.current.home > match.score.current.away
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 font-medium'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {match.homeTeam.shortName || match.homeTeam.name}
            </span>
            {hasRedCardHome && (
              <span
                className="w-2.5 h-3.5 bg-red-600 rounded-xs inline-block shrink-0 shadow-xs"
                title={`${match.redCards?.home} Red Card`}
              />
            )}
          </div>
          {/* Home Score */}
          <span
            className={`font-mono tabular-nums text-sm font-bold pl-2 ${
              isLive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {isLive || isFT || isHT ? match.score.current.home : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between py-0.5">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
              {match.awayTeam.code?.substring(0, 3) || match.awayTeam.shortName.substring(0, 2)}
            </span>
            <span
              className={`truncate text-sm ${
                isLive || isFT
                  ? match.score.current.away > match.score.current.home
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 font-medium'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {match.awayTeam.shortName || match.awayTeam.name}
            </span>
            {hasRedCardAway && (
              <span
                className="w-2.5 h-3.5 bg-red-600 rounded-xs inline-block shrink-0 shadow-xs"
                title={`${match.redCards?.away} Red Card`}
              />
            )}
          </div>
          {/* Away Score */}
          <span
            className={`font-mono tabular-nums text-sm font-bold pl-2 ${
              isLive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {isLive || isFT || isHT ? match.score.current.away : '-'}
          </span>
        </div>
      </div>

      {/* Right: Half time score indicator or quick arrow */}
      <div className="hidden sm:flex flex-col items-end justify-center text-[11px] font-mono text-slate-400 pl-2 shrink-0 w-12">
        {match.score.halftime && (isFT || isLive) ? (
          <span title="Half-time score">
            ({match.score.halftime.home}-{match.score.halftime.away})
          </span>
        ) : (
          <span className="text-slate-300 dark:text-slate-700 group-hover:text-slate-400 transition-colors">
            ›
          </span>
        )}
      </div>
    </div>
  );
};
