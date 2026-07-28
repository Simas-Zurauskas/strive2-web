/**
 * Plain-text mirror of the `/pricing` FAQ accordion, for `FAQPage` structured
 * data.
 *
 * **This is a mirror, not the source.** The accordion in `PricingScreen.tsx`
 * renders its own JSX — with emphasis markup, and with live allowance figures
 * interpolated from the billing catalog — and stays the copy that visitors
 * read. Edit an answer there and edit it here.
 *
 * It is duplicated rather than shared because the two consumers need
 * incompatible things: the accordion needs React nodes and runtime catalog
 * values, while schema.org `acceptedAnswer.text` must be a static string
 * present in the server-rendered HTML. Deriving one from the other would mean
 * either shipping markup into the schema or degrading the rendered page to
 * plain strings.
 *
 * The first answer is deliberately the numberless version. The accordion cites
 * concrete per-plan multipliers pulled from the API at runtime; repeating them
 * here would hardcode pricing whose source of truth is
 * `api/src/lib/pricingConfig.ts`, and a stale figure in a search result is
 * worse than a general one.
 */
export const PRICING_FAQ = [
  {
    question: 'What can I actually do on each plan?',
    answer:
      'Your monthly allowance translates roughly to lessons generated, plus the cheap one-off steps (clarify, structure, module quizzes). Every plan unlocks the same features; tiers only change how much you can generate.',
  },
  {
    question: 'Will I lose my courses if I cancel or downgrade?',
    answer:
      'No. Your courses, lessons, notes, bookmarks, quiz attempts, and recall progress all stay with your account regardless of plan. You just won’t be able to generate new content beyond your current tier’s allowance. Reading and reviewing existing courses is always free.',
  },
  {
    question: 'What happens if I run out mid-month?',
    answer:
      'Two options. Upgrade to a higher tier and the new allowance is granted immediately — no waiting for the next cycle. Or top up any whole-dollar amount from the Billing tab; top-up balance never expires and is spent after your monthly allowance is drained.',
  },
  {
    question: 'What if a generation fails?',
    answer:
      'Allowance is fully refunded on any failure — network drop, provider outage, timeout, cancellation. You only pay for generations that finish and persist. The same applies if you cancel a job mid-flight.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Cancel from the Billing portal and you keep full access plus your remaining allowance through the end of the current billing period, then drop to Free. No partial-month refunds, but no commitment beyond the current cycle either.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'The Free plan is the trial. Sign up, get a baseline monthly allowance, generate a real course, and decide whether you want more. No credit card required to start.',
  },
  {
    question: 'Monthly or annual — which should I pick?',
    answer:
      'Annual saves about 20% on the price, but the allowance is granted once per year, not split across 12 monthly refreshes. Pick monthly if you want predictable per-month allowance refreshes; pick annual if you generate in bursts and want the lower price.',
  },
  {
    question: 'What about taxes?',
    answer:
      'Prices are listed in USD. Stripe handles any applicable VAT or sales tax at checkout based on your billing address — the line item is added to your invoice, not bundled into the headline price.',
  },
] as const;
