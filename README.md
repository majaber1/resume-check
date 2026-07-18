# ResumeCheck

Production-oriented AI resume analysis built with Next.js, Anthropic, Supabase, and Stripe.

## Features

- Paste resume text or upload PDF/DOCX files (5 MB maximum)
- English and Arabic analysis and RTL interface
- ATS score, strengths, issues, keyword gaps, and prioritized suggestions
- Email/password accounts with Supabase Auth
- Secure saved-analysis dashboard using Postgres row-level security
- Stripe Checkout subscriptions and signed webhook handling
- Client-side PDF report export
- Privacy, Terms, and Contact pages

## Local setup

1. Copy `.env.example` to `.env.local` and fill the required values.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create a recurring Stripe price and set `STRIPE_PRO_PRICE_ID`.
4. Register `/api/stripe/webhook` in Stripe and subscribe to `checkout.session.completed` and `customer.subscription.deleted`.
5. Install and start:

```bash
npm install
npm run dev
```

## Vercel environment variables

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (optional)
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `STRIPE_SECRET_KEY` (server-only)
- `STRIPE_WEBHOOK_SECRET` (server-only)
- `STRIPE_PRO_PRICE_ID`

Never expose service-role, Anthropic, or Stripe secret keys through `NEXT_PUBLIC_*` variables.

## Validation

```bash
npm run build
```

The legal pages are production-ready templates, but should be reviewed by qualified counsel for the jurisdictions in which the service operates. Replace the support email before launch if `support@resume-check.app` is not configured.
