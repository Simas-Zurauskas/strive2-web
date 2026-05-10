import type { LearnTopic } from '../types';

// Programming-cluster gap topics — the foundation course (web-development),
// the typed JS upgrade (typescript), and three career-bridge topics for
// developers crossing into infra/cloud/security work (aws-cloud, docker-devops,
// cybersecurity). These complement, not replace, the existing python /
// javascript / react / sql entries in topics.ts.
//
// Privacy: hand-authored marketing copy only. Never seed from learner data.

const UPDATED = '2026-05-10';

export const TOPICS_PROGRAMMING: readonly LearnTopic[] = [
  {
    slug: 'web-development',
    title: 'Web development',
    category: 'programming',
    eyebrow: 'Programming · Foundation',
    headline: 'Learn web development — the course you take before the framework.',
    subhead:
      'Strive builds a foundations course in HTML, CSS, and the working parts of JavaScript — the layer most framework tutorials assume you already know. Lessons stream live, examples render in the browser, and a daily recall queue keeps the syntax from sliding off.',
    metaDescription:
      'Personal AI-built web development course — HTML, CSS, and the JavaScript fundamentals every framework assumes. Streaming lessons and daily spaced recall.',
    keywords: [
      'learn web development',
      'web development course',
      'html css javascript',
      'frontend basics',
      'web development for beginners',
      'personalized web development course',
    ],
    outcomes: [
      'Write semantic HTML — headings, lists, forms, landmarks — and know why it matters.',
      'Lay out a real page with modern CSS: flexbox, grid, and the box model that explains every margin bug.',
      'Wire up interactivity with vanilla JavaScript before reaching for a framework.',
      'Reason about responsive design — breakpoints, fluid type, and what mobile-first actually means.',
      'Ship a small static site to a free host and know what you just deployed.',
      'Read DevTools — inspect, debug a layout, and read a network panel without panic.',
      'Decide what comes next: React, Vue, server-rendered, or none of the above.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Web development',
      modules: [
        { title: 'How the web actually works — request, response, render', lessonCount: 3 },
        { title: 'HTML that means something — semantics over divs', lessonCount: 4 },
        { title: 'CSS without the despair — box model, flex, grid', lessonCount: 5 },
        { title: 'Just enough JavaScript to make pages move', lessonCount: 5 },
        { title: 'Responsive design and the small screen first', lessonCount: 3 },
        { title: 'DevTools — inspect, debug, and ship', lessonCount: 3 },
        { title: 'Build and deploy a small project end-to-end', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Should I start here or jump straight into React?',
        answer:
          'Start here if you can\'t comfortably style a page or read vanilla JS. React assumes both, and the time spent on fundamentals pays back tenfold once you reach the framework course.',
      },
      {
        question: 'Does this course cover backend, databases, or full-stack?',
        answer:
          'No — this is a frontend foundations course on purpose. Backend lives in dedicated courses (Node, Python, SQL). Run the wizard a second time when you\'re ready for the server side.',
      },
      {
        question: 'How is this different from the JavaScript course?',
        answer:
          'This course is about the web — HTML, CSS, and *just enough* JS to make pages interactive. The JavaScript course is about the language itself: scope, types, async, modules. Most people benefit from both, in this order.',
      },
    ],
    estimatedHours: 'Typically 14–22 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'typescript',
    title: 'TypeScript',
    category: 'programming',
    eyebrow: 'Programming · For working JS devs',
    headline: 'Learn TypeScript — without giving up the JavaScript you already know.',
    subhead:
      'A TypeScript course shaped by where you write JS today — React, Node, or both. Strive picks the patterns that matter for your stack, streams lessons live, and a daily recall queue keeps the type-system intuitions sharp between projects.',
    metaDescription:
      'Personal AI-built TypeScript course — config, generics, advanced types, and integration with React or Node. Streaming lessons and daily spaced recall.',
    keywords: [
      'learn typescript',
      'typescript course',
      'typescript for javascript developers',
      'typescript generics',
      'typescript with react',
      'personalized typescript course',
    ],
    outcomes: [
      'Migrate a JS project to TypeScript without rewriting it from scratch.',
      'Read and write the types you\'ll meet daily — unions, intersections, narrowing, utility types.',
      'Write generics that earn their place — and know when a generic is overkill.',
      'Type a React component, its props, and its hooks without fighting the inferencer.',
      'Type a Node API — request handlers, middleware, and response shapes.',
      'Configure tsconfig deliberately — strict, target, module resolution, paths.',
      'Diagnose the cryptic error messages everyone hits in their first month.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on TypeScript',
      modules: [
        { title: 'From JS to TS — the smallest useful first step', lessonCount: 3 },
        { title: 'The type system — primitives, unions, narrowing', lessonCount: 5 },
        { title: 'Functions, overloads, and the shape of arguments', lessonCount: 4 },
        { title: 'Generics — when, why, and how far to take them', lessonCount: 4 },
        { title: 'Utility types and the standard library you keep forgetting', lessonCount: 3 },
        { title: 'Typing React or Node — pick your stack', lessonCount: 5 },
        { title: 'tsconfig and the build — strict, target, paths', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this aimed at React, Node, or both?',
        answer:
          'You pick during the wizard — React, Node, both, or neither. Examples and the project arc shift to match. The middle modules on the type system itself stay the same.',
      },
      {
        question: 'Do I need to know JavaScript first?',
        answer:
          'Yes — comfortably. If async/await, modules, and array methods feel shaky, run the JavaScript course first. TypeScript is a layer on top of JS, not a replacement for learning it.',
      },
      {
        question: 'Does it cover advanced type-level programming?',
        answer:
          'A measured amount — conditional types, mapped types, and template literal types appear when they earn their place. The course stays focused on types you\'ll actually ship, not type gymnastics.',
      },
    ],
    estimatedHours: 'Typically 12–18 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'aws-cloud',
    title: 'AWS cloud',
    category: 'programming',
    eyebrow: 'Programming · For developers crossing into cloud',
    headline: 'Learn AWS — the services you actually use, before the certification.',
    subhead:
      'Strive builds an AWS course around your reason: a job that needs cloud fluency, a side project to deploy, or a Cloud Practitioner / Solutions Architect Associate exam on the calendar. Lessons stream live, the console screenshots stay current enough, and a daily recall queue keeps the service map in your head.',
    metaDescription:
      'Personal AI-built AWS course — IAM, S3, EC2, Lambda, RDS, networking, and optional Cloud Practitioner / SAA exam prep. Streaming lessons and daily recall.',
    keywords: [
      'learn aws',
      'aws course',
      'aws for developers',
      'aws certification prep',
      'cloud practitioner',
      'solutions architect associate',
      'personalized aws course',
    ],
    outcomes: [
      'Reason about IAM — users, roles, policies, and the principle of least privilege.',
      'Store and serve files with S3 — buckets, lifecycle rules, and signed URLs.',
      'Run workloads on EC2, Lambda, or both — and know which fits which job.',
      'Stand up a managed database with RDS and connect to it from your app.',
      'Map the basic networking — VPC, subnets, security groups, and the public-private divide.',
      'Read a CloudWatch log and trace a failure across services.',
      'Pass the Cloud Practitioner or Solutions Architect Associate exam if that\'s your goal.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on AWS',
      modules: [
        { title: 'How AWS thinks — accounts, regions, and the console', lessonCount: 3 },
        { title: 'IAM — the security model that runs everything', lessonCount: 4 },
        { title: 'Storage — S3, EBS, and when to use which', lessonCount: 4 },
        { title: 'Compute — EC2, Lambda, and the Fargate middle ground', lessonCount: 5 },
        { title: 'Databases — RDS, DynamoDB, and pick-the-right-tool', lessonCount: 4 },
        { title: 'Networking essentials — VPC without the panic', lessonCount: 4 },
        { title: 'Observability and the bill — CloudWatch, costs, alarms', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Will this prepare me for the AWS certifications?',
        answer:
          'Yes — set Cloud Practitioner or Solutions Architect Associate as the goal in the wizard, and the curriculum pivots toward exam-pattern questions, time-pressure drills, and the topics those exams weigh most heavily. Strive doesn\'t guarantee a pass; it gets you ready to study like someone who will.',
      },
      {
        question: 'Does it cover the AWS CLI and infrastructure-as-code?',
        answer:
          'The CLI shows up alongside the console where it earns its place. Terraform and CloudFormation are touched on but live in their own dedicated courses if you want to go deep on IaC.',
      },
      {
        question: 'Will I rack up a big AWS bill following along?',
        answer:
          'No — examples lean on the free tier, and every module flags what stays free, what doesn\'t, and how to shut resources down. There\'s a dedicated lesson on reading the bill before it surprises you.',
      },
    ],
    estimatedHours: 'Typically 18–28 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'docker-devops',
    title: 'Docker & DevOps',
    category: 'programming',
    eyebrow: 'Programming · For devs crossing into deployment',
    headline: 'Learn Docker and DevOps — for the developer who ships, not the SRE on call.',
    subhead:
      'Strive builds a course around the deployment work most developers eventually own — containers, compose files, registries, a real CI/CD pipeline, and a working introduction to Kubernetes. Lessons stream live, terminal output is rendered in-line, and a daily recall queue makes the commands stick.',
    metaDescription:
      'Personal AI-built Docker and DevOps course — containers, compose, registries, CI/CD pipelines, and a working introduction to Kubernetes. Daily spaced recall.',
    keywords: [
      'learn docker',
      'docker course',
      'devops for developers',
      'ci/cd pipeline',
      'kubernetes intro',
      'docker compose',
      'personalized devops course',
    ],
    outcomes: [
      'Containerize a real app — write a Dockerfile, build it, and explain every layer.',
      'Compose a multi-service stack with docker-compose for local development.',
      'Push and pull images from a registry, public or private.',
      'Wire up a CI pipeline that tests, builds, and tags on every commit.',
      'Deploy from CI to a real environment without copying secrets into the repo.',
      'Reason about a Kubernetes cluster — pods, services, deployments — without becoming an SRE.',
      'Diagnose a failing container with logs, exec, and the patterns that catch most bugs.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Docker & DevOps',
      modules: [
        { title: 'Containers, demystified — what Docker actually does', lessonCount: 3 },
        { title: 'Writing a Dockerfile that won\'t embarrass you', lessonCount: 4 },
        { title: 'Compose — multi-service stacks for local work', lessonCount: 3 },
        { title: 'Registries, tags, and the supply chain', lessonCount: 3 },
        { title: 'CI/CD — a pipeline from commit to production', lessonCount: 5 },
        { title: 'Kubernetes — enough to read a manifest and ship a pod', lessonCount: 5 },
        { title: 'Debugging containers in the wild', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Which CI provider does the course assume?',
        answer:
          'You pick during the wizard — GitHub Actions, GitLab CI, CircleCI, or a generic walkthrough. The pipeline lessons and YAML examples shift to match.',
      },
      {
        question: 'How deep does it go on Kubernetes?',
        answer:
          'Working depth, not SRE depth. You\'ll write manifests, deploy a real pod, expose a service, and read a kubectl describe. Operators, custom resources, and cluster admin live in a more advanced course.',
      },
      {
        question: 'Do I need a cloud account to follow along?',
        answer:
          'For most modules, no — Docker runs locally and a local k3d / kind cluster covers Kubernetes basics. The CI/CD module connects to GitHub or GitLab, both of which have free tiers.',
      },
    ],
    estimatedHours: 'Typically 16–24 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    category: 'programming',
    eyebrow: 'Programming · Defensive foundations',
    headline: 'Learn cybersecurity — defensively, for the people who build and run systems.',
    subhead:
      'Strive builds a foundations course in defensive security for developers and IT pros — threat models, the OWASP Top 10, network basics, identity, and security across the SDLC. Pen-testing and offensive techniques are out of scope; this course is about understanding risk and building systems that hold up to it.',
    metaDescription:
      'Personal AI-built cybersecurity foundations course — threat modeling, OWASP Top 10, identity, network basics, and secure SDLC. Defensive framing only.',
    keywords: [
      'learn cybersecurity',
      'cybersecurity course',
      'cybersecurity for beginners',
      'owasp top 10',
      'application security',
      'secure coding',
      'personalized cybersecurity course',
    ],
    outcomes: [
      'Build a basic threat model for a system — assets, actors, surfaces, mitigations.',
      'Recognise and defend against the OWASP Top 10 in code you actually write.',
      'Reason about identity — authentication vs authorization, sessions, tokens, MFA.',
      'Read a network diagram — subnets, firewalls, TLS, and what each layer does.',
      'Handle secrets and credentials without leaking them into repos, logs, or images.',
      'Embed security checks into a CI pipeline — dependency scanning, SAST, code review prompts.',
      'Respond to an incident with the right first three steps, not the dramatic ones.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Cybersecurity foundations',
      modules: [
        { title: 'How to think about security — assets, threats, mitigations', lessonCount: 3 },
        { title: 'The OWASP Top 10 — the bugs that keep showing up', lessonCount: 5 },
        { title: 'Identity — auth, sessions, tokens, MFA', lessonCount: 4 },
        { title: 'Networks for non-network-engineers', lessonCount: 4 },
        { title: 'Secrets, credentials, and the supply chain', lessonCount: 3 },
        { title: 'Security in the SDLC — code review, scanning, CI', lessonCount: 4 },
        { title: 'When something goes wrong — incident response basics', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Will this teach me to hack or do penetration testing?',
        answer:
          'No — by design. This is a defensive foundations course for people who build and run systems. Penetration testing is a separate discipline with its own ethics and training paths; Strive doesn\'t cover offensive techniques.',
      },
      {
        question: 'Is it aimed at developers or IT generalists?',
        answer:
          'You pick during the wizard. The developer track leans into application security, code review, and secure coding patterns. The IT track leans into identity, network, and operations. The shared modules (threat modeling, incident response) stay common.',
      },
      {
        question: 'Will it prepare me for Security+ or other certifications?',
        answer:
          'It covers a lot of the conceptual ground, but it isn\'t a dedicated cert-prep course. If a specific exam is your goal, mention it in the wizard — the curriculum will tilt toward that exam\'s blueprint.',
      },
    ],
    estimatedHours: 'Typically 14–22 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
];
