import React from 'react';
import {
  ScanLine, Volume2, ArrowRight, ShieldCheck, Zap, Hand, MessageSquare,
  Sparkles, Layers, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-6">
      {/* ── Hero Section ── */}
      <section className="text-center max-w-4xl mx-auto px-4">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal-soft px-4 py-1.5 text-xs font-semibold text-teal-dark mb-6 shadow-xs">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-teal" />
          <span>Real-Time Indian Sign Language Assistive Communication</span>
        </div>

        {/* Hero Title with Brand Gradient */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
          Bridge Every Gesture.
          <br />
          <span className="text-brand-gradient">Empower Every Voice.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-lg text-secondary leading-relaxed font-normal">
          SignBridge translates Indian Sign Language gestures into both <strong>real-time text</strong> and <strong>natural spoken audio</strong> in a single, unified communication workspace.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('studio')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-primary-hover hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ScanLine className="h-5 w-5" />
            <span>Launch Studio (Text &amp; Speech)</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          <button
            onClick={() => onNavigate('two-way')}
            className="inline-flex items-center gap-2 rounded-xl border border-teal/40 bg-teal-soft px-6 py-3.5 text-sm sm:text-base font-bold text-teal-dark shadow-xs hover:bg-teal/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <MessageSquare className="h-5 w-5 text-teal" />
            <span>Two-Way Speech to Sign</span>
          </button>
        </div>

        {/* Privacy & Standard Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-secondary">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" />
            100% Private (Runs locally in browser)
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            Simultaneous Text &amp; Voice Synthesis
          </span>
          <span className="flex items-center gap-1.5">
            <Hand className="h-4 w-4 text-primary" />
            ISL Alphabets (A–Z) &amp; Digits (1–9)
          </span>
        </div>
      </section>

      {/* ── Unified Solution Highlight Banner ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div
          onClick={() => onNavigate('studio')}
          className="group cursor-pointer rounded-3xl border border-border bg-gradient-to-br from-white via-slate-50 to-teal-soft/30 p-7 sm:p-10 shadow-xs hover:shadow-md hover:border-primary/40 transition-all text-left relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-xs">
                <ScanLine className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-dark bg-teal-soft px-2.5 py-0.5 rounded-full border border-teal/20">
                  Combined Studio
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
                  Unified Sign to Text &amp; Speech
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
              <span>Open Studio</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          <p className="text-sm sm:text-base text-secondary leading-relaxed font-normal">
            No need to switch between screens. The unified studio runs 3D landmark tracking on your camera feed and simultaneously updates the <strong>live on-screen transcript</strong> while speaking each recognized gesture aloud with <strong>natural voice audio</strong>.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-secondary font-medium">
            <div className="rounded-xl border border-slate-200/90 bg-white p-3 flex items-start gap-2 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-teal shrink-0 mt-0.5" />
              <span><strong>Sentence Builder:</strong> Assembles letters into words with 1.5s auto-space</span>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-3 flex items-start gap-2 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-teal shrink-0 mt-0.5" />
              <span><strong>Voice Output:</strong> Reads signs and full sentences aloud with speed tuning</span>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-3 flex items-start gap-2 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-teal shrink-0 mt-0.5" />
              <span><strong>Quick Soundboard:</strong> Instant one-tap speech for everyday phrases</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works 3-Step Flow ── */}
      <section className="max-w-4xl mx-auto px-4 bg-slate-100/70 border border-slate-200/90 rounded-2xl p-6 sm:p-8">
        <h3 className="text-center text-lg sm:text-xl font-bold text-foreground mb-6">
          How SignBridge Works in 3 Simple Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-primary font-black text-sm shadow-xs mb-3">
              1
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Sign to Camera</h4>
            <p className="text-[11px] sm:text-xs text-secondary mt-1">
              Position both hands in front of your device camera with front lighting.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-teal font-black text-sm shadow-xs mb-3">
              2
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">3D Vision Tracking</h4>
            <p className="text-[11px] sm:text-xs text-secondary mt-1">
              MediaPipe extracts 42 skeletal joints and classifies the ISL pose in &lt; 0.1ms.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-success font-black text-sm shadow-xs mb-3">
              3
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Text &amp; Voice Output</h4>
            <p className="text-[11px] sm:text-xs text-secondary mt-1">
              Characters assemble into sentences and are spoken aloud in real time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
