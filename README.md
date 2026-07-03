# ResumeCheck

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/majaber1/resume-check&env=ANTHROPIC_API_KEY&envDescription=API%20key%20required%20for%20Claude-powered%20analysis&envLink=https://console.anthropic.com)

Instant, AI-powered resume feedback. Paste your resume text and optionally a target job description to get:

- An overall quality score and ATS-compatibility score
- Strengths
- Prioritized issues with concrete suggestions
- Missing keywords vs. the target job description
- ATS-specific formatting notes

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and the Anthropic API. Includes a lightweight freemium gate and a pricing section.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your API key

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this project to GitHub.
2. Click the **Deploy with Vercel** badge above.
3. Set the `ANTHROPIC_API_KEY` environment variable in the Vercel dashboard.
4. `vercel.json` is already configured for Next.js.

## Monetization tips

The freemium gate (`lib/usage.ts`) uses localStorage - a soft gate suitable for nudging users to upgrade. To harden it:

1. **IP rate limiting** - track requests in Redis/Upstash keyed by IP + month
2. **Add auth** - use Clerk or Auth.js to gate per user account
3. **Stripe billing** - wire the Pro upgrade button in PricingSection.tsx to Stripe Checkout

The Pro "Upgrade" button currently shows an alert() placeholder ready to connect to Stripe.

## Project structure

```
resume-check/
├── app/
│   ├── api/analyze/route.ts   # Claude API integration
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Main UI with freemium gate
├── components/
│   ├── ResultCard.tsx         # Analysis results display
│   └── PricingSection.tsx     # Free / Pro pricing
├── lib/
│   └── usage.ts               # localStorage usage tracking
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```
