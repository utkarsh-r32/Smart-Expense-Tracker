# Smart Expense Tracker

A responsive expense-tracking web application built with Next.js, React, TypeScript, and Supabase. It provides account-based access, expense entry, spending summaries, and charts. The production web app is hosted on Vercel.

- **Live app:** https://smart-expense-tracker-eight-pied.vercel.app/
- **Privacy policy:** https://smart-expense-tracker-eight-pied.vercel.app/privacy
- **Terms of Service:** https://smart-expense-tracker-eight-pied.vercel.app/terms

## Project type and scope

This GitHub repository contains the web application. A Flutter Android companion app is maintained separately and is not included in this repository.

The web app uses Supabase Auth for sign-in and Supabase Postgres for account-scoped expense records. When Supabase environment variables are absent, the interface falls back to sample demo data so the dashboard can be previewed locally.

## Features

- Email/password account creation, sign-in, and sign-out through Supabase Auth.
- Google sign-in through Supabase OAuth. Google must be enabled and configured in the Supabase project before this feature can be used.
- Add expenses with date, category, description, amount, and payment method.
- Account-specific expense storage protected by Postgres row-level security (RLS).
- Summary cards for total spending, average expense amount, top spending category, and active payment methods.
- Recent expense list, monthly spending bar chart, and category-share pie chart.
- Responsive dashboard and authentication views.
- Public Privacy Policy and Terms of Service pages at `/privacy` and `/terms`.

The web dashboard currently supports adding expenses; the separate Flutter app has additional mobile-specific functionality.

## Technology

- Next.js App Router and TypeScript
- React
- Tailwind CSS
- Supabase Auth and Postgres (`@supabase/supabase-js`)
- Recharts for charts
- Lucide React for icons
- Vercel for hosting and deployment

## Repository structure

```text
app/
	globals.css                 Global styles
	layout.tsx                  Root layout and site metadata
	page.tsx                    Dashboard route
	privacy/page.tsx            Privacy policy
	terms/page.tsx              Terms of Service
components/
	expense-dashboard.tsx       Authentication, expense form, summaries, charts
lib/
	mock-data.ts                Demo expenses, categories, and payment methods
	supabase.ts                 Supabase browser client and configuration check
public/                       Static assets
supabase/
	schema.sql                  Tables, indexes, RLS, and policies
.env.example                 Local environment variable template
package.json                 Dependencies and scripts
```

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project for persistent storage and authentication

## Run locally

1. Clone this repository and open its directory.
2. Copy `.env.example` to `.env.local`.
3. Fill in the Supabase URL and publishable/anon key from your Supabase project.
4. Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

5. Open http://localhost:3000.

Useful checks:

```bash
npm run lint
npm run build
```

## Environment variables

Set these in `.env.local` for development and in Vercel project settings for deployments:

| Variable | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | `https://your-project-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/legacy anon key used by the browser client | `your-public-anon-key` |
| `NEXT_PUBLIC_SITE_URL` | App origin used as the OAuth redirect destination | `http://localhost:3000` locally; production Vercel URL in production |

Never commit `.env.local`, a Supabase service-role key, or an OAuth client secret. The browser app only needs the public anon/publishable key; access control must be enforced by RLS.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. Add the project URL and public anon/publishable key to `.env.local`.
4. In **Authentication → URL Configuration**, set the Site URL to the deployed app origin and add the local and production app URLs to the redirect allow list.
5. For Google sign-in, enable Google under **Authentication → Sign In / Providers**, then configure its OAuth client ID and secret. Keep the secret in Supabase, not in this repository.

The schema creates `expenses` and `categories`. Expenses reference `auth.users`, and RLS policies restrict viewing, inserting, updating, and deleting records to the signed-in owner. The sample SQL grants public read access only to category names.

## Google OAuth setup

For the web app, create a Google OAuth **Web application** client. Add this URI under its **Authorized redirect URIs**:

```text
https://zdjvhvslyzfkeelhomya.supabase.co/auth/v1/callback
```

Configure the Web client ID and secret in Supabase. Set `NEXT_PUBLIC_SITE_URL` to the deployed app origin and allow that origin in Supabase Auth URL Configuration. Google OAuth consent-screen test users and app verification are managed in Google Cloud.

## Deploy to Vercel

1. Import `utkarsh-r32/Smart-Expense-Tracker` into Vercel.
2. Add the three environment variables above in **Project Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://smart-expense-tracker-eight-pied.vercel.app` for this deployment.
4. Deploy. Commits pushed to the connected `main` branch trigger production deployments.

## Data and privacy

Expense records contain a user ID, date, category, description, amount, payment method, and creation timestamp. Supabase RLS scopes expense access to the authenticated user. See the published [Privacy Policy](https://smart-expense-tracker-eight-pied.vercel.app/privacy) and [Terms of Service](https://smart-expense-tracker-eight-pied.vercel.app/terms) for user-facing information.
