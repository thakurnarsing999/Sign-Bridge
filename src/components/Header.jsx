import { Home, ScanLine, MessageSquare, ShieldCheck } from "lucide-react";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-3">
        {/* Desktop Single-Row Layout & Mobile Two-Row Stack */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          {/* Top Row on Mobile / Left on Desktop: Brand Logo */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              aria-label="SignBridge Home"
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-xs">
                <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-black text-primary tracking-tight">
                  Sign Bridge
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 ml-2.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <ShieldCheck className="h-3 w-3 text-teal" />
                  Runs 100% locally
                </span>
              </div>
            </button>

            {/* Mobile Privacy Indicator Pill */}
            <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-bold text-teal-dark bg-teal-soft border border-teal/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-2.5 w-2.5 text-teal" />
              Private
            </span>
          </div>

          {/* Navigation Tabs — Full Width on Mobile with ALL 3 Names Clearly Written */}
          <nav
            className="grid grid-cols-3 md:flex md:items-center gap-1 rounded-xl border border-border bg-slate-100/95 p-1 shadow-2xs"
            role="navigation"
            aria-label="Main Navigation"
          >
            {/* Tab 1: Home (Icon + "Home" written) */}
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 sm:px-3.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "home"
                  ? "bg-primary text-white shadow-xs"
                  : "text-secondary hover:text-foreground hover:bg-white/60"
              }`}
              aria-current={activeTab === "home" ? "page" : undefined}
            >
              <Home className="h-3.5 w-3.5 shrink-0" />
              <span>Home</span>
            </button>

            {/* Tab 2: Text & Speech (Icon + "Text & Speech" written) */}
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 sm:px-3.5 text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === "studio"
                  ? "bg-primary text-white shadow-xs"
                  : "text-secondary hover:text-foreground hover:bg-white/60"
              }`}
              aria-current={activeTab === "studio" ? "page" : undefined}
            >
              <ScanLine className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden lg:inline">
                Sign to Text &amp; Speech
              </span>
              <span className="lg:hidden">Text &amp; Speech</span>
            </button>

            {/* Tab 3: Speech to Sign (Icon + "Speech to Sign" written) */}
            <button
              onClick={() => setActiveTab("two-way")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 sm:px-3.5 text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === "two-way"
                  ? "bg-teal text-white shadow-xs"
                  : "text-secondary hover:text-foreground hover:bg-white/60"
              }`}
              aria-current={activeTab === "two-way" ? "page" : undefined}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span>Speech to Sign</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
