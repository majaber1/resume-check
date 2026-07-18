"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import PricingSection from "@/components/PricingSection";
import type { AnalysisResult } from "@/app/api/analyze/route";
import { FREE_TIER_LIMIT, getRemainingFreeAnalyses, hasFreeAnalysesRemaining, recordAnalysisUsed } from "@/lib/usage";

const features = [
  ["ATS score", "See how well your resume can be parsed by applicant tracking systems.", "◎"],
  ["Keyword match", "Compare your experience with the exact language in a target job.", "⌁"],
  ["Impact check", "Turn passive responsibilities into specific, measurable achievements.", "↗"],
  ["Priority fixes", "Know what to improve first instead of rewriting everything blindly.", "✓"],
  ["Clarity review", "Find vague, repetitive, and difficult-to-scan resume language.", "◇"],
  ["Practical feedback", "Get direct suggestions you can apply immediately.", "✦"],
];

const faqs = [
  ["What is an ATS?", "An applicant tracking system helps employers collect, parse, and filter applications. A clear structure and relevant language make your resume easier to understand."],
  ["Is my resume secure?", "Resume content is used only to generate your analysis. Avoid including unnecessary sensitive identifiers such as national ID or banking information."],
  ["Do you guarantee interviews?", "No tool can guarantee an interview. ResumeCheck helps you identify weaknesses and align your resume more clearly with a role."],
  ["Do I need a job description?", "No. You can run a general review, but adding a job description enables a more useful keyword and relevance comparison."],
];

function Logo() { return <a href="#top" className="flex items-center gap-2 font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">✓</span><span>ResumeCheck</span></a>; }

