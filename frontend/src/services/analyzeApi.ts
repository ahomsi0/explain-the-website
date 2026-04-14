import type { AnalysisResult } from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function waitForServerSignal(): Promise<void> {
  const response = await fetch(`${API_URL}/api/health`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Analysis server is unavailable (${response.status})`);
  }
}

export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  let data: { error?: string } | undefined;
  try { data = await response.json(); } catch { /* response body wasn't valid JSON */ }

  if (!response.ok) {
    throw new Error(data?.error ?? `Server error (${response.status})`);
  }

  return data as AnalysisResult;
}
