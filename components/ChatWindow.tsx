"use client";

import { useEffect, useRef, useState } from "react";
import { Persona, PersonaId, personaList } from "@/lib/personas";
import PersonaSwitcher from "./PersonaSwitcher";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestionChips from "./SuggestionChips";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversations = Record<PersonaId, Message[]>;

const emptyConvos = (): Conversations => ({
  anshuman: [],
  abhimanyu: [],
  kshitij: [],
});

export default function ChatWindow() {
  const [activeId, setActiveId] = useState<PersonaId>("anshuman");
  const [convos, setConvos] = useState<Conversations>(emptyConvos());
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const persona: Persona = personaList.find((p) => p.id === activeId) || personaList[0];
  const messages = convos[activeId];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, activeId]);

  function switchPersona(id: PersonaId) {
    if (id === activeId) return;
    setActiveId(id);
    setConvos((prev) => ({ ...prev, [id]: [] }));
    setInput("");
    setError(null);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setError(null);
    const nextHistory: Message[] = [
      ...convos[activeId],
      { role: "user", content: trimmed },
    ];
    setConvos((prev) => ({ ...prev, [activeId]: nextHistory }));
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: activeId,
          messages: nextHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      const reply = String(data.reply || "");
      setConvos((prev) => ({
        ...prev,
        [activeId]: [...prev[activeId], { role: "assistant", content: reply }],
      }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const showStarter = messages.length === 0 && !isSending;

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-3xl flex-col">
      <header className="border-b border-white/5 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Scaler Personas</h1>
              <p className="text-xs text-muted">
                Talk to three real people from the Scaler world. Pick one to start.
              </p>
            </div>
            <span
              className="hidden rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-flex"
              style={{
                background: persona.accentColor + "26",
                color: persona.accentColor,
                border: `1px solid ${persona.accentColor}66`,
              }}
            >
              Talking to {persona.name}
            </span>
          </div>
          <PersonaSwitcher
            personas={personaList}
            active={activeId}
            onSelect={switchPersona}
          />
          <div className="rounded-xl border border-white/5 bg-panel/60 p-3 text-xs text-muted">
            <span className="font-medium text-white/80">{persona.title}.</span>{" "}
            {persona.shortBio}
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {showStarter && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Try one of these to get started, or just type your own question.
            </p>
            <SuggestionChips
              questions={persona.starterQuestions}
              onPick={(q) => sendMessage(q)}
              disabled={isSending}
            />
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} persona={persona} />
        ))}

        {isSending && <TypingIndicator persona={persona} />}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-white/5 px-4 py-3 sm:px-6">
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-panel px-3 py-2 focus-within:border-white/30">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Ask ${persona.name.split(" ")[0]} anything...`}
            rows={1}
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[15px] text-white placeholder:text-muted focus:outline-none"
            disabled={isSending}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isSending || !input.trim()}
            className="rounded-xl px-3 py-1.5 text-sm font-medium text-black transition disabled:opacity-40"
            style={{ background: persona.accentColor }}
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted">
          Replies are generated by an LLM acting in character. Treat it as a fun
          simulation, not the real person.
        </p>
      </div>
    </div>
  );
}
