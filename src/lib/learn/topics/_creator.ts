import type { LearnTopic } from '../types';

// Creator-economy cluster — second-largest user-base cluster in v1
// signups (~8%). Audience wants channel-specific recipes, not generic
// content theory. Hand-authored marketing copy only; never seeded from
// learner data.

const UPDATED = '2026-05-10';

export const TOPICS_CREATOR: readonly LearnTopic[] = [
  {
    slug: 'youtube',
    title: 'YouTube growth',
    category: 'creator',
    eyebrow: 'Creator · Long-form & Shorts',
    headline: 'Learn YouTube growth — from cold start to a channel that compounds.',
    subhead:
      "Tell Strive what your channel is about — gaming, finance, vlog, niche education — and AI shapes a course around the levers that move the needle there. Lessons stream live, and a daily recall queue keeps the packaging and retention frameworks in your head while you actually upload.",
    metaDescription:
      'Personal AI-built YouTube course — packaging, retention, Shorts, monetization. Tuned to your channel and niche. Daily spaced recall.',
    keywords: [
      'learn youtube growth',
      'youtube course',
      'youtube algorithm',
      'youtube packaging',
      'youtube retention',
      'youtube monetization',
      'ai youtube tutor',
    ],
    outcomes: [
      'Pick a channel positioning that has room to grow without painting you into a corner.',
      'Write titles and design thumbnails that earn the click without baiting it.',
      'Read your retention graph and know which 30 seconds to fix next.',
      'Decide when long-form vs Shorts is the right shape for an idea.',
      'Sequence your first 20 videos so each one feeds the next.',
      'Plan a monetization stack — AdSense, sponsorships, your own product — without diluting the channel.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on YouTube growth',
      modules: [
        { title: 'Positioning — the channel idea that has runway', lessonCount: 4 },
        { title: 'The packaging triangle — title, thumb, intro', lessonCount: 5 },
        { title: 'Retention — reading the graph and fixing the dips', lessonCount: 5 },
        { title: 'Long-form vs Shorts — which idea goes where', lessonCount: 4 },
        { title: 'The first 20 uploads — sequencing for compounding', lessonCount: 4 },
        { title: 'Monetization stack — AdSense, sponsors, products', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: 'Do I need expensive gear to start?',
        answer:
          'No. The course defaults to phone-first setups for the first uploads and treats gear upgrades as a later module — they only matter once your packaging and retention are pulling their weight.',
      },
      {
        question: "I'm under 1,000 subs — is this still useful?",
        answer:
          "Yes — that's most of who this is built for. The wizard asks where you are (zero subs, sub-100, 100-1k, past the gate) and reshapes the curriculum so early-channel work isn't drowned in scaling advice you can't use yet.",
      },
      {
        question: 'Will Strive analyse my actual channel analytics?',
        answer:
          "Not today. The course teaches you to read your retention graph, CTR, and AVD yourself, with worked examples — but Strive doesn't connect to your YouTube Studio. Channel-connected coaching isn't shipped.",
      },
    ],
    estimatedHours: 'Typically 10–16 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'instagram-growth',
    title: 'Instagram growth',
    category: 'creator',
    eyebrow: 'Creator · Reels-led growth',
    headline: 'Learn Instagram growth — Reels-led, without the engagement-pod games.',
    subhead:
      "Strive shapes an Instagram course around what you're growing — a personal brand, a small business, a creator account chasing a niche. Hooks, pillars, posting rhythm, and a recall queue that keeps the Reels playbook in your head while you actually post.",
    metaDescription:
      'Personal AI-built Instagram growth course — Reels hooks, content pillars, posting cadence, and the metrics that matter. Daily spaced recall.',
    keywords: [
      'learn instagram growth',
      'instagram course',
      'instagram reels',
      'instagram hooks',
      'content pillars',
      'small business instagram',
      'ai instagram tutor',
    ],
    outcomes: [
      'Define three to five content pillars that signal what your account is about.',
      'Write Reel hooks that hold the first two seconds, not just the first frame.',
      'Storyboard a Reel that earns watch-time without resorting to clickbait.',
      'Set a posting cadence you can actually keep for ninety days.',
      'Use Stories and the grid to convert a Reel viewer into a follower.',
      'Diagnose a flat account — is it the hook, the pillar, the audience, or the offer?',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Instagram growth',
      modules: [
        { title: 'Pillars — what your account is for, in three lines', lessonCount: 4 },
        { title: 'Reels — hook density and the first two seconds', lessonCount: 5 },
        { title: 'Watch-time — pacing, edits, and the loop', lessonCount: 4 },
        { title: 'Stories and the grid — the conversion layer', lessonCount: 4 },
        { title: 'Cadence and batching — the rhythm you can keep', lessonCount: 3 },
        { title: 'Diagnose a flat account — a worked playbook', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Does the niche-down advice still apply, or is that dated?',
        answer:
          "It still applies, but with nuance — the Reels feed pushes content past your followers, so a clear pillar matters less for reach and more for whether new viewers stick. The course is honest about that trade-off.",
      },
      {
        question: 'Is this for a personal account or a business account?',
        answer:
          "Either. The wizard asks — personal brand, small business, or creator/niche account — and the curriculum shifts examples and the conversion module accordingly. The Reels craft is the same; what you do with the attention isn't.",
      },
      {
        question: 'Does Strive cover paid ads on Instagram?',
        answer:
          "Lightly — there's a section on when paid amplification is worth it. For a full ads playbook, run the Meta Ads course; the two are designed to sit next to each other.",
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'tiktok',
    title: 'TikTok growth',
    category: 'creator',
    eyebrow: 'Creator · Algorithm-first',
    headline: 'Learn TikTok growth — hooks, signals, and the algorithm that actually rewards them.',
    subhead:
      "Strive builds a TikTok course around your starting point — zero followers, a stalled account, or a side-niche you're trying to validate. Hook craft, signal reading, and a recall queue so the principles stay in your head between filming sessions.",
    metaDescription:
      'Personal AI-built TikTok course — hook density, algorithm signals, niche selection, and trend use without trend-chasing. Daily spaced recall.',
    keywords: [
      'learn tiktok',
      'tiktok growth',
      'tiktok algorithm',
      'tiktok hooks',
      'tiktok niche',
      'tiktok for beginners',
      'ai tiktok tutor',
    ],
    outcomes: [
      'Pick a niche narrow enough to read clearly in three videos.',
      'Open a video with a hook that survives a swipe-happy thumb.',
      'Pace a sub-30-second clip so the loop becomes the payoff.',
      'Use a trending sound or format without your video looking like everyone else’s.',
      'Read the analytics signals — completion rate, replays, shares — and know which one to chase.',
      'Recover from the dreaded flat-line week without panic-deleting the account.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on TikTok growth',
      modules: [
        { title: 'Niche — narrow enough to read in three videos', lessonCount: 4 },
        { title: 'Hooks — the first 1.5 seconds and what survives them', lessonCount: 5 },
        { title: 'Pacing and the loop — why short videos feel long', lessonCount: 4 },
        { title: 'Trends without trend-chasing', lessonCount: 3 },
        { title: 'Reading the signals — completion, replays, shares', lessonCount: 4 },
        { title: 'The flat week — diagnose without panic', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'I have zero videos posted — where does the course start?',
        answer:
          "At the start. The wizard asks for your niche idea (or helps you pick one) and the first module covers the absolute beginning — what to film for your first ten videos so you have data to read.",
      },
      {
        question: 'Does it teach me to dance / lip-sync / do trends?',
        answer:
          "Only where they earn their place. The course treats trending sounds and formats as a tool — useful for distribution, easy to misuse — and shows when to lean in versus when to skip.",
      },
      {
        question: 'Is TikTok still worth starting on in 2026?',
        answer:
          "The course is honest about the regulatory uncertainty in some markets and treats TikTok as one platform among several — the hook and pacing skills you build here transfer cleanly to Reels and Shorts.",
      },
    ],
    estimatedHours: 'Typically 6–10 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'personal-brand',
    title: 'Personal brand',
    category: 'creator',
    eyebrow: 'Creator · For B2B & professionals',
    headline: 'Learn to build a personal brand — for your career, your service, your authority.',
    subhead:
      "Strive shapes a personal-brand course around your day job — founder, consultant, engineer, designer, operator — and the platforms that match it. LinkedIn, X, a newsletter, and the connective tissue between them. A recall queue keeps the writing patterns at hand between posts.",
    metaDescription:
      'Personal AI-built personal-brand course — LinkedIn, X, newsletter. Cross-platform authority for founders, consultants, and operators.',
    keywords: [
      'personal brand course',
      'learn personal branding',
      'linkedin growth',
      'twitter growth',
      'newsletter growth',
      'thought leadership',
      'b2b personal brand',
    ],
    outcomes: [
      'Position yourself in one sentence that earns a follow from a stranger.',
      'Write a LinkedIn post that earns saves, not just likes.',
      'Build a thread / long-form post on X that survives the timeline.',
      'Start a newsletter that has a reason to exist beyond the social posts.',
      'Sequence the three platforms so each one feeds the others.',
      'Convert audience attention into inbound — clients, hires, opportunities — without sounding salesy.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on building a personal brand',
      modules: [
        { title: 'Positioning — the sentence that earns a follow', lessonCount: 4 },
        { title: 'LinkedIn — posts that get saved, not just liked', lessonCount: 5 },
        { title: 'X / Twitter — threads, replies, and the timeline', lessonCount: 4 },
        { title: 'The newsletter — the layer the algorithm can’t take away', lessonCount: 4 },
        { title: 'The cross-platform engine — sequencing the three', lessonCount: 3 },
        { title: 'Inbound — turning attention into work, quietly', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: "I don't want to be a 'creator' — is this still for me?",
        answer:
          "Yes — most of the audience for this course isn't either. The framing is professional authority, not entertainment: building a body of public work in your niche so the right people find you. The wizard lets you flag that explicitly.",
      },
      {
        question: 'Do I have to be on all three platforms?',
        answer:
          "No. The wizard asks which you'll commit to and the course narrows. The cross-platform module becomes optional if you pick one. Starting with one is usually the right move.",
      },
      {
        question: 'Does it teach ghostwriting / hiring an agency?',
        answer:
          "It teaches you to do it yourself first, because that's how you learn what's actually worth saying. There's a short section on when delegating writing makes sense and what to keep in-house regardless.",
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
];
