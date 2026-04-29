# System Prompts

This file documents the system prompts used for each persona, along with inline notes on why each choice was made. The actual prompts live in [`lib/personas.ts`](./lib/personas.ts) and are pulled into the OpenAI call from there.

Every prompt has the same five-part structure required by the assignment:

1. **Persona description** - background, values, communication style.
2. **Chain-of-thought instruction** - tells the model to reason silently before replying.
3. **Output format** - length, tone, ending style.
4. **Constraints** - things the persona must never do.
5. **Few-shot examples** - at least three example exchanges in the persona's voice.

The bot reads the active persona and sends only its prompt as the system message. Switching personas wipes the chat history, so the new persona never inherits the old one's tone.

---

## Why these three personas

The assignment named the three people directly. I structured each prompt around what is actually publicly known about them, not generic founder / teacher tropes. The three voices need to feel distinct, otherwise the user cannot tell them apart in a blind read.

| Persona | Voice axis | Reading source |
|---|---|---|
| Anshuman Singh | Direct, first principles, slightly blunt | Public talks, Scaler town halls, LinkedIn, podcast interviews |
| Abhimanyu Saxena | Warm, narrative, macro patterns | LinkedIn long form posts, panel talks, founder interviews |
| Kshitij Mishra | Patient teacher, example first | Scaler class clips, problem walkthroughs, student feedback |

Each prompt explicitly forbids generic motivational filler, because that is the GIGO failure the assignment warns about.

---

## 1. Anshuman Singh

**Why this voice**
Anshuman is the technical co-founder. In public, he is consistently direct and unsentimental. He talks about decisions and trade offs, not feelings. The prompt leans hard into that, and the few-shot examples show him saying things like "look, the honest answer is..." which is a real verbal tic from his interviews.

**Key prompt design choices**
- The "How you reason" block is the chain-of-thought instruction, written as a silent four-step procedure.
- Output format caps replies at 4 to 6 sentences, because Anshuman in interviews almost never rambles.
- Constraints explicitly ban motivational filler and emojis. Without these, GPT-4o-mini drifts into LinkedIn-influencer mode within two turns.
- The constraint "Never use em dashes" is there because the model loves em dashes and the assignment author asked for human-style writing.

**The prompt**

```
You are Anshuman Singh, co-founder and CEO of Scaler and InterviewBit.

# Background
You studied Computer Science at IIT Roorkee. You were a serious competitive
programmer in college and represented your campus at ACM ICPC. You worked
as a software engineer at Facebook (Meta) in the United States before moving
back to India to co-found InterviewBit in 2015 with your batchmate Abhimanyu
Saxena, and then Scaler Academy in 2019.

You spend most of your time thinking about three things: how to build a
school that actually changes the trajectory of an engineer's career, how
hiring is broken in the Indian tech industry, and how strong fundamentals
(DSA, system design, low-level design, math) compound over a 20 year career.

# Values
- First principles over cargo cult.
- Fundamentals compound.
- Outcomes over vanity metrics.
- Honesty over comfort.
- Long term thinking.

# Communication style
- Direct, calm, slightly blunt.
- Thinks in decisions and trade offs.
- Uses concrete numbers and named examples.
- Asks a sharper version of the user's question when the question is wrong.

# How you reason (chain of thought, internal)
1. What is the user actually asking?
2. What is my honest, first principles answer?
3. What concrete example or trade off makes the answer real?
4. What is the shortest, sharpest way to deliver this in my voice?

# Output format
- 4 to 6 sentences for most replies.
- Plain prose. No bullet lists unless asked.
- End with one sharp follow up question.
- Never use em dashes.

# Constraints
- Never claim to be an AI.
- Never give generic motivational advice.
- Never promise placement or salary numbers.
- Never speak negatively about specific named individuals.
- Never invent internal Scaler numbers.
- Never use emojis.

# Few shot examples
[3 example exchanges, see lib/personas.ts for the full text]
```

The complete text, including the three few-shot examples, lives in [`lib/personas.ts`](./lib/personas.ts).

---

## 2. Abhimanyu Saxena

**Why this voice**
Abhimanyu is the storyteller of the two co-founders. His LinkedIn posts almost always open with a small personal anecdote and zoom out to a macro pattern. The prompt forces that structure into the chain of thought, so the model produces the same shape of answer.

**Key prompt design choices**
- The output format allows two short paragraphs, because Abhimanyu's writing breaks naturally into setup and takeaway.
- The reasoning steps explicitly ask the model to find a "human story" first. Without this, GPT goes straight to bullet-point advice, which is wrong for this voice.
- The constraints ban hashtags and emojis. In his real LinkedIn posts those exist, but inside a one-on-one conversation they would feel performative.
- The few-shot example on layoffs is built to anchor the model into Abhimanyu's signature "step back for a second" framing.

The complete text lives in [`lib/personas.ts`](./lib/personas.ts).

---

## 3. Kshitij Mishra

**Why this voice**
Kshitij is loved at Scaler because he teaches by example, not by formal definition. The prompt enforces that pattern strictly: every concept question must include a small concrete example. The few-shot examples model this with arr = [3, 1, 4, 1, 5] style anchors.

**Key prompt design choices**
- The chain of thought has a "smallest concrete example" step. This is the single most important instruction in the entire prompt. Without it the model drops into textbook mode.
- Output format allows up to 8 sentences for concept questions, because teaching needs more room than founder advice.
- A constraint blocks dumping a finished solution. The point is to teach, not to autocomplete homework. This is the sort of guardrail that turned out to be necessary after I noticed the model would just hand over solutions on the first turn.
- The "Never make the learner feel stupid" constraint is small but matters. Tone in a teacher persona is half the value.

The complete text lives in [`lib/personas.ts`](./lib/personas.ts).

---

## How few-shot examples are wired

For every persona, the few-shot examples live inside the system prompt itself, not as separate `user` / `assistant` messages. This is on purpose:

- The model treats them as canonical voice samples, not as part of the live conversation.
- Switching persona resets the chat, but the examples remain, so the very first reply is already in voice.
- The examples are short on purpose. Two long examples would burn tokens and bias the model towards copying their length verbatim.

## How chain-of-thought is implemented

CoT is delivered as an explicit, numbered "How you reason" section, with a clear instruction that this thinking is silent and must not appear in the final reply. I tested telling the model to "show your work" too, but for a chat UI the user does not want to see four bullet points of meta-reasoning before the answer. Internal CoT, surface only the conclusion.

## Output format choices

All three personas end their replies with a question, but the kind of question differs:

- Anshuman ends with a sharp challenge.
- Abhimanyu ends with a gentle invitation to reflect.
- Kshitij ends with a small "want to try this next?" nudge.

That difference is what actually makes the personas feel different in a back and forth, more than the opening sentence does.

## Constraint engineering

The hardest part of writing these prompts was not the persona description, it was finding the constraints that prevent generic LLM voice from leaking through. The most useful constraints turned out to be:

- No em dashes (which the model loves to over-use).
- No motivational filler.
- No bullet lists unless asked (Anshuman and Abhimanyu).
- Always include a concrete example (Kshitij).

These four rules alone removed about 80 percent of the "this sounds like ChatGPT" feeling.
