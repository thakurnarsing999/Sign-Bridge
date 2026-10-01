import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

export default function SpeechToSignPanel() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Clean In-Progress Header */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-soft text-teal border border-teal/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">Speech to Sign</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                <Clock className="h-3 w-3" />
                In Progress
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Section reserved for future speech-to-sign implementation.
            </p>
          </div>
        </div>
      </div>

      {/* Blank Workspace Card */}
      <div className="rounded-2xl border border-border bg-surface p-12 sm:p-20 shadow-xs flex flex-col items-center justify-center text-center min-h-[360px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">In Progress</h3>
        <p className="text-xs text-secondary mt-1 max-w-sm">
          This section is kept clean and blank, ready for your custom speech-to-sign implementation.
        </p>
      </div>
    </div>
  );
}
