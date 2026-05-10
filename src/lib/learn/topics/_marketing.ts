import type { LearnTopic } from '../types';

// Marketing & SEO cluster — small-business owners, e-commerce sellers,
// freelancers, and creators who need playbooks they can run on Monday.
// Voice match: meta-ads (existing). Plainspoken, slightly irreverent.
//
// Privacy: hand-authored marketing copy only. Never seed from learner data.

const UPDATED = '2026-05-10';

export const TOPICS_MARKETING: readonly LearnTopic[] = [
  {
    slug: 'seo',
    title: 'SEO',
    category: 'business',
    eyebrow: 'Marketing · For small business & e-commerce',
    headline: 'Learn SEO — for the store, the service, the side project.',
    subhead:
      'Strive builds an SEO course around what you actually rank — a Shopify store, a local service site, a content blog, or a SaaS landing page. Lessons stream live, the recall queue keeps the on-page checklist in your head, and the curriculum stays practical.',
    metaDescription:
      'Personal AI-built SEO course — keyword research, on-page, technical, and link-building patterns that work for real sites. Daily spaced recall.',
    keywords: [
      'learn seo',
      'seo course',
      'seo for ecommerce',
      'on-page seo',
      'technical seo',
      'keyword research',
      'AI seo tutor',
    ],
    outcomes: [
      'Pick keywords by buyer intent, not by volume alone.',
      'Audit a page on-the-fly — title, headings, internal links, schema.',
      'Diagnose a technical issue (crawl, index, speed) without a paid tool.',
      'Plan content around a topic cluster instead of one-off posts.',
      'Earn links the boring, durable way — and spot the patterns that don’t.',
      'Read Search Console like an analyst, not a tourist.',
      'Apply the playbook to *your* site, not a hypothetical one.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on SEO',
      modules: [
        { title: 'Search intent — what the query is really asking', lessonCount: 4 },
        { title: 'Keyword research without the bloat', lessonCount: 4 },
        { title: 'On-page — titles, headings, and the boring wins', lessonCount: 5 },
        { title: 'Technical SEO — crawl, index, render, speed', lessonCount: 5 },
        { title: 'Links that hold up over years', lessonCount: 3 },
        { title: 'Search Console as a diagnostic tool', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Will this teach me how to game Google?',
        answer:
          'No. Tactics that game the algorithm have a half-life of about a quarter. The course teaches the patterns that survive each update — intent, structure, and links earned for real reasons.',
      },
      {
        question: 'Is the course tied to a specific CMS?',
        answer:
          'No. Tell the wizard whether you’re on Shopify, WordPress, Webflow, a custom Next.js site, or something else, and examples and audits will use that stack.',
      },
      {
        question: 'Does it cover local SEO?',
        answer:
          'Yes — flag a local-services or brick-and-mortar focus in the wizard and the course adds Google Business Profile, citations, and local-pack patterns instead of leaning into content marketing.',
      },
    ],
    estimatedHours: 'Typically 10–16 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'google-ads',
    title: 'Google Ads',
    category: 'business',
    eyebrow: 'Marketing · For e-commerce, services & lead-gen',
    headline: 'Learn Google Ads — for the store, the service, the lead form.',
    subhead:
      'Strive shapes a Google Ads course around your business — a Shopify store running Shopping, a service business buying intent, or a B2B funnel pulling demos. Lessons stream live, and the recall queue keeps the bidding logic and structure decisions sticky.',
    metaDescription:
      'Personal AI-built Google Ads course — Search, Shopping, and Performance Max, structured around your business. Daily spaced recall.',
    keywords: [
      'learn google ads',
      'google ads course',
      'google shopping ads',
      'performance max',
      'ppc course',
      'search ads',
      'AI google ads tutor',
    ],
    outcomes: [
      'Build a Search campaign that doesn’t haemorrhage budget on broad match.',
      'Set up Shopping and Performance Max without giving the algorithm a blank cheque.',
      'Pick match types, negatives, and bid strategies that fit the goal.',
      'Read the auction insights and the search-terms report like a buyer, not a tourist.',
      'Diagnose a struggling campaign before doubling down or pulling the plug.',
      'Connect conversions properly so the optimiser learns from real signal.',
      'Apply the playbook to your product, your offer, your margins.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Google Ads',
      modules: [
        { title: 'How the auction actually works (and where the budget leaks)', lessonCount: 3 },
        { title: 'Keywords, match types, and the negatives that earn their keep', lessonCount: 4 },
        { title: 'Search campaigns that don’t bleed', lessonCount: 4 },
        { title: 'Shopping and Performance Max without the blank cheque', lessonCount: 5 },
        { title: 'Bidding strategies — manual, tCPA, tROAS, and when to use which', lessonCount: 3 },
        { title: 'Reading the data — search terms, auction insights, and the rest', lessonCount: 3 },
        { title: 'Diagnose a struggling campaign — a worked playbook', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Search vs Shopping vs PMax — which does the course focus on?',
        answer:
          'Whichever your business calls for. The wizard asks. An e-commerce store gets a Shopping/PMax-heavy outline; a service business gets a Search-led one; lead-gen B2B gets a hybrid with offline-conversion plumbing.',
      },
      {
        question: 'Does it cover YouTube and Display?',
        answer:
          'As a layer on top, not the main act. Most small advertisers waste money on Display and YouTube before they’ve nailed Search and Shopping — the course is honest about the order.',
      },
      {
        question: 'How current are the screenshots and UI walk-throughs?',
        answer:
          'The course teaches the *decisions* — what to set, why, and when to change it — not the click-by-click UI. Google reorganises the interface every few months; the patterns underneath don’t move.',
      },
    ],
    estimatedHours: 'Typically 10–16 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'copywriting',
    title: 'Copywriting',
    category: 'business',
    eyebrow: 'Marketing · For founders, freelancers & marketers',
    headline: 'Learn copywriting — for landing pages, emails, ads.',
    subhead:
      'Strive builds a copywriting course around what you actually have to write — a homepage, a launch email, a Facebook ad, a sales page, cold outreach. Direct-response patterns, real worked examples, and the recall queue that keeps the frameworks at hand.',
    metaDescription:
      'Personal AI-built copywriting course — landing pages, emails, ads, and sales pages. Direct-response frameworks with daily spaced recall.',
    keywords: [
      'learn copywriting',
      'copywriting course',
      'direct response copywriting',
      'landing page copy',
      'email copywriting',
      'sales copy',
      'AI copywriting tutor',
    ],
    outcomes: [
      'Write a headline that earns the second sentence.',
      'Build a landing page that argues a single point, well.',
      'Draft an email sequence people actually open through.',
      'Turn a feature list into benefits that map to a real buyer’s day.',
      'Diagnose flat copy — voice, specificity, proof, or pacing.',
      'Edit your own first draft instead of frowning at it.',
      'Apply the patterns to *your* offer, in your voice.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Copywriting',
      modules: [
        { title: 'Voice of customer — mining the words people actually use', lessonCount: 4 },
        { title: 'Headlines and the first 1.5 seconds', lessonCount: 3 },
        { title: 'Landing pages that argue one point', lessonCount: 5 },
        { title: 'Email — sequences that don’t get archived', lessonCount: 4 },
        { title: 'Ad copy — paid social and search', lessonCount: 3 },
        { title: 'The long-form sales page — when and how', lessonCount: 3 },
        { title: 'Editing — the second draft is where copy is made', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this a creative-writing course?',
        answer:
          'No. This is direct-response — copy that has to earn a click, a signup, or a sale. Voice and craft matter, but the goal is conversion, not vibes.',
      },
      {
        question: 'Can I work on real copy I’m writing for a project?',
        answer:
          'Yes. The wizard lets you point the course at a real offer — your product, your client’s service — and the worked examples will use it instead of a generic case study.',
      },
      {
        question: 'Will it teach me how to use AI to write copy?',
        answer:
          'Indirectly. The course teaches the patterns; once you know them, you can prompt any model to draft against them. We don’t pretend an AI alone replaces the work.',
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'email-marketing',
    title: 'Email marketing',
    category: 'business',
    eyebrow: 'Marketing · For e-commerce & SaaS',
    headline: 'Learn email marketing — from list to lifecycle.',
    subhead:
      'Strive builds an email-marketing course around your stack and your stage — a new Shopify store with no list, a SaaS with cold leads, a creator with a newsletter to monetise. Lessons stream live and the recall queue keeps the deliverability rules and sequence patterns close to hand.',
    metaDescription:
      'Personal AI-built email-marketing course — list-building, deliverability, sequences, and lifecycle for e-commerce and SaaS. Daily spaced recall.',
    keywords: [
      'learn email marketing',
      'email marketing course',
      'lifecycle email',
      'email deliverability',
      'newsletter growth',
      'welcome sequence',
      'AI email marketing tutor',
    ],
    outcomes: [
      'Build a list using sources that don’t poison the deliverability later.',
      'Set up SPF, DKIM, and DMARC so your sends actually arrive.',
      'Draft a welcome sequence that earns the second email open.',
      'Map a lifecycle — abandoned cart, post-purchase, win-back — to your business.',
      'Segment by behaviour, not just demographics.',
      'Read the metrics that matter (and ignore the ones that don’t since open-rate broke).',
      'Apply the playbook on the ESP you actually use.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Email Marketing',
      modules: [
        { title: 'Building a list without poisoning the well', lessonCount: 3 },
        { title: 'Deliverability — SPF, DKIM, DMARC, and the warm-up', lessonCount: 4 },
        { title: 'The welcome sequence', lessonCount: 4 },
        { title: 'Lifecycle — cart, post-purchase, win-back', lessonCount: 5 },
        { title: 'Segmentation that earns its complexity', lessonCount: 3 },
        { title: 'Metrics after the open-rate broke', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this tied to a specific email platform?',
        answer:
          'No. Tell the wizard which ESP you’re on and the worked examples reflect it. Whatever you use, the patterns — sequences, segmentation, deliverability — translate cleanly.',
      },
      {
        question: 'Will it cover cold outbound / sales emails?',
        answer:
          'Lightly. The course is mostly about marketing emails to your own list. Cold outbound is a different discipline — the principles overlap but the deliverability rules and tooling differ enough that they deserve their own course.',
      },
      {
        question: 'How does the course handle the open-rate-tracking mess?',
        answer:
          'Honestly. Apple Mail Privacy Protection inflates opens and broke a lot of automations built on them. The course teaches what to lean on instead — clicks, revenue per recipient, and engagement-based segments.',
      },
    ],
    estimatedHours: 'Typically 6–12 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'content-marketing',
    title: 'Content marketing',
    category: 'business',
    eyebrow: 'Marketing · For B2B, SaaS & creators',
    headline: 'Learn content marketing — without the content-mill grind.',
    subhead:
      'Strive builds a content-marketing course around what you’re trying to grow — a SaaS top-of-funnel, a creator audience, a B2B services pipeline. Topic clusters, distribution, repurposing, and the recall queue that keeps the editorial rhythm in your head.',
    metaDescription:
      'Personal AI-built content marketing course — topic clusters, pillar pages, distribution, repurposing, and editorial rhythm. Daily spaced recall.',
    keywords: [
      'learn content marketing',
      'content marketing course',
      'topic clusters',
      'pillar pages',
      'content strategy',
      'content distribution',
      'AI content marketing tutor',
    ],
    outcomes: [
      'Pick a niche narrow enough to actually win in.',
      'Plan a topic cluster around a pillar page that earns the internal links.',
      'Brief a piece so the writer (or the AI) doesn’t turn out beige content.',
      'Distribute a piece across channels without dumping the same caption five places.',
      'Repurpose a single asset into a week of derivatives.',
      'Measure content by the funnel stage it serves, not the page-view total.',
      'Build an editorial rhythm you can actually sustain.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Content Marketing',
      modules: [
        { title: 'Picking a niche narrow enough to win', lessonCount: 3 },
        { title: 'Topic clusters and pillar pages', lessonCount: 5 },
        { title: 'Briefs that produce content people read', lessonCount: 4 },
        { title: 'Distribution without copy-paste fatigue', lessonCount: 4 },
        { title: 'Repurposing one asset into a week', lessonCount: 3 },
        { title: 'Measurement by funnel stage', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Isn’t this the same as the SEO course?',
        answer:
          'They pair. SEO teaches you how search works and how to earn rankings. Content marketing teaches you what to publish, how to distribute it, and how to keep the rhythm. Take both if you’re running content; take this one alone if your distribution lives elsewhere (newsletters, social, YouTube).',
      },
      {
        question: 'Does it cover AI-assisted content workflows?',
        answer:
          'Yes — as a tool, not a strategy. The course teaches the editorial decisions an AI can’t make (angle, voice, niche, structure) and the workflow steps where AI genuinely speeds things up (research, outline, first-pass, repurposing).',
      },
      {
        question: 'Is this for B2B or for creators?',
        answer:
          'Both, with the wizard tilting the curriculum. A B2B path leans into pillar pages, gated content, and lifecycle nurture; a creator path leans into platform-native content, audience-building, and repurposing across channels.',
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'social-media-strategy',
    title: 'Social media strategy',
    category: 'business',
    eyebrow: 'Marketing · For founders, agencies & creators',
    headline: 'Learn social media strategy — across platforms, not on autopilot.',
    subhead:
      'Strive builds a cross-platform social-strategy course around what you’re actually growing — a personal brand, a B2B account, a product page, an agency’s portfolio. Lessons stream live, and the recall queue keeps the platform-fit rules and posting rhythm sharp.',
    metaDescription:
      'Personal AI-built social media strategy course — cross-platform fit, posting rhythm, content pillars, and analytics. Daily spaced recall.',
    keywords: [
      'learn social media strategy',
      'social media course',
      'cross-platform social',
      'content pillars',
      'social media planning',
      'b2b social media',
      'AI social media tutor',
    ],
    outcomes: [
      'Choose the two or three platforms that actually fit your goal.',
      'Define content pillars so the calendar writes itself, not you.',
      'Adapt one idea to each platform’s native shape — not the same post five places.',
      'Set a posting rhythm you can sustain without burning out by week six.',
      'Read engagement vs reach vs follower growth without confusing them.',
      'Write a brief a creator or contractor can execute against.',
      'Apply the playbook to your brand, your client’s, or your own face.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Social Media Strategy',
      modules: [
        { title: 'Pick two platforms — and why three is too many', lessonCount: 3 },
        { title: 'Content pillars and the calendar that writes itself', lessonCount: 4 },
        { title: 'Native fit — adapting one idea per platform', lessonCount: 5 },
        { title: 'Rhythm and a posting cadence you can keep', lessonCount: 3 },
        { title: 'Reading the metrics — reach, engagement, growth', lessonCount: 3 },
        { title: 'Briefing creators, contractors, and the team', lessonCount: 3 },
        { title: 'Diagnose a flat account — a worked playbook', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Will this teach me how to grow on a specific platform?',
        answer:
          'Not in detail. This is the strategy layer — picking platforms, planning pillars, setting rhythm. Platform-specific growth (YouTube, Instagram, TikTok, LinkedIn) lives in their own dedicated courses, which you can build on top of this one.',
      },
      {
        question: 'Does it cover paid social?',
        answer:
          'Briefly, as the boundary between organic and paid. Paid social is a different discipline with its own course (Meta Ads is shipped today; LinkedIn and TikTok ads are coming). Take this one for the organic strategy and content plan.',
      },
      {
        question: 'Is this useful for B2B or only for B2C / creators?',
        answer:
          'Both. The wizard asks. A B2B path leans into LinkedIn, founder-led content, and pipeline-aware metrics; a B2C/creator path leans into short-form video, audience-building, and reach metrics.',
      },
    ],
    estimatedHours: 'Typically 6–12 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
];
