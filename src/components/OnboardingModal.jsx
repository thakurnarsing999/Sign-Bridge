import { useEffect } from "react";
import {
  X,
  Hand,
  Volume2,
  MessageSquare,
  ShieldCheck,
  Keyboard,
  ArrowRight,
} from "lucide-react";

export default function OnboardingModal({ isOpen, onClose }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-dialog-title"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2
              id="onboarding-dialog-title"
              className="text-lg font-bold text-foreground"
            >
              How SignBridge Works
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Two-way assistive communication connecting Indian Sign Language,
              speech, and text.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border p-1.5 text-secondary hover:text-foreground hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close guide"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* 4 User-Centric Benefits / Core Flows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border border-border bg-slate-50/80 p-3.5 space-y-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Hand className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground">
              Sign → Voice Translation
            </h3>
            <p className="text-[11px] text-secondary leading-relaxed">
              Show ISL gestures to your camera. Signs are recognized and
              automatically assembled into words and spoken aloud.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-slate-50/80 p-3.5 space-y-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-soft text-teal">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground">
              Speech → Sign Translation
            </h3>
            <p className="text-[11px] text-secondary leading-relaxed">
              Hearing partners speak or type to immediately display
              corresponding ISL fingerspelling sign sequences.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-slate-50/80 p-3.5 space-y-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-success">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground">
              100% Private in Browser
            </h3>
            <p className="text-[11px] text-secondary leading-relaxed">
              Detection runs entirely on your device with WebAssembly. No video
              or speech data is ever uploaded.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-slate-50/80 p-3.5 space-y-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Volume2 className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground">
              Auto-Sentence Builder
            </h3>
            <p className="text-[11px] text-secondary leading-relaxed">
              Holding a sign appends it to the transcript. Brief 1.5s pauses
              between gestures automatically insert spaces.
            </p>
          </div>
        </div>

        {/* Keyboard Shortcuts Cheatsheet */}
        <div className="rounded-xl border border-border bg-slate-50 p-3 text-xs text-secondary">
          <div className="flex items-center gap-2 mb-2 font-bold text-foreground">
            <Keyboard className="h-4 w-4 text-primary" />
            <span>Helpful Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">
                A
              </kbd>{" "}
              : Alphabet Mode
            </div>
            <div>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">
                N
              </kbd>{" "}
              : Number Mode
            </div>
            <div>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">
                C
              </kbd>{" "}
              : Connect / Stop Camera
            </div>
            <div>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">
                Esc
              </kbd>{" "}
              : Close Drawer / Dialog
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-primary-hover transition-colors"
          >
            <span>Start Communicating</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