export default function HomePage() {
  const [resumeText, setResumeText] = useState(""); const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const [result, setResult] = useState<AnalysisResult | null>(null);
  const [limitReached, setLimitReached] = useState(false); const [remaining, setRemaining] = useState<number | null>(null); const [menu, setMenu] = useState(false);
  useEffect(() => setRemaining(getRemainingFreeAnalyses()), []);
  const isValid = resumeText.trim().length >= 50;

  async function handleAnalyze() {
    if (!isValid || loading) return;
    if (!hasFreeAnalysesRemaining()) { setLimitReached(true); return; }
    setLoading(true); setError(null); setResult(null); setLimitReached(false);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeText, jobDescription }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setResult(data); const count = recordAnalysisUsed(); setRemaining(Math.max(0, FREE_TIER_LIMIT - count));
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); } finally { setLoading(false); }
  }

  return <div id="top" className="overflow-hidden">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex"><a href="#how" className="hover:text-slate-950">How it works</a><a href="#features" className="hover:text-slate-950">Features</a><a href="#pricing" className="hover:text-slate-950">Pricing</a><a href="#faq" className="hover:text-slate-950">FAQ</a></nav>
        <div className="hidden items-center gap-3 md:flex"><a href="#analyzer" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-600">Check my resume</a></div>
        <button onClick={() => setMenu(!menu)} aria-label="Toggle navigation" className="rounded-lg border p-2 md:hidden">☰</button>
      </div>
      {menu && <nav className="border-t bg-white px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm font-semibold"><a href="#how">How it works</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#analyzer">Check my resume</a></div></nav>}
    </header>

    <main>
      <section className="relative bg-gradient-to-b from-indigo-50/80 via-white to-white pb-20 pt-32 sm:pt-40">
        <div className="grid-fade absolute inset-0 -z-0" />
        <div className="relative mx-auto max-w-6xl px-5 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" />AI-powered resume feedback in minutes</div>
          <h1 className="text-balance mx-auto mt-7 max-w-4xl text-5xl font-extrabold tracking-[-.045em] text-slate-950 sm:text-7xl">Build a resume that gets <span className="text-indigo-600">noticed.</span></h1>
          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">Get an instant ATS score, uncover missing keywords, and receive clear recommendations tailored to the job you want.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href="#analyzer" className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">Analyze my resume — free</a><a href="#sample" className="rounded-xl border bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50">See sample report</a></div>
          <p className="mt-4 text-xs font-medium text-slate-500">No credit card required · 2 free analyses</p>
          <div id="sample" className="mx-auto mt-14 max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-3 text-left shadow-soft">
            <div className="rounded-3xl bg-slate-950 p-5 text-white sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Sample analysis</p><h2 className="mt-2 text-2xl font-bold">Senior Product Manager</h2><p className="mt-1 text-sm text-slate-400">Strong foundation with 4 high-priority improvements</p></div><div className="flex items-center gap-4"><div className="grid h-24 w-24 place-items-center rounded-full border-[8px] border-emerald-400 text-3xl font-bold">82</div><div className="text-sm"><p className="font-bold">Great start</p><p className="text-slate-400">Top 20% of reviews</p></div></div></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">{[["ATS readiness","88%"],["Keyword match","74%"],["Content impact","81%"]].map(x=><div key={x[0]} className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">{x[0]}</p><p className="mt-1 text-xl font-bold">{x[1]}</p></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y bg-slate-50 py-20"><div className="mx-auto max-w-6xl px-5"><div className="text-center"><p className="text-sm font-bold text-indigo-600">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From upload to action plan</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{[["01","Paste your resume","Add the resume text you want reviewed."],["02","Add the target role","Paste a job description for tailored matching."],["03","Get your improvement plan","Review scores, strengths, gaps, and next steps."]].map(x=><article key={x[0]} className="rounded-3xl border bg-white p-7 shadow-sm"><span className="text-sm font-black text-indigo-600">{x[0]}</span><h3 className="mt-8 text-xl font-bold">{x[1]}</h3><p className="mt-3 leading-7 text-slate-600">{x[2]}</p></article>)}</div></div></section>

      <section id="features" className="py-24"><div className="mx-auto max-w-6xl px-5"><div className="max-w-2xl"><p className="text-sm font-bold text-indigo-600">A BETTER REVIEW</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Know exactly what is helping—or hurting—your application.</h2></div><div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{features.map(x=><article key={x[0]}><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-lg font-black text-indigo-600">{x[2]}</span><h3 className="mt-5 font-bold">{x[0]}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{x[1]}</p></article>)}</div></div></section>

      <section id="analyzer" className="bg-indigo-50/70 py-24"><div className="mx-auto max-w-5xl px-5"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold text-indigo-600">FREE RESUME ANALYZER</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">See what recruiters and ATS software see</h2><p className="mt-4 text-slate-600">Paste your resume below. Add a job description for a tailored comparison.</p></div>
        <div className="mt-10 rounded-[2rem] border bg-white p-5 shadow-soft sm:p-8">
          {remaining !== null && <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600"><span>Free monthly usage</span><span>{remaining} of {FREE_TIER_LIMIT} remaining</span></div>}
          {!result && !limitReached && <div className="grid gap-5 lg:grid-cols-2"><label className="block"><span className="text-sm font-bold">Resume text <b className="text-rose-500">*</b></span><textarea value={resumeText} onChange={e=>setResumeText(e.target.value.slice(0,20000))} rows={13} placeholder="Paste your resume here…" className="mt-2 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"/><span className="mt-1 flex justify-between text-xs text-slate-400"><b className="font-medium">{isValid?"Ready to analyze":"Minimum 50 characters"}</b><b className="font-medium">{resumeText.length.toLocaleString()} / 20,000</b></span></label><div><label className="block"><span className="text-sm font-bold">Target job description <b className="font-medium text-slate-400">(optional)</b></span><textarea value={jobDescription} onChange={e=>setJobDescription(e.target.value.slice(0,20000))} rows={9} placeholder="Paste the job description you’re applying to…" className="mt-2 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"/></label><div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs leading-5 text-emerald-800"><b>Privacy first.</b> Only include information needed for the review. Never paste national IDs, financial data, or passwords.</div><button onClick={handleAnalyze} disabled={!isValid||loading} className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">{loading?"Analyzing your resume…":"Start free analysis →"}</button></div></div>}
          {loading && <div className="py-16 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"/><p className="mt-4 font-bold">Checking structure, keywords, and impact…</p></div>}
          {error && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          {limitReached && <div className="py-12 text-center"><h3 className="text-xl font-bold">You have used your free analyses</h3><p className="mt-2 text-slate-600">See the Pro plan for continued access.</p><a href="#pricing" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">See Pro plan</a></div>}
          {result&&!loading&&<div><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-bold">Your resume report</h3><button onClick={()=>{setResult(null);setError(null)}} className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-slate-50">Analyze another</button></div><ResultCard result={result}/></div>}
        </div></div></section>

      <PricingSection />
      <section id="faq" className="py-24"><div className="mx-auto max-w-3xl px-5"><div className="text-center"><p className="text-sm font-bold text-indigo-600">FAQ</p><h2 className="mt-3 text-3xl font-bold">Questions, answered.</h2></div><div className="mt-10 divide-y rounded-3xl border bg-white px-6">{faqs.map(x=><details key={x[0]} className="group py-5"><summary className="cursor-pointer list-none font-bold">{x[0]} <span className="float-right text-indigo-600 group-open:rotate-45">+</span></summary><p className="mt-3 pr-8 text-sm leading-6 text-slate-600">{x[1]}</p></details>)}</div></div></section>
    </main>
    <footer className="border-t bg-slate-50"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center"><Logo/><p className="text-sm text-slate-500">© {new Date().getFullYear()} ResumeCheck. Improve with clarity.</p><div className="flex gap-5 text-sm font-semibold text-slate-600"><a href="#pricing">Pricing</a><a href="#faq">Privacy & FAQ</a></div></div></footer>
  </div>;
}
