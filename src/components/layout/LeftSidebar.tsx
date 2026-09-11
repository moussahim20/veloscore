import React from 'react';
import { Trophy, Star, Globe, Flame } from 'lucide-react';
import type { Competition } from '../../types/sports';

interface LeftSidebarProps {
  competitions: Competition[];
  selectedCompetitionId?: string;
  onSelectCompetition: (id: string) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  competitions,
  selectedCompetitionId,
  onSelectCompetition,
  showOnlyFavorites,
  onToggleFavorites,
  favoriteCount,
}) => {
  const topLeagues = competitions.filter((c) => c.isTopLeague);

  return (
    <aside
      id="left-sports-sidebar"
      aria-label="Leagues and competitions"
      className="w-full lg:w-60 shrink-0 space-y-4"
    >
      {/* Quick Favorites Box */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
        <button
          onClick={onToggleFavorites}
          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-colors ${
            showOnlyFavorites
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="flex items-center gap-2">
            <Star
              className={`w-4 h-4 ${
                showOnlyFavorites ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span>My Favorites</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-full font-mono text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {favoriteCount}
          </span>
        </button>
      </div>

      {/* Top Leagues */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
        <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Top Leagues</span>
        </div>

        <nav className="space-y-0.5">
          {topLeagues.map((comp) => {
            const active = selectedCompetitionId === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => onSelectCompetition(comp.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-sm shrink-0" role="img" aria-label={comp.countryName}>
                  {comp.countryFlag}
                </span>
                <span className="truncate">{comp.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* All Countries / Competitions */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
        <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Countries</span>
        </div>

        <nav className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
          {competitions.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onSelectCompetition(comp.id)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <span className="flex items-center gap-2 truncate">
                <span>{comp.countryFlag}</span>
                <span className="truncate">{comp.countryName}</span>
              </span>
              <span className="text-[10px] text-slate-400">›</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
