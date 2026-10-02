import { useState, useRef, useEffect } from "react";
import { BookOpen, Settings, HelpCircle, LayoutGrid, X } from "lucide-react";

export default function FloatingActions({
  onOpenGuide,
  onOpenSettings,
  onOpenOnboarding,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <aside
      ref={containerRef}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-2"
      aria-label="Quick Actions Menu"
    >
      {/* ── Expanded Speed-Dial Capsule (Appears ABOVE Trigger Button) ── */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Quick tools"
          className="flex flex-col items-center gap-1.5 sm:gap-2 bg-surface/95 backdrop-blur-md border border-border p-1.5 sm:p-2 rounded-2xl shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* 1. Guide (Top) */}
          <button
            role="menuitem"
            onClick={() => {
              onOpenGuide();
              setIsOpen(false);
            }}
            className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-soft border border-teal/30 text-teal-dark hover:bg-teal/20 transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            aria-label="Open Indian Sign Language Reference Guide"
            title="Open ISL Reference Guide"
          >
            <BookOpen className="h-4.5 w-4.5 text-teal" />
            <span className="text-[10px] font-bold mt-0.5 leading-none">
              Guide
            </span>
          </button>

          {/* 2. Settings (Middle) */}
          <button
            role="menuitem"
            onClick={() => {
              onOpenSettings();
              setIsOpen(false);
            }}
            className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-border bg-white text-secondary hover:text-foreground hover:bg-slate-100 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Detection threshold settings"
            title="Settings"
          >
            <Settings className="h-4.5 w-4.5" />
            <span className="text-[9px] font-medium mt-0.5 text-slate-500 leading-none">
              Settings
            </span>
          </button>

          {/* 3. Help (Bottom) */}
          <button
            role="menuitem"
            onClick={() => {
              onOpenOnboarding();
              setIsOpen(false);
            }}
            className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-border bg-white text-secondary hover:text-foreground hover:bg-slate-100 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="How SignBridge works"
            title="How SignBridge works"
          >
            <HelpCircle className="h-4.5 w-4.5" />
            <span className="text-[9px] font-medium mt-0.5 text-slate-500 leading-none">
              Help
            </span>
          </button>
        </div>
      )}

      {/* ── Main Trigger Button (FAB) ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isOpen
            ? "bg-slate-900 text-white border-slate-700 shadow-xl scale-95"
            : "bg-brand-gradient text-white border-white/20 hover:scale-105 hover:shadow-xl active:scale-95"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close quick menu" : "Open quick tools menu"}
        title={
          isOpen ? "Close quick menu" : "Quick Actions (Guide, Settings, Help)"
        }
      >
        {isOpen ? (
          <X className="h-5 w-5 transition-transform duration-200" />
        ) : (
          <LayoutGrid className="h-5 w-5 transition-transform duration-200" />
        )}
      </button>
    </aside>
  );
}
