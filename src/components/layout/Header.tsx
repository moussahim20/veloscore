import React from 'react';
import {
  Volume2,
  VolumeX,
  Search,
  Star,
  Sun,
  Moon,
  Activity,
} from 'lucide-react';
import type { SportId } from '../../types/sports';

interface HeaderProps {
  currentSport: SportId;
  onSelectSport: (sport: SportId) => void;
  onOpenSearch: () => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
  liveMatchesCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateHome: () => void;
  onOpenPage: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSport,
  onSelectSport,
  onOpenSearch,
  showOnlyFavorites,
  onToggleFavorites,
  favoriteCount,
  liveMatchesCount,
  soundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleDarkMode,
  onNavigateHome,
  onOpenPage,
}) => {
  const sports = [
    { id: 'football' as SportId, name: 'Football', live: 3 },
    { id: 'basketball' as SportId, name: 'Basketball', live: 1 },
    { id: 'tennis' as SportId, name: 'Tennis', live: 1 },
    { id: 'ice-hockey' as SportId, name: 'Hockey', live: 0 },
  ];

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-button"
              onClick={onNavigateHome}
              className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
              aria-label="VeloScore Home"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                    VELO<span className="text-emerald-500">SCORE</span>
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-live-dot" />
                </div>
                <span className="hidden sm:inline-block text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-400 uppercase -mt-1">
                  Live Scores & Stats
                </span>
              </div>
            </button>
          </div>

          {/* Center Sports Navigation */}
          <nav
            aria-label="Sports navigation"
            className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/60"
          >
            {sports.map((s) => {
              const active = currentSport === s.id;
              return (
                <button
                  key={s.id}
                  id={`sport-tab-${s.id}`}
                  onClick={() => onSelectSport(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{s.name}</span>
                  {s.live > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        active
                          ? 'bg-red-500 text-white'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {s.live}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              aria-label="Search teams and competitions"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200/70 dark:border-slate-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden lg:inline-block text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                /
              </kbd>
            </button>

            {/* Favorites Toggle */}
            <button
              id="header-favorites-btn"
              onClick={onToggleFavorites}
              aria-label="Toggle favorite matches"
              className={`relative p-2 rounded-lg border transition-all ${
                showOnlyFavorites
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                  : 'bg-slate-100 dark:bg-slate-900/80 border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Show only favorites"
            >
              <Star
                className={`w-4 h-4 ${showOnlyFavorites ? 'fill-amber-500' : ''}`}
              />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              id="header-sound-btn"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute goal audio' : 'Unmute goal audio'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={soundEnabled ? 'Goal sound: Active' : 'Goal sound: Muted'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              id="header-theme-btn"
              onClick={onToggleDarkMode}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sports Navigation */}
        <div className="flex md:hidden items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-slate-200/60 dark:border-slate-800/60">
          {sports.map((s) => {
            const active = currentSport === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSport(s.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>{s.name}</span>
                {s.live > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-red-500 text-white">
                    {s.live}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
