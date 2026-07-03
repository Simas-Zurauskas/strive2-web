# Strive Client

The Strive web app: a Next.js 16 + React 19 App Router frontend that fronts the Strive API. It owns authentication, the course-creation wizard, the realtime learning experience (lesson streaming, quizzes, retrieval-practice recall), billing UI, and the marketing surface.

## Stack

- **Framework** — Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- **Auth** — NextAuth 4 (JWT strategy, Google OAuth + Credentials provider, server-revoke sign-out via API)
- **Styling** — styled-components 6, a hand-rolled design system (15 colour roles, two typefaces, four breakpoints, no UI kit)
- **Data fetching** — Axios + TanStack Query 5; types codegen'd from the API's `swagger.json`
- **Realtime** — Single Socket.io connection for job progress, lesson streaming, and credit balance changes
- **Editors / rendering** — CodeMirror 6 (lessons w/ code), react-markdown + remark-math + rehype-katex, Mermaid diagrams, Highcharts, framer-motion
- **Forms** — Formik + Yup
- **Analytics & errors** — Mixpanel, Google Analytics 4, Google Ads, Vercel Analytics, Sentry (`@sentry/nextjs`)

## Getting started

Requires Node 22.x and Yarn 1.22.x. Install dependencies and run the dev server:

```bash
yarn install
yarn dev
```

The dev server runs at `http://localhost:3000` and expects the API at `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).

Regenerate the typed API client whenever the backend's OpenAPI spec changes. The API server must be running:

```bash
yarn codegen
```

This writes `src/api/_generated.ts` from `${NEXT_PUBLIC_API_URL}/swagger.json` (defaults to `http://localhost:4000/swagger.json`).

## Scripts

| Command         | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `yarn dev`      | Next dev server with Turbopack                                   |
| `yarn build`    | Production build (Turbopack)                                     |
| `yarn start`    | Run the production build                                         |
| `yarn lint`     | ESLint check                                                     |
| `yarn lint:fix` | ESLint auto-fix                                                  |
| `yarn codegen`  | Regenerate `src/api/_generated.ts` from the API's `swagger.json` |

## Project structure

```
client/src/
├── app/              Next.js App Router file tree
│   ├── layout.tsx    Root layout: fonts, theme bootstrap, mounts Registry
│   ├── _registry/    Provider stack (NextAuth, React Query, theme, sockets, analytics)
│   ├── api/auth/     NextAuth catch-all route handler
│   ├── (auth)/       Auth screens + public landing at `/`
│   ├── (protected)/  Authenticated app: home, course, lesson, quiz, recall, profile
│   ├── (public)/     Pricing + legal markdown pages
│   └── admin/        Staff tooling
├── api/              Axios instance + OpenAPI codegen + per-domain route wrappers
├── conf/             env.ts (browser) + env.server.ts (server-only, throws on miss)
├── constants/        Centralized route builders + TOAST string map
├── components/       ui-primitives, billing-ui, navigation-and-shell
├── hooks/            Queries, mutations, real-time providers
├── lib/              Allowance, celebrations, formatters, event bus, gtag, analytics, errorReporter
├── screens/          Top-level screen folders
├── theme/            Tokens, GlobalStyles, scheme switching
├── types/            Ambient TypeScript declarations
├── validation/       Yup schemas
└── middleware.ts     Edge-side auth gate
```

## Conventions

- **API types** live in [src/api/types.ts](src/api/types.ts) as re-exports of `_generated.ts` schema components. Route modules under `src/api/routes/*/index.ts` import `paths` directly from `_generated.ts` — that is the one sanctioned exception to the indirection.
- **No re-exports through `.styles.ts` files** — components are imported directly in `.tsx` siblings.
- **No local enum types** — string-literal unions come from `@/api/types` (which mirrors the OpenAPI spec).
- **`api/types.ts` is for OpenAPI schema re-exports only** — ambient declarations go in `src/types/`.

## Environment variables

Create a `.env` file in `client/` with the variables below. For local development you may add a `.env.local` to override individual values.

Required variables are validated at module load by [`src/conf/env.ts`](src/conf/env.ts) (browser) and [`src/conf/env.server.ts`](src/conf/env.server.ts) (server) and throw if missing.

### Core

- `NEXT_PUBLIC_API_URL` — Backend API base URL (e.g. `http://localhost:4000`) (required)
- `NEXTAUTH_URL` — Canonical URL of the Next.js app (e.g. `http://localhost:3000`). Also used as `SITE_URL` for sitemap, OpenGraph metadata, and JSON-LD (required)
- `NEXTAUTH_SECRET` — Secret for encrypting the NextAuth session cookie (required)
- `NEXT_PUBLIC_DEV_MODE` — `true` disables prod-only chrome (analytics scripts). Defaults to `false` (optional)
- `NEXT_PUBLIC_RELEASE_SHA` — Build SHA stamped on Mixpanel events as `app_version`. Defaults to `dev` (optional)

### Auth

- `GOOGLE_CLIENT_ID` — Google OAuth client ID (required; must match the API's `GOOGLE_CLIENT_ID` for token validation)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (required)

### Analytics

- `NEXT_PUBLIC_MIXPANEL_TOKEN` — Mixpanel project token (write-only, safe to expose). Must match the API's `MIXPANEL_PROJECT_TOKEN` (required)
- `NEXT_PUBLIC_GOOGLE_ADS_ID` — Google Ads tag, e.g. `AW-1234567890`. Drives the gtag bootstrap (required)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 Measurement ID, e.g. `G-XXXXXXXXXX` (required)
- `NEXT_PUBLIC_APPZI_BUTTON_ID` — Appzi feedback widget button GUID surfaced by the navbar Feedback button (required)

### Observability (Sentry)

- `NEXT_PUBLIC_SENTRY_DSN` — Browser + Sentry runtime DSN (optional; Sentry init is a no-op when unset)
- `SENTRY_DSN` — Server / edge DSN; falls back to `NEXT_PUBLIC_SENTRY_DSN` when unset (optional)
- `NEXT_PUBLIC_SENTRY_ENV` — Browser Sentry environment tag. Defaults to `production` (optional)
- `SENTRY_ENV` — Server / edge Sentry environment tag. Defaults to `NODE_ENV` then `production` (optional)

## Operational notes

- **`NEXT_PUBLIC_*` variables are inlined at build time** via static string replacement, so they MUST be referenced as full literals (e.g. `process.env.NEXT_PUBLIC_API_URL`) — dynamic access like `process.env[key]` will not be replaced and will be `undefined` in the browser. See [src/conf/env.ts](src/conf/env.ts).
- **Server-only secrets live in [src/conf/env.server.ts](src/conf/env.server.ts)** — never import from a client component.
- **`yarn codegen` requires the API server running.** Production codegen must point at staging because the API hides Swagger in production.
- **Single Socket.io connection per session** — the realtime layer is wired through `_registry/Registry.tsx` and consumed via the `useSocket` / `useJobManager` hook family.
- **Provider stack** — `_registry/Registry.tsx` composes NextAuth, React Query, styled-components, theme/session sync, Sentry global error capture, and the analytics bootstrap (Mixpanel + GA4 + Ads) in a fixed order. Adding a provider means inserting it there, not in `app/layout.tsx`.
- **Edge auth gate** — `src/middleware.ts` runs at the edge and redirects unauthenticated requests to `/` for protected routes.
