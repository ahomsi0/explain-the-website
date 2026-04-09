import { useState }        from "react";
import { useAnalysis }     from "./hooks/useAnalysis";
import { Header }          from "./components/layout/Header";
import { UrlInput }        from "./components/UrlInput/UrlInput";
import { LoadingSpinner }  from "./components/ui/LoadingSpinner";
import { ErrorBanner }     from "./components/ui/ErrorBanner";
import { ResultDashboard } from "./components/ResultDashboard/ResultDashboard";

export default function App() {
  const { status, result, error, analyze, reset } = useAnalysis();
  const [currentUrl, setCurrentUrl] = useState("");

  const handleAnalyze = (url: string) => { setCurrentUrl(url); analyze(url); };

  return (
    <div className="min-h-screen bg-slate-900">
      {status === "idle" && (
        <>
          <Header />
          <div className="pt-2 pb-10">
            <UrlInput onAnalyze={handleAnalyze} isLoading={false} />
          </div>
        </>
      )}

      {status === "loading" && (
        <>
          <div className="bg-slate-800/60 border-b border-slate-700/60 py-4 text-center">
            <p className="text-sm text-slate-500">
              Analyzing <span className="font-medium text-slate-300">{currentUrl}</span>
            </p>
          </div>
          <LoadingSpinner url={currentUrl} />
        </>
      )}

      {status === "error" && (
        <>
          <div className="bg-slate-800/60 border-b border-slate-700/60 py-4 text-center">
            <p className="text-sm text-slate-500">
              Failed to analyze <span className="font-medium text-slate-300">{currentUrl}</span>
            </p>
          </div>
          <ErrorBanner message={error!} onRetry={reset} />
        </>
      )}

      {status === "success" && result && (
        <main className="pt-6">
          <ResultDashboard result={result} onReset={reset} />
        </main>
      )}
    </div>
  );
}
