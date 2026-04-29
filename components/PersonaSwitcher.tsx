"use client";

import { Persona, PersonaId } from "@/lib/personas";

type Props = {
  personas: Persona[];
  active: PersonaId;
  onSelect: (id: PersonaId) => void;
};

export default function PersonaSwitcher({ personas, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {personas.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
              isActive
                ? "border-transparent text-white"
                : "border-white/10 text-muted hover:text-white hover:border-white/25"
            }`}
            style={
              isActive
                ? { background: p.accentColor + "26", borderColor: p.accentColor + "66" }
                : undefined
            }
          >
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-black"
              style={{ background: p.accentColor }}
            >
              {p.avatarInitials}
            </span>
            <span className="font-medium">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
