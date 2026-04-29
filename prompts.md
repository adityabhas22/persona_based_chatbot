# System Prompts

This file documents the system prompts used for each persona, along with notes on why each choice was made and the research that backs it. The actual prompts live in [`lib/personas.ts`](./lib/personas.ts) and are pulled into the OpenAI call from there.

Every prompt has the same five-part structure required by the assignment:

1. **Persona description** - background, values, communication style, all backed by public sources.
2. **Chain-of-thought instruction** - tells the model to reason silently before replying.
3. **Output format** - length, tone, ending style.
4. **Constraints** - things the persona must never do.
5. **Few-shot examples** - at least three example exchanges in the persona's voice.

The bot reads the active persona and sends only its prompt as the system message. Switching personas wipes the chat history, so the new persona never inherits the old one's tone.

---

## Why these three personas

The assignment named the three people directly, all three are connected to Scaler, and all three are IIIT Hyderabad alumni. Anshuman and Abhimanyu were 2010 batchmates, Kshitij joined later (2009 to 2014). I structured each prompt around what is actually publicly known and what they actually say in interviews, podcasts, and LinkedIn posts.

| Persona | Voice axis | Sources used |
|---|---|---|
| Anshuman Singh | Direct, first principles, numbers driven, articulate problem solver | Founder Thesis dossier, Authority Magazine interview, Desi VC podcast, IIIT Hyderabad alumni profile, scaler.com/about |
| Abhimanyu Saxena | Warm, narrative, analogy heavy, first principles | Wonderment Apps Full Stack Leader interview, StartupTalky Q&A, IIIT Hyderabad alumni profile, scaler.com blog, public LinkedIn lines |
| Kshitij Mishra | Disciplined teacher, example first, long game | Public LinkedIn posts, CollegeBatch student reviews, Scaler course reports, Quora threads about Scaler instructors |

Every prompt explicitly forbids generic motivational filler, since that is the GIGO failure the assignment warns about.

---

## 1. Anshuman Singh

**Voice in one line**: clear, direct, no nonsense, articulate problem solver. This was the user's brief, and it lined up with what the public sources show.

**Verified facts that went into the prompt**

- IIIT Hyderabad, batch of 2010.
- Two time ACM ICPC World Finalist for India.
- Started at Directi as a consultant, helped scale CodeChef.
- Moved to the US in 2010 and joined Facebook (Meta), one of the first engineers hired directly from India.
- On the team that built Facebook Messenger.
- Co led the hiring panel for India and Hong Kong within months of joining.
- Helped set up the Facebook engineering office in London.
- Co founded InterviewBit (2015) and Scaler (2019), both with batchmate Abhimanyu Saxena.
- Scaler raised over 55 million dollars at around 700 to 710 million dollars valuation, but he does not lead with this.
- Public framing: Scaler as an "online Stanford" for working engineers.

**Voice cues that went into the prompt**

- He frames problems before solutions. Almost every interview answer starts with "the broken thing is...".
- Heavy use of specific numbers: rejection rates, engagement minutes, percent of engineers who fail at system design.
- A real public line: "content is hygiene, the real secret sauce of education is engagement, addiction, and the ecosystem you build around the learner".
- Comfort with disagreement, will sharpen the user's question before answering.
- Verbal patterns: "look, the honest answer is...", "let us think about this from first principles", "the real question is not X, it is Y".

**Key prompt design choices**

- Output length capped at 4 to 6 sentences. He is not a rambler in interviews.
- Every reply must include either one specific number or one named example (Facebook, ICPC, Scaler), to lock in the data driven feel.
- Bullet lists banned by default. He speaks in prose.
- "Never give generic motivational advice" is the single most important constraint. Without it, GPT-4o-mini drifts into LinkedIn-influencer mode within two turns.
- "Never use em dashes" is a constraint both because of the model's habit and because the user prefers human style writing.
- Few-shot examples bake in his real verbal patterns and his Facebook hiring panel reference, so the model can pull from them naturally.

The complete prompt lives in [`lib/personas.ts`](./lib/personas.ts).

---

## 2. Abhimanyu Saxena

**Voice in one line**: warm, narrative, loves analogies and examples, explains from first principles. This was the user's brief and the public sources confirm it strongly.

**Verified facts that went into the prompt**

- IIIT Hyderabad, B.Tech CS, 2010 batch. Transferred in from NIT Nagpur after one year, calls it "my first rebellion".
- Co founded Daksh Home Automation Systems on campus in 2008 with batchmate Jayraj Bhattacharya, later acquired by a Malta based firm.
- Joined Progress Software in 2010, then Fab.com in New York for over three years, with stints in Berlin and Pune.
- Led front end design at Fab and was active in their hiring and learning programs.
- Co founded InterviewBit (2015) and Scaler (2019).
- Stated mission: "a million Indian software engineers leading the global tech industry".
- Says publicly that the founder he admires most is Sridhar Vembu of Zoho.

**Voice cues that went into the prompt**

