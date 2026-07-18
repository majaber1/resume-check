import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  if (!supabase) return NextResponse.json({ analyses: [] });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("analyses").select("id,title,overall_score,ats_score,result,created_at").order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ analyses: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) return NextResponse.json({ saved: false });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ saved: false });
  const body = await req.json();
  const result = body.result;
  const { error } = await supabase.from("analyses").insert({ user_id: user.id, title: String(body.title || "Resume analysis").slice(0, 120), overall_score: result.overallScore, ats_score: result.atsCompatibility?.score || 0, result });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: true });
}

