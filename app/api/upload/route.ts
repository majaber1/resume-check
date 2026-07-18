import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export const runtime = "nodejs";
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File is required" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Maximum file size is 5 MB" }, { status: 413 });
    const name = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    if (name.endsWith(".pdf") || file.type === "application/pdf") text = (await pdf(buffer)).text;
    else if (name.endsWith(".docx") || file.type.includes("wordprocessingml")) text = (await mammoth.extractRawText({ buffer })).value;
    else return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 415 });
    text = text.replace(/\u0000/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, 20000);
    if (text.length < 50) return NextResponse.json({ error: "The file does not contain enough readable text" }, { status: 422 });
    return NextResponse.json({ text, fileName: file.name });
  } catch {
    return NextResponse.json({ error: "Could not read this document" }, { status: 400 });
  }
}

