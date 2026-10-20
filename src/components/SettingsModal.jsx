import { useEffect } from "react";
import {
  X,
  Sliders,
  ShieldCheck,
  Volume2,
  RotateCcw,
  Sun,
  Moon,
} from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  confidenceThreshold,
  onChangeConfidenceThreshold,
  speechRate,
  onChangeSpeechRate,
  onResetDefaults,
  theme,
  onChangeTheme,
}) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="settings-dialog-title"
                className="text-base font-bold text-foreground"
              >
                Settings &amp; Preferences
              </h2>
              <p className="text-xs text-secondary">
                Configure theme, sensitivity &amp; speech
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border p-1.5 text-secondary hover:text-foreground hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close settings"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* 1. Appearance / Theme Mode Selector */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-primary" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
              <span>Theme Appearance</span>
            </span>
            <span className="text-[11px] font-semibold text-secondary capitalize">
              {theme} Mode
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => onChangeTheme("light")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all border ${
                theme === "light"
                  ? "border-primary bg-primary text-white shadow-xs"
                  : "border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme("dark")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all border ${
                theme === "dark"
                  ? "border-primary bg-primary text-white shadow-xs"
                  : "border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* 2. Confidence Threshold Slider */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="confidence-slider"
              className="text-xs font-bold text-foreground"
            >
              Detection Confidence Threshold
            </label>
            <span className="font-mono text-sm font-extrabold text-teal">
              {confidenceThreshold}%
            </span>
          </div>

          <input
            id="confidence-slider"
            type="range"
            min="65"
            max="85"
            step="1"
            value={confidenceThreshold}
            onChange={(e) =>
              onChangeConfidenceThreshold(Number(e.target.value))
            }
            className="w-full accent-teal cursor-pointer h-2 bg-surface-hover rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-semibold text-muted font-mono">
            <span>65% (Fast)</span>
            <span>75% (Recommended)</span>
            <span>85% (Strict)</span>
          </div>
        </div>

        {/* 3. Speech Rate Setting */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="speech-rate-slider"
              className="text-xs font-bold text-foreground flex items-center gap-1.5"
            >
              <Volume2 className="h-4 w-4 text-primary" />
              <span>Voice Speech Speed</span>
            </label>
            <span className="font-mono text-sm font-extrabold text-primary">
              {speechRate}x
            </span>
          </div>

          <input
            id="speech-rate-slider"
            type="range"
            min="0.7"
            max="1.3"
            step="0.1"
            value={speechRate}
            onChange={(e) => onChangeSpeechRate(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-2 bg-surface-hover rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-semibold text-muted font-mono">
            <span>0.7x (Clearer)</span>
            <span>1.0x (Normal)</span>
            <span>1.3x (Fast)</span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-foreground leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
          <span className="text-[11px] text-secondary">
            <strong className="text-foreground">100% Client-Side:</strong> All
            video frames and landmark poses are computed locally. Zero camera or
            voice data is transmitted over the network.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-xs font-semibold text-secondary hover:text-foreground py-1.5 px-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
