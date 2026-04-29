"use client";

type Props = {
  questions: string[];
  onPick: (q: string) => void;
  disabled?: boolean;
};

export default function SuggestionChips({ questions, onPick, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onPick(q)}
          disabled={disabled}
          className="rounded-full border border-white/10 bg-panel/60 px-3 py-1.5 text-sm text-muted transition hover:border-white/30 hover:text-white disabled:opacity-50"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
