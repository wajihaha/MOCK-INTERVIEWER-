import { useState } from 'react';
import { KeyRound, Menu, Moon, Sun, X } from 'lucide-react';
import codingClubLogo from '../assets/logo.png';
import type { AppScreen } from '../types/interview';

interface NavbarProps {
  currentScreen: AppScreen;
  canAccessInterview: boolean;
  canAccessScorecard: boolean;
  onNavigate: (screen: AppScreen) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export function Navbar({
  currentScreen,
  canAccessInterview,
  canAccessScorecard,
  onNavigate,
  isDark,
  onToggleTheme,
  hasApiKey,
  onOpenApiKeyModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (screen: AppScreen) => {
    if (screen === 'interview' && !canAccessInterview) return;
    if (screen === 'scorecard' && !canAccessScorecard) return;
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:gap-8">
        {/* Zone 1: Coding Club logo + brand wordmark & attribution */}
        <button
          type="button"
          onClick={() => handleMobileNavigate('setup')}
          className="group flex min-w-0 items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:gap-3 cursor-pointer"
        >
          <img
            src={codingClubLogo}
            alt="Coding Club logo"
            className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover shadow-xs sm:h-11 sm:w-11 dark:border-slate-700/70"
          />
          <div className="min-w-0">
            <div className="font-display truncate text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-base dark:text-slate-100 dark:group-hover:text-indigo-400">
              Smart Mock Interviewer
            </div>
            <div className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
              By Coding Club · Wajiha Fatima  &amp; Haniya Ayaz
            </div>
          </div>
        </button>

        {/* Zone 2: Desktop single-line text navigation */}
        <nav
          aria-label="Interview workflow"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          <button
            type="button"
            onClick={() => onNavigate('setup')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              currentScreen === 'setup'
                ? 'border-indigo-600 text-slate-900 dark:border-indigo-400 dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            Setup
          </button>

          <button
            type="button"
            disabled={!canAccessInterview}
            onClick={() => canAccessInterview && onNavigate('interview')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentScreen === 'interview'
                ? 'border-indigo-600 text-slate-900 dark:border-indigo-400 dark:text-white'
                : canAccessInterview
                ? 'border-transparent text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100'
                : 'border-transparent text-slate-300 cursor-not-allowed dark:text-slate-700'
            }`}
          >
            Live Interview
          </button>

          <button
            type="button"
            disabled={!canAccessScorecard}
            onClick={() => canAccessScorecard && onNavigate('scorecard')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentScreen === 'scorecard'
                ? 'border-indigo-600 text-slate-900 dark:border-indigo-400 dark:text-white'
                : canAccessScorecard
                ? 'border-transparent text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100'
                : 'border-transparent text-slate-300 cursor-not-allowed dark:text-slate-700'
            }`}
          >
            Scorecard
          </button>
        </nav>

        {/* Zone 3: Theme toggle + API Key Settings + Mobile Hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap shrink-0 cursor-pointer sm:gap-2 sm:px-3.5 ${
              hasApiKey
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
                : 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'API Key Settings' : 'Add Groq Key'}
            </span>
            <span className="sm:hidden">{hasApiKey ? 'API Key' : 'Add Key'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleMobileNavigate('setup')}
              className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer ${
                currentScreen === 'setup'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <span>01. Setup Interview</span>
              {currentScreen === 'setup' && (
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  Active
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={!canAccessInterview}
              onClick={() => handleMobileNavigate('interview')}
              className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                currentScreen === 'interview'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                  : canAccessInterview
                  ? 'text-slate-700 hover:bg-slate-100 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-900'
                  : 'text-slate-400 cursor-not-allowed dark:text-slate-600'
              }`}
            >
              <span>02. Live Interview</span>
              <span className="text-xs font-medium">
                {currentScreen === 'interview'
                  ? 'Active'
                  : canAccessInterview
                  ? 'Resume'
                  : 'Start first'}
              </span>
            </button>

            <button
              type="button"
              disabled={!canAccessScorecard}
              onClick={() => handleMobileNavigate('scorecard')}
              className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                currentScreen === 'scorecard'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                  : canAccessScorecard
                  ? 'text-slate-700 hover:bg-slate-100 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-900'
                  : 'text-slate-400 cursor-not-allowed dark:text-slate-600'
              }`}
            >
              <span>03. Scorecard</span>
              <span className="text-xs font-medium">
                {currentScreen === 'scorecard'
                  ? 'Active'
                  : canAccessScorecard
                  ? 'View'
                  : 'Complete first'}
              </span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
