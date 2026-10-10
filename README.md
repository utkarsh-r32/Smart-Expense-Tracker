# Smart Expense Tracker

A Vercel-ready expense tracking dashboard built in Next.js and designed for Supabase authentication and data storage.

## Project analysis

This project started as a desktop Tkinter app with SQLite. Its original features included:

- adding expenses
- viewing expenses
- updating records
- deleting entries
- category-based organization
- dashboard-style UI

This web version preserves the feature set and upgrades the app for a Vercel + Supabase stack with auth, monthly summaries, and charts.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add your real Supabase project URL and anon key.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open http://localhost:3000.

## Supabase setup

Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.

## Vercel environment variables

Configure these in Vercel project settings -> Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

For production, set `NEXT_PUBLIC_SITE_URL` to your deployed Vercel URL, for example:

```bash
https://your-app-name.vercel.app
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables above.
4. Deploy.

## Auth and reporting

The app includes:

- email/password Supabase Auth
- per-user expense records
- summary cards
- bar and pie charts
- monthly spending reports
- fallback demo mode while env values are missing
