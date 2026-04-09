export function WeakPointsCard({ weakPoints }: { weakPoints: string[] }) {
  return (
    <div className="card card-accent-amber">
      <div className="card-header">
        <span className="card-icon bg-amber-950/60 text-amber-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <span className="card-title">Weak Points</span>
        {weakPoints.length > 0 && (
          <span className="ml-auto text-xs text-slate-500">{weakPoints.length} issue{weakPoints.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {weakPoints.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2 text-center">
          <span className="text-2xl">🎉</span>
          <p className="text-sm font-medium text-emerald-400">No significant weak points detected!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {weakPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-700/40 last:border-0">
              <span className="flex-shrink-0 text-xs font-semibold text-slate-600 w-4 mt-0.5">{i + 1}.</span>
              <span className="text-sm text-slate-300 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
