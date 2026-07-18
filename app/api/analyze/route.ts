import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult } from "@/lib/analysis";

export type { AnalysisResult } from "@/lib/analysis";

export const runtime = "nodejs";

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

  const { resumeText, jobDescription, locale = "en" } = await req.json();
  if (!resumeText || resumeText.trim().length < 50)
    return NextResponse.json({ error: "Resume text too short" }, { status: 400 });

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5";

  const system = `You are an expert resume reviewer. Write every human-readable value in ${locale === "ar" ? "professional Arabic" : "professional English"}. Analyze the resume and return ONLY a JSON object with this exact structure:
{"overallScore":0-100,"summary":"string","strengths":["..."],"issues":[{"category":"","severity":"high|medium|low","description":"","suggestion":""}],"missingKeywords":["..."],"atsCompatibility":{"score":0-100,"notes":["..."]}}`;

  const userContent = jobDescription
    ? `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
    : `RESUME:\n${resumeText}`;

  try {
    const msg = await client.messages.create({
      model, max_tokens: 1024, system,
      messages: [{ role: "user", content: userContent }],
    });
    const raw = msg.content[0].type === "text" ? msg.content[0].text : "";
    const parsed = JSON.parse(extractJson(raw));
    
    const result: AnalysisResult = {
      overallScore: Math.min(100, Math.max(0, Number(parsed.overallScore) || 0)),
      summary: parsed.summary || "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      atsCompatibility: {
        score: Math.min(100, Math.max(0, Number(parsed.atsCompatibility?.score || parsed.atsScore) || 0)),
        notes: Array.isArray(parsed.atsCompatibility?.notes || parsed.atsNotes)
          ? (parsed.atsCompatibility?.notes || parsed.atsNotes)
          : [],
      },
    };
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: `Failed: ${e instanceof Error ? e.message : e}` }, { status: 500 });
  }
}
