import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getPersona } from "@/lib/personas";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  personaId: string;
  messages: ChatMessage[];
};

const MAX_HISTORY = 20;

export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { personaId, messages } = body;

  if (!personaId || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "personaId and messages are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is not configured. Missing OPENAI_API_KEY." },
      { status: 500 }
    );
  }

  const persona = getPersona(personaId);
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role,
    content: String(m.content || "").slice(0, 4000),
  }));

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: persona.systemPrompt },
        ...trimmed,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "";

    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from the model. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply, persona: persona.id });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error calling the model.";
    console.error("chat api error:", message);

    const status = message.toLowerCase().includes("rate limit") ? 429 : 500;
    return NextResponse.json(
      {
        error:
          status === 429
            ? "We are being rate limited right now. Try again in a moment."
            : "Something went wrong while reaching the model. Please try again.",
      },
      { status }
    );
  }
}
