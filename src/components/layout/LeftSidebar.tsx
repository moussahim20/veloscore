import React, { useState, useMemo } from 'react';
import { Trophy, Star, Globe, Flame, Search, ChevronDown, ChevronRight, X, Shield } from 'lucide-react';
import type { Competition } from '../../types/sports';
import { CountryFlag } from '../common/CountryFlag';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({
    Morocco: true,
    England: true,
    Spain: true,
    Europe: true,
    'Saudi Arabia': true,
  });

  const toggleCountry = (countryName: string) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [countryName]: !prev[countryName],
    }));
  };

  // Filter competitions by search term
  const filteredCompetitions = useMemo(() => {
    if (!searchTerm.trim()) return competitions;
    const term = searchTerm.toLowerCase();
    return competitions.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.countryName.toLowerCase().includes(term)
    );
  }, [competitions, searchTerm]);

  // Top flagship leagues
  const topLeagues = useMemo(() => {
    return filteredCompetitions.filter((c) => c.isTopLeague);
  }, [filteredCompetitions]);

  // Group all competitions by Country
  const groupedByCountry = useMemo(() => {
    const map = new Map<string, { countryName: string; flag: string; items: Competition[] }>();

    filteredCompetitions.forEach((comp) => {
      const country = comp.countryName || 'Other';
      if (!map.has(country)) {
        map.set(country, {
          countryName: country,
          flag: comp.countryFlag || '🌐',
          items: [],
        });
      }
      map.get(country)!.items.push(comp);
    });

    return Array.from(map.values()).sort((a, b) => {
      // Prioritize Morocco, England, Spain, Europe, Saudi Arabia
      const priorityOrder: Record<string, number> = {
        Morocco: 1,
        England: 2,
        Spain: 3,
        Europe: 4,
        Italy: 5,
        Germany: 6,
        France: 7,
        'Saudi Arabia': 8,
        Egypt: 9,
        Africa: 10,
        World: 11,
      };
      const pA = priorityOrder[a.countryName] || 99;
      const pB = priorityOrder[b.countryName] || 99;
      if (pA !== pB) return pA - pB;
      return a.countryName.localeCompare(b.countryName);
    });
  }, [filteredCompetitions]);

  return (
    <aside
      id="left-sports-sidebar"
      aria-label="Leagues and competitions"
      className="w-full lg:w-64 shrink-0 space-y-3"
    >
      {/* Search Leagues & Countries */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-2.5 shadow-xs transition-colors">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leagues / countries..."
            className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions: All Competitions & Favorites */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-2 space-y-1 shadow-xs transition-colors">
        <button
          onClick={() => {
            onSelectCompetition('');
            if (showOnlyFavorites) onToggleFavorites();
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            !selectedCompetitionId && !showOnlyFavorites
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>All Matches & Leagues</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">{competitions.length}</span>
        </button>

        <button
          onClick={onToggleFavorites}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            showOnlyFavorites
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="flex items-center gap-2">
            <Star
              className={`w-3.5 h-3.5 ${
                showOnlyFavorites ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span>My Favorites</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {favoriteCount}
          </span>
        </button>
      </div>

      {/* Top Leagues */}
      {topLeagues.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
          <div className="flex items-center gap-1.5 px-1 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Top Leagues</span>
          </div>

          <nav className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
            {topLeagues.map((comp) => {
              const active = selectedCompetitionId === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => onSelectCompetition(comp.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <CountryFlag
                    countryName={comp.countryName}
                    countryCode={comp.countryId}
                    flagUrl={comp.countryFlag}
                    className="w-4 h-3 shrink-0 shadow-2xs"
                  />
                  <span className="truncate">{comp.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* All Leagues Grouped by Country */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>All Leagues & Countries</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {groupedByCountry.length} Countries
          </span>
        </div>

        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {groupedByCountry.map((group) => {
            const isExpanded = expandedCountries[group.countryName] ?? false;
            const hasActiveLeague = group.items.some((i) => i.id === selectedCompetitionId);

            return (
              <div
                key={group.countryName}
                className="rounded-lg border border-slate-100 dark:border-slate-800/60 overflow-hidden"
              >
                <button
                  onClick={() => toggleCountry(group.countryName)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-left transition-colors ${
                    hasActiveLeague
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <CountryFlag
                      countryName={group.countryName}
                      flagUrl={group.flag}
                      className="w-4 h-3 shrink-0 shadow-2xs"
                    />
                    <span className="truncate">{group.countryName}</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-500 font-mono">
                      {group.items.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-1.5 py-1 space-y-0.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/40">
                    {group.items.map((comp) => {
                      const active = selectedCompetitionId === comp.id;
                      return (
                        <button
                          key={comp.id}
                          onClick={() => onSelectCompetition(comp.id)}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] font-medium transition-colors text-left ${
                            active
                              ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <Shield className="w-3 h-3 shrink-0 opacity-70" />
                            <span className="truncate">{comp.name}</span>
                          </span>
                          {comp.isTopLeague && (
                            <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                              Top
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
