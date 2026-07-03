export default function PricingSection() {
  return (
    <section id="pricing" className="mt-20 border-t border-slate-200 pt-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-2 text-slate-500">
          Start free. Upgrade any time for unlimited feedback.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
        {/* Free tier */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Free
          </h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            $0
            <span className="text-base font-normal text-slate-400">/month</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">checkmark</span>
              2 resume analyses / month
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">checkmark</span>
              ATS compatibility score
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">checkmark</span>
              Job description keyword match
            </li>
          </ul>
          <button
            disabled
            className="mt-8 w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-400"
          >
            Current plan
          </button>
        </div>

        {/* Pro tier */}
        <div className="relative rounded-2xl border-2 border-brand-600 bg-white p-6 shadow-md">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Pro
          </h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            $9
            <span className="text-base font-normal text-slate-400">/month</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">checkmark</span>
              Unlimited resume analyses
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">checkmark</span>
              Everything in Free
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">checkmark</span>
              Priority support
            </li>
          </ul>
          <button
            onClick={() => alert('Wire this up to your Stripe Checkout session — see README.md for Monetization tips.')}
            className="mt-8 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </section>
  );
}
