"use client";

import { Persona } from "@/lib/personas";

export default function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-end gap-3 bubble-fade">
      <div
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-black"
        style={{ background: persona.accentColor }}
        aria-hidden
      >
        {persona.avatarInitials}
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-panel px-4 py-3">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}
