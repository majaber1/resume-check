import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getExtension(name: string): string {
    const idx = name.lastIndexOf(".");
    return idx >= 0 ? name.slice(idx).toLowerCase() : "";
  }

export async function POST(req: NextRequest) {
    try {
          const formData = await req.formData();
          const file = formData.get("file");

          if (!file || !(file instanceof File)) {
                  return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
                }

          const ext = getExtension(file.name);
          const buffer = Buffer.from(await file.arrayBuffer());

          let text = "";

          if (ext === ".pdf") {
                  const pdfParse = (await import("pdf-parse")).default;
                  const parsed = await pdfParse(buffer);
                  text = parsed.text;
                } else if (ext === ".docx") {
                  const mammoth = (await import("mammoth")).default;
                  const parsed = await mammoth.extractRawText({ buffer });
                  text = parsed.value;
                } else if (ext === ".txt") {
                  text = buffer.toString("utf-8");
                } else {
                  return NextResponse.json(
                            { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
                            { status: 400 }
                          );
                }

          text = text.trim();

          if (text.length < 50) {
                  return NextResponse.json(
                            { error: "Could not extract enough text from this file. Try pasting your resume text instead." },
                            { status: 422 }
                          );
                }

          return NextResponse.json({ text, fileName: file.name });
        } catch (e) {
          return NextResponse.json(
                  { error: `Failed to read file: ${e instanceof Error ? e.message : e}` },
                  { status: 500 }
                );
        }
  }
