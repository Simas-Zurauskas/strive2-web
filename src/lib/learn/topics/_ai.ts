import type { LearnTopic } from '../types';

// AI & automation cluster — five topics covering the demand signals
// surfaced in USER_BASE.md (prompt engineering, no-code automations,
// LLM app building). Hand-authored marketing copy only; no fields are
// derived from any individual learner's generated course.

const UPDATED = '2026-05-10';

export const TOPICS_AI: readonly LearnTopic[] = [
  {
    slug: 'prompt-engineering',
    title: 'Prompt engineering',
    category: 'business',
    eyebrow: 'AI · For knowledge workers',
    headline: 'Learn prompt engineering — for the work you actually ship.',
    subhead:
      'Tell Strive what you ask ChatGPT, Claude, or Gemini for at work — research, drafting, analysis, code reviews, customer replies — and AI shapes the curriculum around those outputs. Lessons stream live, and the recall queue keeps the patterns sharp instead of half-remembered.',
    metaDescription:
      'Personal AI-built prompt engineering course tuned to the outputs you need at work. Live-streaming lessons and a daily spaced-recall queue keep it.',
    keywords: [
      'learn prompt engineering',
      'prompt engineering course',
      'chatgpt course',
      'claude prompting',
      'ai prompts for work',
      'prompt engineering for beginners',
      'how to use chatgpt better',
    ],
    outcomes: [
      'Write prompts that produce the output you actually wanted on the first try.',
      'Diagnose why a prompt is failing — vague task, missing context, or wrong format.',
      'Use role, format, examples, and constraints as deliberate levers, not folklore.',
      'Chain prompts for multi-step work that one shot can’t handle.',
      'Recognise the gap between ChatGPT, Claude, and Gemini and pick by task.',
      'Build a personal prompt library you reuse instead of rewriting.',
      'Spot hallucinations and red flags before they reach a teammate or a client.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on prompt engineering',
      modules: [
        { title: 'Why prompts fail — the four usual suspects', lessonCount: 4 },
        { title: 'Role, task, format — the skeleton of a working prompt', lessonCount: 5 },
        { title: 'Few-shot examples and when they earn their tokens', lessonCount: 4 },
        { title: 'Chain-of-thought, scratchpads, and structured reasoning', lessonCount: 4 },
        { title: 'Multi-step work — chaining, drafting, then refining', lessonCount: 4 },
        { title: 'ChatGPT vs Claude vs Gemini — pick by task, not by habit', lessonCount: 3 },
        { title: 'Your prompt library — building a reusable kit', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this course technical? Do I need to code?',
        answer:
          'No code required. The whole course is text prompts and worked examples in the chat tools you already use. The wizard checks your role and tools so the examples match — analyst prompts look different from marketer prompts.',
      },
      {
        question: 'Will the prompts go stale when models update?',
        answer:
          'The principles travel — role, format, examples, and decomposition apply across model generations. Specific tricks tied to one model version come with a note saying so, and the recall queue surfaces the durable patterns more often than the fragile ones.',
      },
      {
        question: 'Does it cover building AI apps with the API?',
        answer:
          'Not here — this course is about getting more out of the chat tools. If you want the developer track (APIs, structured outputs, evals), run the wizard on LLM engineering instead.',
      },
    ],
    estimatedHours: 'Typically 6–10 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'ai-for-work',
    title: 'AI for work',
    category: 'business',
    eyebrow: 'AI · Practical recipes',
    headline: 'Learn AI for work — the recipes that save you hours.',
    subhead:
      'A course shaped around your job — analyst, PM, ops, marketer, support, recruiter — and the tasks that eat your week. Strive picks the AI recipes that fit, streams lessons live, and the recall queue keeps them in muscle memory instead of buried in a Notion page you never reopen.',
    metaDescription:
      'Personal AI-built course on using AI at work. Practical recipes for your role, streaming lessons, and a daily spaced-recall queue.',
    keywords: [
      'ai for work',
      'chatgpt for work',
      'ai productivity course',
      'ai for analysts',
      'ai for project managers',
      'ai tools for office work',
      'ai for marketers',
    ],
    outcomes: [
      'Recognise which weekly tasks are AI-shaped and which are not worth the effort.',
      'Draft, summarise, and reformat documents with prompts that need almost no editing.',
      'Pull structure out of messy inputs — meeting notes, emails, transcripts, spreadsheets.',
      'Use AI as a thinking partner for analysis without letting it bluff you.',
      'Build a small kit of saved prompts you reach for instead of starting from scratch.',
      'Set sensible guardrails for what you do and do not paste into a chat tool at work.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on AI for work',
      modules: [
        { title: 'What AI is good at, and what it just looks good at', lessonCount: 3 },
        { title: 'The five recipes you’ll use every week', lessonCount: 5 },
        { title: 'Meetings, notes, and turning talk into text that ships', lessonCount: 4 },
        { title: 'Spreadsheets and messy data — getting AI to tidy up', lessonCount: 4 },
        { title: 'Email, drafts, and the second-brain inbox', lessonCount: 3 },
        { title: 'Guardrails — what stays out of the chat window', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'I’m not technical. Will this work for me?',
        answer:
          'Yes — that is the audience. Every example is a prompt typed into ChatGPT, Claude, or Gemini, plus the file or doc you start with. No APIs, no code, no setup beyond a free chat account.',
      },
      {
        question: 'Can it tailor to my role?',
        answer:
          'Yes. The wizard asks what you do and what tasks eat your week, and the recipes are picked from there. An analyst’s course leans on data wrangling; a PM’s leans on writing and meeting follow-up.',
      },
      {
        question: 'Does Strive integrate with my work tools?',
        answer:
          'Not directly — the course is teaching, not an integration. You take what you learn into ChatGPT, Claude, Gemini, Copilot, or whichever tool your company has approved.',
      },
    ],
    estimatedHours: 'Typically 5–8 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'no-code-automation',
    title: 'No-code automation',
    category: 'business',
    eyebrow: 'AI · Wiring tools without code',
    headline: 'Learn no-code automation — wire your tools without writing code.',
    subhead:
      'Tell Strive what tools your day runs on — Gmail, Slack, Notion, Airtable, HubSpot, Sheets — and AI shapes a curriculum that connects them. Lessons stream live, and the recall queue keeps the trigger-action-filter logic from blurring after you build the first workflow.',
    metaDescription:
      'Personal AI-built no-code automation course on n8n, Zapier, and Make.com. Triggers, actions, filters, and a daily spaced-recall queue.',
    keywords: [
      'learn no-code automation',
      'n8n course',
      'zapier course',
      'make.com tutorial',
      'no code automation for beginners',
      'workflow automation course',
      'automate without code',
    ],
    outcomes: [
      'Build a working trigger-action-filter workflow on n8n, Zapier, or Make.',
      'Recognise which tasks deserve automation and which are easier left manual.',
      'Move data between apps using webhooks, API keys, and the built-in connectors.',
      'Handle errors, retries, and the silent failures that wreck unattended workflows.',
      'Layer AI steps into a workflow without it becoming the most expensive part.',
      'Maintain and debug a workflow weeks after you wrote it.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on no-code automation',
      modules: [
        { title: 'The trigger-action-filter mental model', lessonCount: 3 },
        { title: 'Pick your platform — n8n, Zapier, or Make', lessonCount: 3 },
        { title: 'Connecting the apps you already pay for', lessonCount: 4 },
        { title: 'Webhooks, API keys, and the parts vendors hide', lessonCount: 4 },
        { title: 'AI steps inside a workflow — useful vs expensive', lessonCount: 4 },
        { title: 'Error handling, retries, and quiet failures', lessonCount: 3 },
        { title: 'A worked build — your first useful automation', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Which platform does the course use?',
        answer:
          'You pick during the wizard — n8n (open source / self-host), Zapier (easiest onboarding), or Make.com (most flexible visual builder). Examples and the worked build use that platform throughout.',
      },
      {
        question: 'Do I really not need to write any code?',
        answer:
          'For most workflows, no — drag, drop, map fields. A few lessons show light JavaScript expressions inside Zapier or n8n where the no-code path can’t quite reach, but they are optional and explained from zero.',
      },
      {
        question: 'Does it cover hosting n8n yourself?',
        answer:
          'Briefly. The course points at Docker and the major hosted options without turning into a sysadmin tutorial. If self-hosting is your main interest, you’ll want a separate DevOps-flavoured course on top.',
      },
    ],
    estimatedHours: 'Typically 7–12 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'llm-engineering',
    title: 'LLM engineering',
    category: 'programming',
    eyebrow: 'AI · For developers building apps',
    headline: 'Learn LLM engineering — for the app you’re actually building.',
    subhead:
      'Strive shapes an LLM-engineering course around what you’re shipping: a chatbot, an agent, a copilot, a backend that calls a model. Provider APIs, structured outputs, evals, cost control, latency. Lessons stream live, and the recall queue keeps the patterns from rotting between sprints.',
    metaDescription:
      'Personal AI-built LLM engineering course — APIs, structured outputs, evals, and cost control. Lessons stream live with daily spaced recall.',
    keywords: [
      'learn llm engineering',
      'llm course for developers',
      'openai api tutorial',
      'anthropic api course',
      'building with llms',
      'structured outputs llm',
      'llm evals tutorial',
    ],
    outcomes: [
      'Call OpenAI, Anthropic, and Gemini APIs with sensible defaults and clean abstractions.',
      'Get reliable structured outputs using JSON mode, tool use, and schema validation.',
      'Design evals that catch regressions before users do, not after.',
      'Control cost and latency with caching, streaming, batching, and the right model tier.',
      'Implement tool use and function calling without the agent going off-script.',
      'Reason about retries, timeouts, and what to do when a provider has a bad day.',
      'Pick between a thin wrapper, an agent loop, and a workflow for the job at hand.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on LLM engineering',
      modules: [
        { title: 'The provider landscape — OpenAI, Anthropic, Gemini, the rest', lessonCount: 3 },
        { title: 'Calls, streams, and the parts of the request that matter', lessonCount: 4 },
        { title: 'Structured outputs — JSON mode, tool use, schema validation', lessonCount: 5 },
        { title: 'Tool use and function calling without the rails coming off', lessonCount: 4 },
        { title: 'Evals — the only way you know it still works', lessonCount: 4 },
        { title: 'Cost, latency, and the dials you can actually turn', lessonCount: 4 },
        { title: 'Failure modes — retries, timeouts, provider weather', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Which language does the course use?',
        answer:
          'You pick during the wizard — TypeScript or Python, the two ecosystems where the SDKs are first-class. Examples, the eval harness, and the project use that language throughout.',
      },
      {
        question: 'Does it cover RAG and vector search?',
        answer:
          'Lightly. RAG gets enough coverage to know when to reach for it; for the full retrieval-and-evaluation track, run the wizard on RAG and LangChain instead.',
      },
      {
        question: 'How current are the model and SDK references?',
        answer:
          'Each generation is fresh, so the course reflects the providers as they stand when you build it. The course also flags the parts most likely to drift — pricing, context windows, model names — so you know where to double-check vendor docs.',
      },
    ],
    estimatedHours: 'Typically 14–22 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'langchain-rag',
    title: 'RAG & LangChain',
    category: 'programming',
    eyebrow: 'AI · Retrieval and evaluation',
    headline: 'Learn RAG and LangChain — without the demo-day shortcuts.',
    subhead:
      'A course built around the RAG system you actually want to ship: your documents, your retrieval problem, your acceptance bar. Strive shapes the curriculum, streams lessons live, and the recall queue keeps the chunking, embedding, and evaluation choices straight when you revisit them six weeks later.',
    metaDescription:
      'Personal AI-built RAG & LangChain course — embeddings, vector stores, retrieval strategies, and evals. Live lessons and daily spaced recall.',
    keywords: [
      'learn rag',
      'langchain course',
      'rag tutorial',
      'vector database course',
      'embeddings tutorial',
      'llamaindex course',
      'retrieval augmented generation',
    ],
    outcomes: [
      'Build a working RAG pipeline end-to-end — ingest, chunk, embed, retrieve, generate.',
      'Pick chunking and embedding strategies that match your documents, not a tutorial’s.',
      'Compare vector stores (pgvector, Pinecone, Weaviate, Qdrant) on the trade-offs that bite.',
      'Use hybrid search and rerankers to recover the recall a naive top-k loses.',
      'Evaluate retrieval and generation separately so you know which half is broken.',
      'Recognise when RAG is the wrong answer — long-context, fine-tuning, or just better prompts.',
      'Decide between LangChain, LlamaIndex, and a hand-rolled stack for your project.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on RAG & LangChain',
      modules: [
        { title: 'Why naive RAG demos lie — and what real systems look like', lessonCount: 3 },
        { title: 'Ingestion and chunking — choices that haunt you later', lessonCount: 4 },
        { title: 'Embeddings — picking a model and an index that match', lessonCount: 4 },
        { title: 'Vector stores compared — pgvector, Pinecone, Weaviate, Qdrant', lessonCount: 4 },
        { title: 'Hybrid search, rerankers, and the recall you’re losing', lessonCount: 4 },
        { title: 'LangChain and LlamaIndex — what they’re for and when to skip them', lessonCount: 3 },
        { title: 'Evals — retrieval metrics, generation metrics, and what users notice', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: 'Do I need to use LangChain?',
        answer:
          'No. The course covers LangChain because it is the most common starting point, but every module is honest about when a hand-rolled stack or LlamaIndex is the better call. You leave knowing why you chose what you chose.',
      },
      {
        question: 'Which vector database does it use?',
        answer:
          'You pick during the wizard — pgvector, Pinecone, Weaviate, Qdrant, or Chroma. The worked pipeline uses your choice; the comparison module covers the others so the decision is informed, not accidental.',
      },
      {
        question: 'Will this teach me to fine-tune embedding models?',
        answer:
          'Briefly — fine-tuning gets a lesson on when it earns the work and how to set up a run. Deep training-loop content is out of scope; the course is aimed at engineers shipping retrieval, not researchers building new encoders.',
      },
    ],
    estimatedHours: 'Typically 12–20 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
];
