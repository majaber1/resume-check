import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeCheck — AI Resume Analyzer",
  description: "Instant AI-powered resume feedback.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <span className="text-lg font-bold text-slate-900">ResumeCheck</span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
