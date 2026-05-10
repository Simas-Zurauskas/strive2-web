import type { LearnTopic } from '../types';

// Business & money cluster — 6 topics aimed at the high-volume v1
// audiences in USER_BASE.md: e-commerce sellers, freelancers, would-be
// managers, and people learning their way around money. Hand-authored
// marketing copy only; never seeded from learner-generated courses.

const UPDATED = '2026-05-10';

export const TOPICS_BUSINESS: readonly LearnTopic[] = [
  {
    slug: 'shopify-ecommerce',
    title: 'Shopify e-commerce',
    category: 'business',
    eyebrow: 'Business · For DTC operators',
    headline: 'Learn Shopify e-commerce — from first product to repeat buyers.',
    subhead:
      'Tell Strive what you’re selling — or thinking of selling — and AI builds a Shopify course around your product, your offer, and where you are today. Lessons stream live, and a daily recall queue keeps the playbook in your head between launches.',
    metaDescription:
      'Personal AI-built Shopify course — store setup, product selection, conversion, post-purchase, and scaling. Live lessons and daily spaced recall.',
    keywords: [
      'learn shopify',
      'shopify course',
      'shopify for beginners',
      'ecommerce course',
      'dtc store',
      'shopify tutorial',
    ],
    outcomes: [
      'Set up a Shopify store with a theme, navigation, and policies that don’t leak trust.',
      'Choose products and offers that have room in the margin to actually be advertised.',
      'Write product pages that convert browsers — copy, photography, social proof.',
      'Lift conversion rate with checkout, shipping, and bundle decisions that compound.',
      'Build a post-purchase flow — confirmation, fulfillment, email — that earns the second order.',
      'Read your own analytics without spiraling — sessions, AOV, returning rate, contribution.',
      'Plan a path to scale without breaking the unit economics.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Shopify e-commerce',
      modules: [
        { title: 'Store setup that doesn’t leak trust', lessonCount: 4 },
        { title: 'Picking a product with room to breathe', lessonCount: 4 },
        { title: 'Product pages that convert browsers', lessonCount: 5 },
        { title: 'Checkout, shipping, and the conversion gaps', lessonCount: 4 },
        { title: 'Post-purchase — fulfillment, email, the second order', lessonCount: 4 },
        { title: 'Reading the dashboard without spiraling', lessonCount: 3 },
        { title: 'Scaling without breaking the math', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Do I need a product before I start?',
        answer:
          'No. The wizard asks where you are — pre-product, picking between options, or already selling. The course reshapes around that. Pre-product learners get more time on selection and validation; existing sellers skip ahead to conversion and scaling.',
      },
      {
        question: 'Does this cover paid ads?',
        answer:
          'Lightly — enough to understand how acquisition fits into the unit economics. For the full ad playbook, run the Meta Ads course on top once your store is ready to feed it.',
      },
      {
        question: 'Is this for dropshipping?',
        answer:
          'It works for dropshipping but doesn’t pretend dropshipping is the only path. The course covers inventoried, made-to-order, print-on-demand, and dropshipping models, and is honest about what each costs in margin and operational pain.',
      },
    ],
    estimatedHours: 'Typically 10–16 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'amazon-fba',
    title: 'Amazon FBA',
    category: 'business',
    eyebrow: 'Business · For private-label sellers',
    headline: 'Learn Amazon FBA — from product research to a real listing.',
    subhead:
      'Strive builds an FBA course around your stage — researching your first product, sourcing a supplier, launching a listing, or scaling spend on PPC. Lessons stream live, and the recall queue keeps the research and listing playbook close at hand.',
    metaDescription:
      'Personal AI-built Amazon FBA course — product research, sourcing, listings, PPC, and reviews. Live lessons and daily spaced recall.',
    keywords: [
      'learn amazon fba',
      'amazon fba course',
      'fba for beginners',
      'amazon ppc',
      'private label amazon',
      'amazon seller course',
    ],
    outcomes: [
      'Research a product category with the metrics that actually predict success.',
      'Source a supplier on Alibaba without getting burned on samples or MOQs.',
      'Write a listing — title, bullets, A+ content — that ranks and converts.',
      'Set up images and a brand presence that hold up next to a category leader.',
      'Run launch and scaling PPC campaigns — exact, broad, auto, and what each is for.',
      'Build a review-and-feedback flow inside Amazon’s policy boundaries.',
      'Diagnose a stalled listing — ranking, conversion, or session counts — and act.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Amazon FBA',
      modules: [
        { title: 'Product research that survives contact with reality', lessonCount: 5 },
        { title: 'Sourcing on Alibaba without getting burned', lessonCount: 4 },
        { title: 'Listings — title, bullets, A+ content, images', lessonCount: 5 },
        { title: 'Launch — the first reviews and the first sales', lessonCount: 4 },
        { title: 'PPC — exact, broad, auto, and the budget logic', lessonCount: 5 },
        { title: 'Reviews and feedback within policy', lessonCount: 3 },
        { title: 'Diagnose a stalled listing — a worked playbook', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Which marketplace does it teach — US, UK, EU, IN?',
        answer:
          'You pick during the wizard. Examples, fees, and policy notes shift to that marketplace. Cross-marketplace expansion is covered as a later module if you ask for it.',
      },
      {
        question: 'Do I need a budget before I start the course?',
        answer:
          'No — the early modules are research and sourcing strategy. You’ll have a much better sense of realistic launch budgets by the time the course recommends putting money in.',
      },
      {
        question: 'Does it promise income?',
        answer:
          'No. FBA is a real business with real risk — bad product picks lose money. The course teaches the decisions and the diagnostics; outcomes depend on the product, the category, and execution.',
      },
    ],
    estimatedHours: 'Typically 12–18 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'freelancing',
    title: 'Freelancing',
    category: 'business',
    eyebrow: 'Business · For freelancers and consultants',
    headline: 'Learn freelancing — niching, pricing, and a pipeline that doesn’t dry up.',
    subhead:
      'Strive shapes a freelancing course around your craft — design, dev, copy, marketing, ops — and where you are today: side-project, full-time, or stuck at a plateau. Lessons stream live, and a daily recall queue keeps the moves at hand for the next pitch.',
    metaDescription:
      'Personal AI-built freelancing course — niching, pricing, packaging, client acquisition, contracts, and retention. Daily spaced recall.',
    keywords: [
      'learn freelancing',
      'freelancing course',
      'freelance business',
      'freelance pricing',
      'cold outreach',
      'consulting course',
    ],
    outcomes: [
      'Pick a niche tight enough to be findable and broad enough to feed you.',
      'Price your work — hourly, day rate, fixed, retainer — without leaving money on the table.',
      'Package services into clear offers a buyer can say yes to in one read.',
      'Build a pipeline from cold outreach, warm referrals, and a portfolio that does its job.',
      'Run a discovery call that ends in a scoped proposal, not a free strategy session.',
      'Write contracts and SOWs that protect both sides without lawyer-grade overhead.',
      'Retain clients past the first project — recurring work, expansion, and graceful endings.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Freelancing',
      modules: [
        { title: 'Picking a niche tight enough to be found', lessonCount: 3 },
        { title: 'Pricing without leaving money on the table', lessonCount: 4 },
        { title: 'Packaging — turning skills into offers', lessonCount: 3 },
        { title: 'Cold outreach that doesn’t feel cold', lessonCount: 4 },
        { title: 'Discovery, proposals, and scope', lessonCount: 4 },
        { title: 'Contracts and SOWs without lawyer-grade overhead', lessonCount: 3 },
        { title: 'Retention, expansion, and graceful endings', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this for a specific kind of freelancer?',
        answer:
          'It’s discipline-aware, not discipline-locked. The wizard asks what you do — design, dev, copy, marketing, ops — and the examples, pricing benchmarks, and outreach scripts reshape around that.',
      },
      {
        question: 'Does it teach me how to use Upwork / Fiverr?',
        answer:
          'Marketplaces are covered as one acquisition channel among several. The course is honest that platform work has different economics than direct clients, and helps you decide which mix fits your stage.',
      },
      {
        question: 'Will this make me a six-figure freelancer?',
        answer:
          'No course can promise that. What this one does is teach the decisions and the systems that move freelancers from feast-and-famine to a steadier pipeline — the ceiling is yours.',
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'personal-finance',
    title: 'Personal finance',
    category: 'business',
    eyebrow: 'Business · For getting money under control',
    headline: 'Learn personal finance — concepts, frameworks, and the habits that compound.',
    subhead:
      'Strive builds a personal-finance course around your situation — income type, country, life stage — and teaches the concepts, not the trades. Lessons stream live, and a daily recall queue keeps the framework close enough to use when a real decision comes up.',
    metaDescription:
      'Personal AI-built course on personal finance concepts — budgeting, saving, debt, investing basics, and tax-advantaged accounts. Educational only.',
    keywords: [
      'learn personal finance',
      'personal finance course',
      'budgeting basics',
      'saving and investing',
      'debt management',
      'financial literacy',
    ],
    outcomes: [
      'Build a budget that survives a normal month, not just a perfect one.',
      'Understand the difference between saving, investing, and gambling — in plain language.',
      'Reason about debt — which kinds compound against you, which can be tools.',
      'Recognise the basic categories of tax-advantaged accounts in your country and what each is for.',
      'Read an asset-allocation idea critically without being sold by it.',
      'Build the small habits that compound — automation, periodic reviews, cooling-off rules.',
      'Spot common scams, fee traps, and "guaranteed return" red flags.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Personal Finance',
      modules: [
        { title: 'Where the money goes — budgeting that lasts', lessonCount: 4 },
        { title: 'Saving — emergency funds, sinking funds, and why', lessonCount: 3 },
        { title: 'Debt — the kinds that compound, the kinds that don’t', lessonCount: 4 },
        { title: 'Investing concepts — risk, return, time horizon', lessonCount: 4 },
        { title: 'Tax-advantaged accounts — categories and trade-offs', lessonCount: 3 },
        { title: 'Habits that compound — automation and reviews', lessonCount: 3 },
        { title: 'Spotting scams, fee traps, and red flags', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this financial advice?',
        answer:
          'No. This is educational. We teach concepts and frameworks; we don’t give personalized advice. For decisions involving your money, talk to a licensed advisor.',
      },
      {
        question: 'Does it cover taxes for my country?',
        answer:
          'It teaches the categories — what a tax-advantaged account is, why employer matches matter, how capital gains generally work — at the concept level. Specific tax rules and limits change yearly and vary by jurisdiction; for those, use your country’s official guidance or a qualified accountant.',
      },
      {
        question: 'Will it tell me what to invest in?',
        answer:
          'No. Naming specific stocks, funds, or coins is not what this course is for. It teaches you how to read an investment idea, what questions to ask, and how to think about risk — so you can have a more informed conversation with an advisor or with yourself.',
      },
    ],
    estimatedHours: 'Typically 8–12 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'investing',
    title: 'Investing',
    category: 'business',
    eyebrow: 'Business · For long-horizon learners',
    headline: 'Learn investing — concepts, valuation, and a framework you can keep using.',
    subhead:
      'Strive builds an investing course around your level and your goal — total newcomer, returning to it, or trying to read a balance sheet without flinching. Lessons stream live, and a daily recall queue keeps the framework alive between actual decisions.',
    metaDescription:
      'Personal AI-built investing course — index funds, valuation, fundamental analysis, and portfolio construction. Educational only.',
    keywords: [
      'learn investing',
      'investing course',
      'index fund investing',
      'fundamental analysis',
      'portfolio construction',
      'valuation basics',
    ],
    outcomes: [
      'Tell the difference between investing, trading, and speculating in plain language.',
      'Read an index-fund prospectus and know what you’re actually buying.',
      'Reason about diversification, correlation, and why portfolios beat picks.',
      'Walk through the basics of fundamental analysis — revenue, margins, cash flow, debt.',
      'Apply a simple valuation lens — multiples, discounted cash flow at concept level.',
      'Build a sketch of an asset allocation that fits a stated risk tolerance and horizon.',
      'Recognise behavioural traps — recency, anchoring, loss aversion — when they show up.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Investing',
      modules: [
        { title: 'Investing vs trading vs speculating', lessonCount: 3 },
        { title: 'Index funds — what you’re actually buying', lessonCount: 4 },
        { title: 'Diversification and why portfolios beat picks', lessonCount: 3 },
        { title: 'Fundamental analysis — reading the four statements', lessonCount: 5 },
        { title: 'Valuation — multiples and discounted cash flow', lessonCount: 4 },
        { title: 'Asset allocation — risk, horizon, rebalancing', lessonCount: 4 },
        { title: 'Behavioural traps and how to notice yours', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this financial advice?',
        answer:
          'No. This is educational. We teach concepts and frameworks; we don’t give personalized advice. For decisions involving your money, talk to a licensed advisor.',
      },
      {
        question: 'Will the course tell me what stocks or coins to buy?',
        answer:
          'No. The course is about the lens, not the picks. It deliberately stays away from naming specific tickers or coins, and steers clear of day-trading and crypto-speculation framing.',
      },
      {
        question: 'Does it cover crypto?',
        answer:
          'Briefly and at the concept level — what a token is, what a custody risk is, how it differs from regulated securities. It does not teach crypto trading or signal-following.',
      },
    ],
    estimatedHours: 'Typically 10–16 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'leadership',
    title: 'Leadership',
    category: 'business',
    eyebrow: 'Business · For first-time managers',
    headline: 'Learn leadership — for the first promotion, the first team, the first hard call.',
    subhead:
      'Strive builds a leadership course around the situations a first-time manager actually walks into — the awkward 1:1, the underperformer, the team that doesn’t trust you yet. Lessons stream live, and a daily recall queue keeps the moves close at hand.',
    metaDescription:
      'Personal AI-built leadership course for new managers — 1:1s, feedback, underperformance, trust, and decision-making. Daily spaced recall.',
    keywords: [
      'learn leadership',
      'leadership course',
      'first time manager',
      'management course',
      'giving feedback',
      'one on ones',
    ],
    outcomes: [
      'Run a 1:1 that your report actually looks forward to — agenda, cadence, follow-through.',
      'Give feedback that lands — specific, timely, separated from identity, and acted on.',
      'Handle underperformance with a fair, documented arc instead of avoidance or sudden termination.',
      'Build trust with a team that didn’t pick you — credibility, vulnerability, and consistency.',
      'Make decisions under uncertainty without freezing, and explain them after the fact.',
      'Delegate without losing the thread — clear ownership, checkpoints, and rescue plans.',
      'Apply the moves to a real situation you’re currently facing on your team.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Leadership',
      modules: [
        { title: 'The shift — from doer to manager of doers', lessonCount: 3 },
        { title: '1:1s that your report looks forward to', lessonCount: 4 },
        { title: 'Feedback that lands — specific, timely, kind', lessonCount: 4 },
        { title: 'Underperformance — the fair, documented arc', lessonCount: 4 },
        { title: 'Building trust with a team that didn’t pick you', lessonCount: 3 },
        { title: 'Decisions under uncertainty', lessonCount: 3 },
        { title: 'Delegation without losing the thread', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'I’m about to manage people for the first time — is this for me?',
        answer:
          'Yes — that’s exactly the audience. The wizard asks where you are: about to be promoted, recently promoted, or stuck on a specific situation. The course reshapes around that.',
      },
      {
        question: 'Can I bring a real situation into the course?',
        answer:
          'Yes. Tell the wizard about a current challenge — an underperformer, a low-trust team, a hard call you’re postponing — and the worked examples in the relevant module will use that scenario.',
      },
      {
        question: 'Does it cover senior leadership / executive work?',
        answer:
          'The default is first-time managers. You can bias the course towards senior-IC-to-manager, manager-of-managers, or director-level work in the wizard, and the modules adjust — though the deepest examples remain at the team level.',
      },
    ],
    estimatedHours: 'Typically 8–12 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
];
