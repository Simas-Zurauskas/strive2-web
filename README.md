# Client for the Strive v2 project.

### Getting Started

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Regenerate API types (requires the API server to be running):

```bash
yarn codegen
```

## Environment Variables

Create a `.env` file in the root directory with the following variables.

For local development, you can optionally create a `.env.local` file to override values from `.env`.

### Required Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (e.g. `http://localhost:4000`)
- `NEXTAUTH_URL`: Canonical URL of the Next.js app (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Secret for encrypting the NextAuth session cookie
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
