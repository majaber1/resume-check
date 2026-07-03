"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import PricingSection from "@/components/PricingSection";
import type { AnalysisResult } from "@/app/api/analyze/route";
import {
  FREE_TIER_LIMIT,
  getRemainingFreeAnalyses,
  hasFreeAnalysesRemaining,
  recordAnalysisUsed,
} from "@/lib/usage";

export default function HomePage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(getRemainingFreeAnalyses());
  }, []);

  const charCount = resumeText.length;
  const isValid = resumeText.trim().length >= 50;

  async function handleAnalyze() {
    if (!isValid || loading) return;

    if (!hasFreeAnalysesRemaining()) {
      setLimitReached(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLimitReached(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setResult(data as AnalysisResult);
      const newCount = recordAnalysisUsed();
      setRemaining(Math.max(0, FREE_TIER_LIMIT - newCount));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setLimitReached(false);
  }

  function scrollToPricing() {
    document
      .getElementById("pricing")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Get instant, AI-powered resume feedback
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Paste your resume below. Add a job description to get a tailored
          keyword match, or leave it blank for a general quality and ATS review.
        </p>
        {remaining !== null && !limitReached && (
          <p className="mt-3 text-xs font-medium text-slate-400">
            {remaining > 0
              ? remaining + " of " + FREE_TIER_LIMIT + " free analyses remaining this month"
              : "You've used all your free analyses this month"}
          </p>
        )}
      </div>

      {limitReached && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            You have used your {FREE_TIER_LIMIT} free analyses this month
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Upgrade to Pro for unlimited resume analyses starting at $9/month.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={scrollToPricing}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              See Pro plan
            </button>
            <button
              onClick={handleReset}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {!result && !limitReached && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor="resume" className="block text-sm font-semibold text-slate-900">
              Resume text <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here..."
              rows={12}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>{isValid ? "" : "Minimum 50 characters"}</span>
              <span>{charCount.toLocaleString()} / 20,000</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor="jd" className="block text-sm font-semibold text-slate-900">
              Target job description{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you are applying to..."
              rows={8}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!isValid || loading}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze resume"}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          <p className="text-sm">Reviewing your resume...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <button
              onClick={handleReset}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Analyze another resume
            </button>
          </div>
          <ResultCard result={result} />
        </div>
      )}

      <PricingSection />
    </div>
  );
}
