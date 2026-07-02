import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

export interface AnalysisResult {
    overallScore: number;
    atsScore: number;
    summary: string;
    strengths: string[];
    issues: { category: string; severity: string; description: string; suggestion: string }[];
    missingKeywords: string[];
    atsNotes: string[];
  }

function extractJson(text: string): string {
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) return fence[1].trim();
    const obj = text.match(/\{[\s\S]*\}/);
    if (obj) return obj[0];
    return text.trim();
  }

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText || resumeText.trim().length < 50)
          return NextResponse.json({ error: "Resume text too short" }, { status: 400 });

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5";

    const system = `You are an expert resume reviewer. Analyze the resume and return ONLY a JSON object:
  {"overallScore":0-100,"atsScore":0-100,"summary":"string","strengths":["..."],"issues":[{"category":"","severity":"high|medium|low","description":"","suggestion":""}],"missingKeywords":["..."],"atsNotes":["..."]}`;

    const userContent = jobDescription
      ? `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
      : `RESUME:\n${resumeText}`;

    try {
          const msg = await client.messages.create({
                  model, max_tokens: 1024, system,
                  messages: [{ role: "user", content: userContent }],
                });
          const raw = msg.content[0].type === "text" ? msg.content[0].text : "";
          const result: AnalysisResult = JSON.parse(extractJson(raw));
          result.overallScore = Math.min(100, Math.max(0, result.overallScore ?? 0));
          result.atsScore = Math.min(100, Math.max(0, result.atsScore ?? 0));
          return NextResponse.json(result);
        } catch (e) {
          return NextResponse.json({ error: `Failed: ${e instanceof Error ? e.message : e}` }, { status: 500 });
        }
  }
