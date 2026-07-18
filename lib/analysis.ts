export interface AnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  issues: { category: string; severity: "high" | "medium" | "low"; description: string; suggestion: string }[];
  missingKeywords: string[];
  atsCompatibility: { score: number; notes: string[] };
}

