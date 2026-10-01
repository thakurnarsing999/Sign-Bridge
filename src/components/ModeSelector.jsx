import { Type, Hash } from "lucide-react";

export default function ModeSelector({ activeMode, onSelectMode }) {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <span className="text-xs font-semibold text-secondary uppercase tracking-wider hidden sm:inline">
        Mode:
      </span>
      <div
        className="flex items-center gap-1 rounded-xl border border-border bg-slate-100/90 p-1 shadow-2xs w-full sm:w-auto"
        role="tablist"
        aria-label="ISL Recognition Mode"
      >
        <button
          role="tab"
          aria-selected={activeMode === "alphabets"}
          onClick={() => onSelectMode("alphabets")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
            activeMode === "alphabets"
              ? "bg-teal text-white shadow-xs"
              : "text-secondary hover:text-foreground hover:bg-white/60"
          }`}
          title="Press 'A' on keyboard to select"
        >
          <Type className="h-3.5 w-3.5" />
          <span>A–Z Alphabets</span>
          <kbd className="hidden md:inline-block rounded px-1 py-0.2 text-[10px] bg-black/10 font-mono">
            A
          </kbd>
        </button>

        <button
          role="tab"
          aria-selected={activeMode === "digits"}
          onClick={() => onSelectMode("digits")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
            activeMode === "digits"
              ? "bg-teal text-white shadow-xs"
              : "text-secondary hover:text-foreground hover:bg-white/60"
          }`}
          title="Press 'N' on keyboard to select"
        >
          <Hash className="h-3.5 w-3.5" />
          <span>1–9 Numbers</span>
          <kbd className="hidden md:inline-block rounded px-1 py-0.2 text-[10px] bg-black/10 font-mono">
            N
          </kbd>
        </button>
      </div>
    </div>
  );
}
