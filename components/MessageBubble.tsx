"use client";

import { Persona } from "@/lib/personas";

type Props = {
  role: "user" | "assistant";
  content: string;
  persona: Persona;
};

export default function MessageBubble({ role, content, persona }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full gap-3 bubble-fade ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-black"
          style={{ background: persona.accentColor }}
          aria-hidden
        >
          {persona.avatarInitials}
        </div>
      )}
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "bg-accent/20 text-white border border-accent/30 rounded-tr-sm"
            : "bg-panel text-white/90 border border-white/5 rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
