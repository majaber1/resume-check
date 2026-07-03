import type { AnalysisResult, AnalysisIssue } from "@/app/api/analyze/route";

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

function scoreRingColor(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-rose-500";
}

function severityStyles(severity: AnalysisIssue["severity"]): string {
  switch (severity) {
    case "high":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "low":
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className="stroke-slate-200"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-700 ease-out ${scoreRingColor(score)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${scoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  );
}

export default function ResultCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-6">
      {/* Score overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="flex gap-6">
            <ScoreRing score={result.overallScore} label="Overall" />
            <ScoreRing
              score={result.atsCompatibility.score}
              label="ATS Match"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">Summary</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {result.summary || "No summary was returned."}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Strengths</h2>
          <ul className="mt-3 space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-0.5 text-emerald-500">checkmark</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {result.issues.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Issues &amp; Suggestions
          </h2>
          <div className="mt-3 space-y-3">
            {result.issues.map((issue, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${severityStyles(issue.severity)}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {issue.category}
                  </span>
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm">{issue.description}</p>
                <p className="mt-2 text-sm font-medium">
                  Suggestion: {issue.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {result.missingKeywords.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Missing Keywords
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Found in the job description but not in your resume.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 border border-brand-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ATS notes */}
      {result.atsCompatibility.notes.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            ATS Compatibility Notes
          </h2>
          <ul className="mt-3 space-y-2">
            {result.atsCompatibility.notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-0.5 text-slate-400">-</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
