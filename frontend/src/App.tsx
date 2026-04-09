import { useState } from "react";
import { useAnalysis } from "./hooks/useAnalysis";
import { UrlInput } from "./components/UrlInput/UrlInput";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ErrorBanner } from "./components/ui/ErrorBanner";
import { ResultDashboard } from "./components/ResultDashboard/ResultDashboard";

export default function App() {
  const { status, result, error, analyze, reset } = useAnalysis();
  const [currentUrl, setCurrentUrl] = useState("");

  const handleAnalyze = (url: string) => { setCurrentUrl(url); analyze(url); };

  return (
    <div className="min-h-screen" style={{ background: "hsl(0 0% 4%)" }}>
      {status === "idle" && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-2xl fade-up">
            {/* Wordmark */}
            <div className="flex items-center gap-2.5 justify-center mb-10">
              <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-zinc-100 tracking-tight">Explain This Website</span>
            </div>

            {/* Headline */}
            <h1 className="text-center text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">
              Analyze any website<br />
              <span className="text-zinc-500">in seconds.</span>
            </h1>
            <p className="mt-5 text-center text-zinc-500 text-base leading-relaxed">
              Paste a URL — get tech stack, SEO audit, UX signals, and actionable recommendations.
            </p>

            {/* URL input */}
            <div className="mt-10">
              <UrlInput onAnalyze={handleAnalyze} isLoading={false} />
            </div>
          </div>
        </div>
      )}

      {status === "loading" && <LoadingSpinner url={currentUrl} />}

      {status === "error" && <ErrorBanner message={error!} onRetry={reset} />}

      {status === "success" && result && (
        <ResultDashboard result={result} onReset={reset} />
      )}
    </div>
  );
}
