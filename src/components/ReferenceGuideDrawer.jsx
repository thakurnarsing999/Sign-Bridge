import { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  BookOpen,
  GraduationCap,
  Type,
  Hash,
  Sparkles,
} from "lucide-react";
import { ISL_ALPHABETS, ISL_DIGITS } from "../data/islData";
import SignGlyph from "./SignGlyph";

export default function ReferenceGuideDrawer({
  isOpen,
  onClose,
  currentLetter,
  onPracticeSign,
}) {
  const [activeTab, setActiveTab] = useState("alphabets");
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef(null);

  // Close on Escape key
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

  const filteredAlphabets = ISL_ALPHABETS.filter(
    (item) =>
      item.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDigits = ISL_DIGITS.filter(
    (item) =>
      item.digit.includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reference-guide-title"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-surface border-l border-border shadow-2xl transition-transform duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-soft text-teal border border-teal/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="reference-guide-title"
                className="text-base font-bold text-foreground"
              >
                ISL Reference Guide
              </h2>
              <p className="text-xs text-secondary">
                Indian Sign Language standard hand poses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-secondary hover:text-foreground hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close reference guide"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Search & Tabs Controls */}
        <div className="border-b border-border p-4 bg-slate-50/70 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sign, letter, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-foreground placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>

          {/* Segmented Mode Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
            <button
              onClick={() => setActiveTab("alphabets")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === "alphabets"
                  ? "bg-primary text-white shadow-xs"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>A–Z Alphabets ({filteredAlphabets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("digits")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === "digits"
                  ? "bg-primary text-white shadow-xs"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>1–9 Numbers ({filteredDigits.length})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Sign Cards List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-2.5">
          {activeTab === "alphabets" && (
            <>
              {filteredAlphabets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No alphabet signs match "{searchQuery}"
                </div>
              ) : (
                filteredAlphabets.map((item) => {
                  const isActive = currentLetter === item.letter;
                  return (
                    <div
                      key={item.letter}
                      className={`rounded-xl border p-3 transition-all ${
                        isActive
                          ? "border-teal bg-teal-soft shadow-xs ring-1 ring-teal"
                          : "border-border bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-base font-black ${
                              isActive
                                ? "bg-teal text-white shadow-xs"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {item.letter}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-foreground">
                              {item.name}
                            </span>
                            {isActive && (
                              <span className="ml-2 inline-flex items-center gap-1 rounded bg-teal/20 px-1.5 py-0.2 text-[10px] font-bold text-teal-dark">
                                <Sparkles className="h-2.5 w-2.5" /> Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Practice This Sign Button */}
                        <button
                          onClick={() => {
                            onClose();
                            onPracticeSign(item.letter, "alphabets");
                          }}
                          className="flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-secondary hover:text-foreground hover:bg-slate-100 transition-colors"
                          title={`Practice sign for ${item.letter}`}
                        >
                          <GraduationCap className="h-3 w-3 text-teal" />
                          <span>Practice</span>
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-secondary leading-relaxed font-normal">
                        {item.desc}
                      </p>
                      {item.tip && (
                        <p className="mt-1 text-[11px] text-teal-dark font-medium">
                          Tip: {item.tip}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === "digits" && (
            <>
              {filteredDigits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No digit signs match "{searchQuery}"
                </div>
              ) : (
                filteredDigits.map((item) => {
                  const isActive = currentLetter === item.digit;
                  return (
                    <div
                      key={item.digit}
                      className={`rounded-xl border p-3 transition-all ${
                        isActive
                          ? "border-teal bg-teal-soft shadow-xs ring-1 ring-teal"
                          : "border-border bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-base font-black ${
                              isActive
                                ? "bg-teal text-white shadow-xs"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {item.digit}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {item.name}
                            </span>
                            <div className="text-teal">
                              <SignGlyph
                                symbol={item.digit}
                                className="w-5 h-5"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Practice This Sign Button */}
                        <button
                          onClick={() => {
                            onClose();
                            onPracticeSign(item.digit, "digits");
                          }}
                          className="flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-secondary hover:text-foreground hover:bg-slate-100 transition-colors"
                          title={`Practice sign for ${item.digit}`}
                        >
                          <GraduationCap className="h-3 w-3 text-teal" />
                          <span>Practice</span>
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-secondary leading-relaxed font-normal">
                        {item.desc}
                      </p>
                      {item.tip && (
                        <p className="mt-1 text-[11px] text-teal-dark font-medium">
                          Tip: {item.tip}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-border p-3.5 bg-slate-50 text-center">
          <p className="text-[11px] text-secondary">
            Indian Sign Language (ISL) Fingerspelling Standard
          </p>
        </div>
      </div>
    </div>
  );
}
