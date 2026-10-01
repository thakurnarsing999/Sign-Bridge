import React, { useEffect } from 'react';
import { X, Sliders, ShieldCheck, Volume2, Camera, Info, RotateCcw } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  confidenceThreshold,
  onChangeConfidenceThreshold,
  speechRate,
  onChangeSpeechRate,
  onResetDefaults,
}) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-base font-bold text-foreground">
                Detection Settings
              </h2>
              <p className="text-xs text-secondary">Tune sensitivity and speech output</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border p-1.5 text-secondary hover:text-foreground hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close settings"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Confidence Threshold Slider (Requirement 11) */}
        <div className="rounded-xl border border-border bg-slate-50/70 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label htmlFor="confidence-slider" className="text-xs font-bold text-foreground">
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
            onChange={(e) => onChangeConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-teal cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-semibold text-slate-400 font-mono">
            <span>65% (Fast / Soft Light)</span>
            <span>75% (Recommended)</span>
            <span>85% (High Precision)</span>
          </div>

          <p className="text-[11px] text-secondary leading-relaxed pt-1">
            Higher values (80–85%) minimize accidental or false letters but require firm hand poses. Lower values (65–70%) make recognition faster in soft room lighting.
          </p>
        </div>

        {/* Speech Rate Setting */}
        <div className="rounded-xl border border-border bg-slate-50/70 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label htmlFor="speech-rate-slider" className="text-xs font-bold text-foreground flex items-center gap-1.5">
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
            className="w-full accent-primary cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-semibold text-slate-400 font-mono">
            <span>0.7x (Clearer)</span>
            <span>1.0x (Normal)</span>
            <span>1.3x (Fast)</span>
          </div>
        </div>

        {/* Privacy Assurance Note */}
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-slate-700 leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
          <span>
            <strong>100% Client-Side Privacy:</strong> All video frames, camera inputs, and landmarks are processed locally on your device via WebAssembly. Zero video or voice data is ever transmitted to the cloud.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-xs font-semibold text-secondary hover:text-foreground py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Defaults</span>
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
