# Reflection

## What worked

The biggest lever was research. My first version of the Anshuman prompt was generic ("a no-nonsense founder who values fundamentals"). The replies were generic too, they could have come from any founder. The persona only felt real once I read his LinkedIn posts, watched a couple of interviews, and noted phrases he actually repeats. Once "look, the honest answer is..." and "first principles" went in as real verbal tics, the voice locked in.

The same thing happened with Abhimanyu. His posts have a specific shape: small story, macro pattern, one takeaway. Once I encoded that shape into the chain-of-thought steps, the model started producing answers in his rhythm without me coaching each reply.

For Kshitij, the unlock was one rule: every concept answer must include a small concrete example like arr = [3, 1, 4, 1, 5]. That one constraint turned the answers from "textbook explainer" into a teacher walking you through a problem.

## What GIGO taught me

GIGO was the most useful idea from the lecture, and I felt it every time I cut corners. When I wrote a vague constraint like "be friendly", the model produced friendly nothing. When I wrote a sharp constraint like "never give generic motivational advice, never use emojis, never use bullet lists unless asked", the answers improved on the very next turn. The model is a mirror. Mushy prompt, mushy output. Specific prompt, specific output.

GIGO also taught me that quantity is not quality. My second draft of the Anshuman prompt was almost twice as long as the final one, and the longer version was worse, because the model started averaging across all the instructions instead of following them. The final prompt is tight: five clear sections and three short few-shot examples. Less room for the model to drift.

## What I would improve

Three things, in order of impact.

First, streaming. Right now the user waits for the full response. Streaming tokens would make the typing indicator feel like a real conversation instead of a loading spinner.

Second, per-turn evals. A small set of test questions per persona, with a rubric for "is this in voice", run after every prompt change. Right now I am eyeballing it. With evals I could iterate aggressively without worrying about regressions.

Third, a "show me the reasoning" toggle. The chain of thought is silent today, which is right for a chat UI. But for someone studying prompt engineering, surfacing the model's internal four-step reasoning on demand would be a real teaching feature, because it makes the structure of each persona's thinking visible.

The deeper lesson is that prompt engineering is closer to product writing than to programming. You are not telling a machine what to do, you are telling a very impressionable actor who their character is. The clearer and more specific the brief, the better the performance. The vaguer the brief, the more the actor falls back on their own habits, and the model's default habits are very loud.
