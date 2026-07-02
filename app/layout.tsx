import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ResumeCheck — AI Resume Analyzer",
    description: "Instant AI-powered resume feedback.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
          <html lang="en">
                <body className="min-h-screen bg-gray-50">{children}</body>body>
          </html>html>
        );
}</html>
