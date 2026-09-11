import React, { useState } from 'react';
import { ArrowLeft, Shield, Mail, FileText, Lock, Info, Send, Check } from 'lucide-react';

interface TrustPagesProps {
  page: 'about' | 'privacy' | 'terms' | 'cookies' | 'contact';
  onBack: () => void;
}

export const TrustPages: React.FC<TrustPagesProps> = ({ page, onBack }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      id={`trust-page-${page}`}
      className="w-full max-w-3xl mx-auto bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-md p-6 sm:p-8 mb-8 transition-colors"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Matches</span>
      </button>

      {/* ABOUT PAGE */}
      {page === 'about' && (
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Info className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white m-0">
              About VeloScore
            </h1>
          </div>
          <p className="text-sm leading-relaxed">
            <strong>VeloScore</strong> is a modern, high-speed multi-sport live scoreboard platform built for sports enthusiasts who demand ultra-fast updates, clean visual hierarchy, and reliable match data without intrusive advertising clutter.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Our Mission
          </h2>
          <p className="text-sm leading-relaxed">
            Our goal is to provide instantaneous sports information across major worldwide football competitions, basketball leagues, tennis tournaments, and more. We prioritize Core Web Vitals, mobile responsiveness, and zero layout shift so that you never miss a goal, penalty, or red card.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Data Integrity & Sports Fair Play
          </h2>
          <p className="text-sm leading-relaxed">
            VeloScore aggregates scores and statistics strictly from licensed sports data providers and official league endpoints. We are an independent editorial sports score provider and do not facilitate sports wagering or gambling.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 mt-6">
            <strong>Business Entity Placeholder:</strong> [Your Company / Publisher Name], [Registered Business Address], [Contact Phone / Email]. Replace these identifiers upon production domain deployment.
          </div>
        </article>
      )}

      {/* PRIVACY POLICY */}
      {page === 'privacy' && (
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white m-0">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xs text-slate-400">Last updated: September 11, 2026</p>

          <p className="text-sm leading-relaxed">
            At VeloScore, your privacy is paramount. This Privacy Policy details how we handle user data in compliance with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and Google Publisher Policies.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Information We Collect
          </h2>
          <p className="text-sm leading-relaxed">
            We do not require user account registration for live scores or standings. We store user preferences (e.g. favorited teams, sound alert preferences, and dark mode selection) locally in your browser's <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">localStorage</code>.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Google AdSense & Third-Party Advertising
          </h2>
          <p className="text-sm leading-relaxed">
            We work with Google AdSense and accredited digital advertising vendors to serve contextual and interest-based advertisements. Google uses cookies to serve ads based on prior visits to this website and other sites across the Internet. Users in the EEA and UK are provided with an explicit Cookie Consent Choice dialog before any non-essential advertising cookies are set.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Your Rights Under GDPR & CCPA
          </h2>
          <p className="text-sm leading-relaxed">
            You have the right to request access to, deletion of, or restriction of processing of any personal data. You may contact our Data Protection Officer at <span className="underline">privacy@veloscore.live</span>.
          </p>
        </article>
      )}

      {/* TERMS OF SERVICE */}
      {page === 'terms' && (
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white m-0">
              Terms of Service
            </h1>
          </div>
          <p className="text-xs text-slate-400">Effective Date: September 11, 2026</p>

          <p className="text-sm leading-relaxed">
            By accessing or using VeloScore, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Informational Use Only (No Betting)
          </h2>
          <p className="text-sm leading-relaxed">
            All sports scores, schedules, statistics, lineups, and live events displayed on VeloScore are for informational and entertainment purposes only. VeloScore is not a gambling operator and does not accept wagers. While we make every reasonable effort to provide live data accuracy, we do not warrant that all data will be uninterrupted or error-free.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            Acceptable Use
          </h2>
          <p className="text-sm leading-relaxed">
            You agree not to scrape, reverse engineer, or programmatically extract data in large volumes that degrades service performance for other visitors or circumvents security controls.
          </p>
        </article>
      )}

      {/* COOKIES POLICY */}
      {page === 'cookies' && (
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white m-0">
              Cookie Policy
            </h1>
          </div>

          <p className="text-sm leading-relaxed">
            This Cookie Policy explains how VeloScore uses cookies and similar client-side technologies to deliver a responsive, personalized experience.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            1. Strictly Necessary Cookies
          </h2>
          <p className="text-sm leading-relaxed">
            These are essential for core platform features such as memorizing your theme choice (dark/light mode) and active sports filter. They do not store personally identifiable data.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
            2. Advertising Cookies (Google AdSense)
          </h2>
          <p className="text-sm leading-relaxed">
            Used by advertising partners to measure ad viewability and avoid repetitive advertisements. You can modify your ad preferences at any time via your browser settings or the Google Ad Settings portal.
          </p>
        </article>
      )}

      {/* CONTACT PAGE */}
      {page === 'contact' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white m-0">
                Contact & Support
              </h1>
              <p className="text-xs text-slate-400">
                Editorial inquiries, data corrections, and technical support.
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex flex-col items-center text-center">
              <Check className="w-10 h-10 mb-2" />
              <h3 className="font-bold text-base">Message Received</h3>
              <p className="text-xs mt-1">
                Thank you for reaching out. Our sports desk team typically responds within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>General Inquiry</option>
                  <option>Data / Score Correction</option>
                  <option>Partnership & Advertising</option>
                  <option>Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <strong>Direct Editorial Contact:</strong> contact@veloscore.live
          </div>
        </div>
      )}
    </div>
  );
};
