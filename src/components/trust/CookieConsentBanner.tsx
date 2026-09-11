import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const CookieConsentBanner: React.FC<{ onOpenPolicy: () => void }> = ({ onOpenPolicy }) => {
  const [hasConsented, setHasConsented] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('veloscore_cookie_consent');
      if (!stored) {
        setHasConsented(false);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('veloscore_cookie_consent', 'accepted');
    setHasConsented(true);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('veloscore_cookie_consent', 'essential_only');
    setHasConsented(true);
  };

  if (hasConsented) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-900/95 text-slate-100 border-t border-slate-800 backdrop-blur-md shadow-2xl transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-slate-300">
            We use essential cookies and anonymized measurement to deliver ultra-fast live sports scores. Read our{' '}
            <button
              onClick={onOpenPolicy}
              className="underline text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Privacy & Cookie Policy
            </button>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleEssentialOnly}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors font-medium text-xs"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors text-xs"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
