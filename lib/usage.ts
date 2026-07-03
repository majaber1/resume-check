"use client";

const STORAGE_KEY = "resumecheck_usage";
export const FREE_TIER_LIMIT = 2;

interface UsageData {
  count: number;
  monthKey: string;
}

function currentMonthKey(): string {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
}

function readUsage(): UsageData {
  if (typeof window === "undefined") {
    return { count: 0, monthKey: currentMonthKey() };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, monthKey: currentMonthKey() };
    const parsed: UsageData = JSON.parse(raw);
    if (parsed.monthKey !== currentMonthKey()) {
      return { count: 0, monthKey: currentMonthKey() };
    }
    return parsed;
  } catch {
    return { count: 0, monthKey: currentMonthKey() };
  }
}

function writeUsage(data: UsageData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

export function getUsageCount(): number {
  return readUsage().count;
}

export function getRemainingFreeAnalyses(): number {
  return Math.max(0, FREE_TIER_LIMIT - readUsage().count);
}

export function hasFreeAnalysesRemaining(): boolean {
  return getRemainingFreeAnalyses() > 0;
}

export function recordAnalysisUsed(): number {
  const usage = readUsage();
  const updated: UsageData = {
    count: usage.count + 1,
    monthKey: currentMonthKey(),
  };
  writeUsage(updated);
  return updated.count;
}
