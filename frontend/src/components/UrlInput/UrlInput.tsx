import { useState, type FormEvent } from "react";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

function isValidUrl(value: string): boolean {
  try {
    const url = value.startsWith("http") ? value : `https://${value}`;
    return new URL(url).hostname.includes(".");
  } catch { return false; }
}

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [value, setValue]               = useState("");
  const [validationError, setError]     = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed)          { setError("Please enter a URL to analyze"); return; }
    if (!isValidUrl(trimmed)) { setError("Please enter a valid URL, e.g. https://example.com"); return; }
    setError("");
    onAnalyze(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-2">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`flex items-center bg-slate-800 rounded-2xl border-2 transition-all duration-200 shadow-lg
            ${validationError
              ? "border-rose-500/70 shadow-rose-900/20"
              : "border-slate-600 focus-within:border-violet-500 focus-within:shadow-violet-900/30 focus-within:shadow-lg"
            }`}
        >
          {/* Globe icon */}
          <div className="pl-4 pr-2 flex-shrink-0 text-slate-500">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>

          <input
            type="url"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            placeholder="yourwebsite.com"
            disabled={isLoading}
            className="flex-1 py-4 text-sm text-slate-100 placeholder-slate-500 bg-transparent focus:outline-none disabled:text-slate-600 caret-violet-400"
            autoComplete="url"
            spellCheck={false}
          />

          <div className="p-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-violet-600 to-indigo-600
                         hover:from-violet-500 hover:to-indigo-500
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-150 active:scale-95 shadow-md shadow-violet-900/30"
            >
              {isLoading ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg> Analyze</>
              )}
            </button>
          </div>
        </div>

        {validationError && (
          <p className="mt-2.5 text-xs text-rose-400 flex items-center gap-1.5 pl-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {validationError}
          </p>
        )}
      </form>

      <p className="mt-5 text-xs text-slate-600 text-center flex items-center justify-center gap-3">
        <span>No login required</span><span>·</span>
        <span>Works on any public URL</span><span>·</span>
        <span>Results in seconds</span>
      </p>
    </div>
  );
}
