import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "ResumeCheck — Build a resume that gets noticed", template: "%s | ResumeCheck" },
  description: "Get an instant ATS score, find missing keywords, and receive practical AI-powered resume feedback.",
  metadataBase: new URL("https://resume-check-three.vercel.app"),
  openGraph: { title: "ResumeCheck", description: "Build a resume that gets noticed.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
