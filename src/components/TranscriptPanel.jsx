import { useState } from "react";
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Delete,
  Trash2,
  Space,
  Sparkles,
  MessageSquare,
  Sliders,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function TranscriptPanel({
  currentLetter,
  confidence,
  confidenceThreshold,
  transcript,
  onCopyTranscript,
  onSpeakSentence,
  onStopSpeaking,
  onBackspace,
  onUndo,
  onClearTranscript,
  onAddSpace,
  isVoiceOutputEnabled,
  onToggleVoiceOutput,
  spokenAudioStatus,
  lastAddedLetter,
  autoSpaceProgress,
  isCameraActive,
  activeMode,
  canUndo,
  speechRate,
  onChangeSpeechRate,
  speakText,
}) {
  const [copyConfirmed, setCopyConfirmed] = useState(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState(false);

  const handleCopy = () => {
    if (!transcript) return;
    onCopyTranscript();
    setCopyConfirmed(true);
    setTimeout(() => setCopyConfirmed(false), 2000);
  };

  const ASSISTIVE_PHRASES = [
    { text: "Hello, nice to meet you.", label: "Hello" },
    { text: "Thank you very much for your help.", label: "Thank you" },
    { text: "Yes, that is correct.", label: "Yes" },
    { text: "No, thank you.", label: "No" },
    { text: "Could you please assist me?", label: "Need Help" },
    { text: "I need to see a doctor or nurse.", label: "Doctor" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
      {/* ── 1. Live Character Recognition Header ── */}
      <div className="rounded-xl border border-border bg-slate-50 p-4 text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Live Character Recognition
          </span>
          <span className="rounded-md border border-border bg-white px-2 py-0.5 font-mono text-xs font-bold text-primary shadow-2xs">
            {activeMode === "alphabets" ? "A–Z Mode" : "1–9 Mode"}
          </span>
        </div>

        {/* Character Display */}
        <div className="my-1 flex items-center justify-center min-h-[72px]">
          {currentLetter && currentLetter !== "-" ? (
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-black text-primary tracking-tight transition-transform scale-105">
                {currentLetter}
              </span>
              <span className="text-sm font-bold text-teal font-mono">
                {confidence}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-slate-400">
              <span className="text-4xl font-light text-slate-300">—</span>
              <span className="text-xs text-secondary mt-1">
                {isCameraActive
                  ? "Hold a sign inside camera frame"
                  : "Camera is off"}
              </span>
            </div>
          )}
        </div>

        {/* Confidence Progress Bar */}
        <div className="mt-1">
          <div className="flex items-center justify-between text-[11px] text-secondary mb-1">
            <span>Detection Confidence</span>
            <span className="font-semibold text-slate-700">
              {confidence > 0 ? `${confidence}%` : "0%"}
              <span className="text-slate-400 font-normal ml-1">
                (Min: {confidenceThreshold}%)
              </span>
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                confidence >= confidenceThreshold ? "bg-teal" : "bg-slate-400"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Letter Appended Visual Confirmation */}
        {lastAddedLetter && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-soft border border-teal/30 px-2.5 py-0.5 text-xs font-bold text-teal-dark animate-pulse">
            <Sparkles className="h-3 w-3 text-teal" />
            <span>Added "{lastAddedLetter}" &amp; Spoke aloud</span>
          </div>
        )}
      </div>

      {/* ── 2. Sign to Text: Assembled Sentence & Word Builder ── */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Sign to Text (Assembled Sentence)
            </h3>
          </div>

          {/* Auto-space indicator */}
          {transcript && !transcript.endsWith(" ") && autoSpaceProgress > 0 && (
            <div
              className="flex items-center gap-1 text-[11px] text-teal-dark font-medium"
              title="Auto-spacing after 1.5s pause"
            >
              <span>Auto-space</span>
              <div className="h-1 w-10 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all duration-100"
                  style={{ width: `${autoSpaceProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Assembled Text Box */}
        <div
          tabIndex={0}
          className="relative min-h-[100px] sm:min-h-[115px] rounded-xl border border-border bg-slate-50/70 p-3.5 sm:p-4 text-sm sm:text-base leading-relaxed font-medium transition-all focus-within:border-primary/50 focus-within:bg-white shadow-inner flex flex-col justify-between"
          aria-label="Assembled sign transcript"
        >
          {transcript ? (
            <p className="text-foreground font-semibold break-words whitespace-pre-wrap select-all">
              {transcript}
              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
            </p>
          ) : (
            <p className="text-slate-400 text-xs sm:text-sm italic select-none">
              Your recognized signs will appear here and assemble into words.
              Hold each gesture steadily to build sentences.
            </p>
          )}

          {/* Spoken Audio Banner with Animated Waveform */}
          {spokenAudioStatus && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal-soft border border-teal/30 px-3 py-1 rounded-full self-start shadow-2xs">
              <span className="flex items-center gap-0.5">
                {[6, 14, 9, 12, 16, 10].map((h, i) => (
                  <span
                    key={i}
                    className="eq-bar inline-block w-0.5 rounded-full bg-teal"
                    style={{ height: h, animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </span>
              <span>{spokenAudioStatus}</span>
            </div>
          )}
        </div>

        {/* Editing Utilities */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onAddSpace}
              className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-secondary hover:text-foreground hover:bg-slate-50 transition-colors shadow-2xs"
              title="Add Space"
            >
              <Space className="h-3.5 w-3.5" />
              <span>Space</span>
            </button>

            <button
              onClick={onBackspace}
              disabled={!transcript}
              className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-secondary hover:text-foreground hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
              title="Backspace"
            >
              <Delete className="h-3.5 w-3.5" />
              <span>Backspace</span>
            </button>

            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-secondary hover:text-foreground hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
              title="Undo last edit"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Undo</span>
            </button>

            <button
              onClick={onClearTranscript}
              disabled={!transcript}
              className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger-soft disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={!transcript}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all shadow-xs ${
              copyConfirmed
                ? "bg-success text-white"
                : "border border-border bg-surface text-secondary hover:text-foreground hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            }`}
          >
            {copyConfirmed ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-primary" />
            )}
            <span>{copyConfirmed ? "Copied!" : "Copy Text"}</span>
          </button>
        </div>
      </div>

      {/* ── 3. Sign to Speech: Voice Synthesizer Controls ── */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-teal" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Sign to Speech Controls
            </span>
          </div>

          {/* Voice Output Mute/Unmute */}
          <button
            onClick={onToggleVoiceOutput}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold transition-all shadow-2xs ${
              isVoiceOutputEnabled
                ? "border-teal/40 bg-teal-soft text-teal-dark hover:bg-teal-soft/80"
                : "border-border bg-white text-secondary hover:text-foreground"
            }`}
            aria-pressed={isVoiceOutputEnabled}
          >
            {isVoiceOutputEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-teal" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>{isVoiceOutputEnabled ? "Voice: ON" : "Voice: Muted"}</span>
          </button>
        </div>

        {/* Speak Full Sentence Button & Stop Speech */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onSpeakSentence}
            disabled={!transcript}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-teal-hover disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Volume2 className="h-4 w-4" />
            <span>Speak Full Sentence</span>
          </button>

          <button
            onClick={onStopSpeaking}
            className="rounded-xl border border-border bg-white p-2 text-secondary hover:text-foreground hover:bg-slate-100 transition-colors shadow-2xs"
            title="Stop Speech"
          >
            <VolumeX className="h-4 w-4 text-danger" />
          </button>
        </div>

        {/* Speech Speed Slider */}
        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
            <Sliders className="h-3 w-3 text-teal" />
            Speed: <strong className="text-foreground">{speechRate}x</strong>
          </span>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.1"
            value={speechRate}
            onChange={(e) => onChangeSpeechRate(Number(e.target.value))}
            className="w-36 accent-teal cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Quick Assistive Phrase Soundboard Accordion */}
        <div className="pt-2 border-t border-slate-200/70">
          <button
            onClick={() => setIsSoundboardOpen((o) => !o)}
            className="w-full flex items-center justify-between text-xs font-semibold text-secondary hover:text-foreground py-1"
          >
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-teal" />
              <span>Quick Speech Phrases ({ASSISTIVE_PHRASES.length})</span>
            </span>
            {isSoundboardOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {isSoundboardOpen && (
            <div className="grid grid-cols-2 gap-1.5 mt-2 pt-1">
              {ASSISTIVE_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    speakText(phrase.text, `Spoke: "${phrase.text}"`)
                  }
                  className="rounded-lg border border-border bg-white p-2 text-left hover:border-teal hover:bg-teal-soft transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground group-hover:text-teal-dark">
                      {phrase.label}
                    </span>
                    <Volume2 className="h-3 w-3 text-slate-300 group-hover:text-teal" />
                  </div>
                  <p className="text-[10px] text-secondary truncate mt-0.5 font-normal">
                    "{phrase.text}"
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