- Heavy analogy use. His signature is comparing tech education to medical training: surgeons train under practising surgeons, engineers in India are mostly taught by people who have never shipped real software.
- Always anchors abstract arguments in a small concrete story.
- Direct quotes used in the prompt:
  - "if you have smart people, you want to tell them what you want them to achieve, not how"
  - "whatever you do, it must pass the litmus test that you are okay with it being published"
  - "this was in no way a reflection of individual performance" (about Scaler's restructuring)
- Verbal patterns: "let me give you an analogy", "step back for a second", "from first principles", "the way I think about it is", "the demand supply gap...".
- Tone: measured, never aggressive. Reflective, will publicly say "we got this wrong".

**Key prompt design choices**

- Output allows two short paragraphs, because his LinkedIn writing breaks naturally into setup and takeaway.
- The chain of thought has an explicit step that says "find an analogy from outside tech". Without this, GPT skips straight to bullet point advice and the persona breaks.
- A constraint says every non trivial answer must include either an analogy or a concrete example. This is the single most important rule for this persona.
- Bans hashtags and emojis, even though he uses them on LinkedIn, because in a one on one conversation they would feel performative.
- Few-shot examples explicitly include the medicine analogy and a sports analogy, so the model has at least two style anchors to mimic.

The complete prompt lives in [`lib/personas.ts`](./lib/personas.ts).

---

## 3. Kshitij Mishra

**Voice in one line**: disciplined, methodical, example first, plays the long game. The user's brief described him as "a very disciplined man" who teaches DSA and software principles, and that lined up with public sources.

**Verified facts that went into the prompt**

- IIIT Hyderabad, Computer Science and Engineering, 2009 to 2014.
- Research Intern at LTRC IIIT Hyderabad (2011), Teaching Assistant (2013), Research Assistant at the Language Technologies Research Centre (2014 to 2015).
- Sports Coordinator on campus, Special Mention Award winner.
- Software Engineer at Snapdeal (2015 to 2017), then Software Engineer II. Part of a two member SDE team that managed Snapdeal Seller Search and moved it from the most expensive AWS instance class to the cheapest in four months.
- Lead Software Engineer at InterviewBit (2017 to 2020), built parts of the hiring automation platform.
- Joined Scaler Academy in 2019 to teach "just 2 classes", which became a "life changing journey".
- Now Head of Instructors at Scaler Academy and Dean of Scaler School of Technology, Bangalore.
- Side interests: machine translation, NLP, computer vision, satellite imagery, Indian classical arts (SPIC MACAY), open geospatial tech (FOSS4G).

The earlier draft of this prompt incorrectly said he was ex Microsoft and ex Amazon. That was a research failure on my side and was corrected after the user flagged it.

**Voice cues that went into the prompt**

- Real public quotes:
  - "Practice delayed gratification, trust the long game, focus on growth, not just instant results."
  - "Never imagined I would be walking this path, from struggling with code to now guiding future technologists."
  - Pushes learners from "how do I implement this" to "should this exist, who is this for, how will this scale".
- Style: warm, energetic, slightly playful, but never sloppy.
- Always opens with a tiny concrete example, then generalises.
- Honest about having struggled with code himself, which is a humanising and pedagogical asset.

**Key prompt design choices**

- The chain of thought includes a step "what is the smallest concrete example that captures this concept". This is the single most important step for this persona.
- A constraint blocks dumping a finished solution. The point is to teach, not to autocomplete homework.
- The "Never make the learner feel stupid" constraint is small but important. Tone in a teacher persona is half the value.
- The "I will give you a real example" pattern in one of the few shots is anchored to his real Snapdeal Seller Search story, which gives the model a concrete reusable hook.
- Output cap of 5 to 8 sentences, longer than Anshuman's because teaching needs more room than founder advice.

The complete prompt lives in [`lib/personas.ts`](./lib/personas.ts).

---

## How few shot examples are wired

For every persona, the few shot examples live inside the system prompt itself, not as separate user / assistant messages. This is on purpose:

- The model treats them as canonical voice samples, not as part of the live conversation.
- Switching persona resets the chat, but the examples remain, so the very first reply is already in voice.
- The examples are short on purpose. Two long examples would burn tokens and bias the model towards copying their length verbatim.

## How chain of thought is implemented

CoT is delivered as an explicit, numbered "How you reason" section, with a clear instruction that this thinking is silent and must not appear in the final reply. I tested telling the model to "show your work" too, but for a chat UI the user does not want to see four bullet points of meta reasoning before the answer. Internal CoT, surface only the conclusion.

## Output format choices

All three personas end their replies with a question, but the kind of question differs:

- Anshuman ends with a sharp challenge.
- Abhimanyu ends with a gentle invitation to reflect.
- Kshitij ends with a small "want to try this next?" nudge.

That difference is what actually makes the personas feel different in a back and forth, more than the opening sentence does.

## Constraint engineering

The hardest part of writing these prompts was not the persona description, it was finding the constraints that prevent generic LLM voice from leaking through. The most useful constraints turned out to be:

- No em dashes (which the model loves to over use).
- No motivational filler.
- No bullet lists unless asked (Anshuman and Abhimanyu).
- Always include either an analogy or a concrete example (Abhimanyu).
- Always include a concrete example (Kshitij).

These four rules removed about 80 percent of the "this sounds like ChatGPT" feeling.
