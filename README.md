# SigMotion

AI-powered animated email signatures with interactive nav bars, logo animations, and profile animations — **100% free at launch**.

## Features

- AI-assisted signature builder (Gemini)
- Animated logo & profile GIF generation
- Interactive navigation bar with click tracking
- Team workspaces & bulk CSV import
- Analytics dashboard (privacy-first, no tracking pixels)
- Gmail, Outlook, Apple Mail install guides
- Template gallery

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Auth, PostgreSQL, Storage)
- **Vercel** (Hosting)
- **Tailwind CSS** + shadcn-style UI
- **Gemini API** (AI suggestions)
- **gifenc + sharp** (GIF animation pipeline)

## Getting Started

### 1. Clone & install

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run `supabase/migrations/001_initial_schema.sql`, then `002_security_and_storage.sql` (this also creates the `signatures-public` storage bucket and its policies)
3. Enable Email (and optionally Google) auth providers in Supabase Dashboard
4. Authentication → URL Configuration: set Site URL to your production URL and add `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback` as redirect URLs

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your Supabase and optional API keys
node scripts/setup-supabase.mjs   # verifies the connection and schema
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables from `.env.example`, with `NEXT_PUBLIC_APP_URL` set to the production URL
4. Deploy, then add the production `/auth/callback` URL in Supabase (step 2.4)

## Project Structure

```
src/
  app/              # Pages & API routes
  components/       # UI, landing, editor, dashboard
  lib/              # Supabase, signature renderer, GIF builder, AI
  types/            # TypeScript types
supabase/
  migrations/       # Database schema
```

## License

MIT
