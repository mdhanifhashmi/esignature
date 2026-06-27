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
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql`
3. Create Storage buckets: `signatures-public` (public), `uploads-private` (private)
4. Enable Email and Google auth providers in Supabase Dashboard

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Supabase and optional API keys
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables from `.env.local.example`
4. Deploy

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
