import React from 'react';
import { Activity, Shield } from 'lucide-react';

interface FooterProps {
  onOpenPage: (page: 'about' | 'privacy' | 'terms' | 'cookies' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPage }) => {
  return (
    <footer
      id="app-footer"
      className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1220] py-8 text-xs text-slate-500 transition-colors mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Mission */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                VELO<span className="text-emerald-500">SCORE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Instant multi-sport live scores, real-time match events, line-ups, and statistical insights.
            </p>
          </div>

          {/* Policy & Trust Links */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400"
          >
            <button
              onClick={() => onOpenPage('about')}
              className="hover:text-emerald-500 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => onOpenPage('contact')}
              className="hover:text-emerald-500 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => onOpenPage('privacy')}
              className="hover:text-emerald-500 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPage('terms')}
              className="hover:text-emerald-500 transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenPage('cookies')}
              className="hover:text-emerald-500 transition-colors"
            >
              Cookie Policy
            </button>
          </nav>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400">
          <p className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              Disclaimer: All sports results and schedules are for informational purposes only. VeloScore is not affiliated with any gambling operator.
            </span>
          </p>
          <p>© {new Date().getFullYear()} VeloScore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
