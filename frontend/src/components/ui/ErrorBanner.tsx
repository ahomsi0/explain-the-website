export function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 gap-5">
      <div className="w-16 h-16 rounded-2xl bg-rose-900/30 border border-rose-700/50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <div className="text-center max-w-md">
        <p className="text-base font-semibold text-slate-100">Analysis failed</p>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{message}</p>
      </div>
      <button onClick={onRetry} className="btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
        </svg>
        Try another URL
      </button>
    </div>
  );
}
