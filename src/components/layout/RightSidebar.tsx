import React from 'react';
import { Flame, Info, CheckCircle } from 'lucide-react';
import type { Match } from '../../types/sports';
import { AdSlot } from '../ads/AdSlot';

interface RightSidebarProps {
  trendingMatches: Match[];
  onSelectMatch: (match: Match) => void;
  onOpenPage: (page: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  trendingMatches,
  onSelectMatch,
  onOpenPage,
}) => {
  return (
    <aside
      id="right-editorial-sidebar"
      aria-label="Trending matches and information"
      className="w-full lg:w-72 shrink-0 space-y-4"
    >
      {/* Trending Matches Widget */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
        <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>Featured Games</span>
        </div>

        <div className="space-y-1.5">
          {trendingMatches.slice(0, 3).map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60 text-left transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="truncate">{match.competition.name}</span>
                {match.isLive ? (
                  <span className="text-red-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-dot" />
                    {match.minute}'
                  </span>
                ) : (
                  <span className="font-mono">{match.startTime}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span className="truncate pr-1">{match.homeTeam.shortName}</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {match.isLive || match.status === 'FT' ? match.score.current.home : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                <span className="truncate pr-1">{match.awayTeam.shortName}</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {match.isLive || match.status === 'FT' ? match.score.current.away : '-'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CLS-safe Right Sidebar Ad Placement */}
      <AdSlot placement="sidebar_right" />

      {/* Platform Quality & Trust Note */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time Precision</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          VeloScore live scores are synchronized with millisecond latency, official league data feeds, and pitch event updates.
        </p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 text-[10px]">
          <button
            onClick={() => onOpenPage('about')}
            className="hover:text-emerald-500 transition-colors"
          >
            About
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenPage('privacy')}
            className="hover:text-emerald-500 transition-colors"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenPage('terms')}
            className="hover:text-emerald-500 transition-colors"
          >
            Terms
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenPage('contact')}
            className="hover:text-emerald-500 transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </aside>
  );
};
