import React from 'react';
import { Home, ScanLine, MessageSquare, BookOpen, Settings, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenGuide,
  onOpenSettings,
  onOpenOnboarding,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2.5 py-2 sm:px-6 sm:py-3 gap-2">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            aria-label="SignBridge Home"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-xs">
              <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left">
              <span className="text-base sm:text-lg font-bold text-primary tracking-tight">Sign Bridge</span>
              <span className="hidden lg:inline-flex items-center gap-1.5 ml-2.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                <ShieldCheck className="h-3 w-3 text-teal" />
                Runs 100% locally
              </span>
            </div>
          </button>
        </div>

        {/* Primary Navigation Tabs - Highly Responsive */}
        <nav
          className="flex items-center gap-1 rounded-xl border border-border bg-slate-100/90 p-1 shrink min-w-0"
          role="navigation"
          aria-label="Main Navigation"
        >
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-primary text-white shadow-xs'
                : 'text-secondary hover:text-foreground hover:bg-white/60'
            }`}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Home</span>
          </button>

          {/* Unified Studio Tab */}
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-primary text-white shadow-xs'
                : 'text-secondary hover:text-foreground hover:bg-white/60'
            }`}
            aria-current={activeTab === 'studio' ? 'page' : undefined}
          >
            <ScanLine className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sign to Text &amp; Speech</span>
            <span className="md:hidden">Studio</span>
          </button>

          {/* Speech to Sign Tab (WIP) */}
          <button
            onClick={() => setActiveTab('two-way')}
            className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'two-way'
                ? 'bg-teal text-white shadow-xs'
                : 'text-secondary hover:text-foreground hover:bg-white/60'
            }`}
            aria-current={activeTab === 'two-way' ? 'page' : undefined}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Speech to Sign</span>
            <span className="md:hidden">Speech</span>
            <span className="hidden sm:inline text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold border border-amber-200">
              WIP
            </span>
          </button>
        </nav>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Reference Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2 sm:px-2.5 py-1.5 text-xs font-medium text-secondary shadow-2xs transition-colors hover:border-slate-300 hover:text-foreground hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open Indian Sign Language Reference Guide"
            title="Open Sign Reference Guide"
          >
            <BookOpen className="h-4 w-4 text-teal" />
            <span className="hidden lg:inline font-semibold">Guide</span>
          </button>

          {/* How It Works */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center rounded-xl border border-border bg-surface p-1.5 text-secondary hover:text-foreground hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
            aria-label="How SignBridge works"
            title="How SignBridge works"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center rounded-xl border border-border bg-surface p-1.5 text-secondary hover:text-foreground hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
            aria-label="Settings and confidence threshold"
            title="Detection Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
