const plans = [
  { name: "Free", price: "$0", note: "Try the essentials", features: ["2 analyses every month", "ATS compatibility score", "Keyword gap overview"], cta: "Start for free" },
  { name: "Pro", price: "$9", note: "For active job seekers", features: ["Unlimited resume analyses", "Full job-specific report", "Priority recommendations", "Downloadable reports"], cta: "Upgrade to Pro", popular: true },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-indigo-300">SIMPLE PRICING</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Start free. Upgrade when it matters.</h2>
          <p className="mt-4 text-slate-400">Clear feedback, no hidden fees, cancel anytime.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative rounded-3xl border p-7 ${plan.popular ? "border-indigo-400 bg-white text-slate-950 shadow-2xl" : "border-slate-800 bg-slate-900"}`}>
              {plan.popular && <span className="absolute right-6 top-6 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">Most popular</span>}
              <p className="text-sm font-bold">{plan.name}</p><p className="mt-4 text-4xl font-bold">{plan.price}<span className="text-base font-medium opacity-50">/month</span></p>
              <p className="mt-2 text-sm opacity-60">{plan.note}</p>
              <ul className="mt-7 space-y-3 text-sm">{plan.features.map((x) => <li key={x} className="flex gap-3"><span className="font-bold text-emerald-500">✓</span>{x}</li>)}</ul>
              <button onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })} className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-white text-slate-950 hover:bg-slate-100"}`}>{plan.cta}</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
