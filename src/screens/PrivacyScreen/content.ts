export const PRIVACY_CONTENT = `
Strive ("we", "us") is operated by **MB Kūrybinis kodas**, a small partnership registered
in the Republic of Lithuania. We are the data controller for the personal data described
below. Contact: **admin@strive-learning.com**.

## 1. Data we process

| Category | Examples | Legal basis (GDPR Art. 6) |
| --- | --- | --- |
| Account data | name, email, hashed password, OAuth identifiers, marketing-email preference | Contract (Art. 6(1)(b)) |
| Usage data | learning goals, courses created, lessons completed, quiz answers, review ratings, notes | Contract |
| Inputs to AI | the prompts and answers you submit to generate or refine course content | Contract |
| Billing data | plan, billing cycle, Stripe customer + subscription IDs, payment status | Contract; legal obligation for tax records |
| Device & technical data | IP address, browser, device type, request IDs, error events | Legitimate interest (security, fraud prevention, debugging) |
| Cookie / analytics data | Mixpanel events, Google Analytics 4 hits, Google Ads conversions, page views | Consent (Art. 6(1)(a)) — see § 6 |

We do not knowingly process special-category data (health, biometrics, religion, etc.).
Do not submit such data through course goals, notes, or chats.

## 2. Why we process it

To provide and operate the service, run AI-generated lessons, gate paid features, send
account and security email, prevent abuse, comply with tax and accounting law, and — with
your consent — measure how the product is used and acquired.

## 3. Recipients (sub-processors)

Personal data is shared only with the third parties strictly required to deliver the
service. Each is bound by a data-processing agreement under GDPR Art. 28.

| Sub-processor | Purpose | Region |
| --- | --- | --- |
| Anthropic (Claude) | LLM that generates course, lesson, quiz and chat content | United States (SCCs / DPF) |
| OpenAI | Embeddings used by retrieval-augmented chat | United States (SCCs / DPF) |
| Black Forest Labs (BFL) | Image-generation model for lesson hero illustrations | Germany (HQ); API region pending verification |
| Pinecone | Vector store for retrieval-augmented chat | United States (SCCs / DPF) |
| Amazon Web Services (S3) | Hosting of generated assets (audio, images) | EU |
| MongoDB Atlas | Primary database | EU |
| Stripe | Payments and subscription billing | EU + United States (SCCs / DPF) |
| Mailjet | Transactional email always; marketing email only after explicit opt-in via the profile toggle | EU |
| Mixpanel | Product analytics (consent-gated) | EU host |
| Google Analytics 4 + Google Ads | Web analytics and conversion tracking (consent-gated) | United States (SCCs / DPF) |
| Sentry | Error reporting and performance monitoring | EU |
| Google Cloud (Text-to-Speech) | Lesson narration audio synthesis | EU/US (SCCs / DPF) |
| Judge0 | Code execution sandbox for code-running exercises | EU |
| Tavily, Jina | External web search and content retrieval for AI agents | United States (SCCs) |
| Appzi | In-app feedback widget (consent-gated) | United States (SCCs) |

We do not sell personal data and do not share it for any third-party advertising other
than the conversion tracking listed above.

## 4. International transfers

Where a sub-processor is outside the European Economic Area, we rely on the EU
Standard Contractual Clauses and, where the recipient is certified, the EU–US Data
Privacy Framework.

## 5. Retention

Account, usage, billing and AI-input data are kept while your account exists and for up
to 30 days after deletion to allow recovery. Billing-related records are kept for **10
years** from issuance as required by Lithuanian accounting law. Sentry error events
expire automatically after 30 days. Mixpanel events for deleted users are removed via
GDPR right-to-erasure within 30 days of account deletion.

## 6. Cookies

| Category | Purpose | Always on? |
| --- | --- | --- |
| Strictly necessary | Authentication session, theme persistence, security headers, error reporting | Yes |
| Analytics | Mixpanel, Google Analytics 4 | Only with consent |
| Marketing | Google Ads conversion tracking | Only with consent |

You can change your choice at any time by clearing the \`strive:cookie-consent\` key
in your browser's storage; the banner will reappear on your next visit.

## 7. Your rights

Under the GDPR you have the right to: access, rectify, erase, restrict, object to, and
port your personal data; to withdraw any consent you have given; and to lodge a
complaint with a supervisory authority. Most of these you can exercise yourself from
**Profile → Account** (export, edit, delete). For everything else, email
**admin@strive-learning.com** and we will respond within 30 days.

The Lithuanian supervisory authority is the **State Data Protection Inspectorate**
(Valstybinė duomenų apsaugos inspekcija, **vdai.lrv.lt**). You can also lodge a
complaint with the supervisory authority of the EU/EEA member state where you live or
work.

## 8. Automated decision-making

Strive does not make automated decisions that produce legal or similarly significant
effects on you (Art. 22 GDPR). The AI generates course content and grades free-recall
answers, but you remain in full control of how you use these outputs.

## 9. Children

Strive is not directed at children under **16**. We do not knowingly create accounts for
children under that age. If you believe a child has registered, contact us and we will
delete the account.

## 10. Changes to this policy

We may update this policy. The "last updated" date at the top reflects the current
version. Material changes will be notified by email or in-product before they take effect.
`;
