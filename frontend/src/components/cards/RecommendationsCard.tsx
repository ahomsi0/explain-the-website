export function RecommendationsCard({ recommendations }: { recommendations: string[] }) {
  return (
    <div className="card card-accent-rose">
      <div className="card-header">
        <span className="card-icon bg-violet-950/60 text-violet-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </span>
        <span className="card-title">Recommendations</span>
        {recommendations.length > 0 && (
          <span className="ml-auto text-xs text-slate-500">{recommendations.length} action{recommendations.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {recommendations.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No recommendations at this time.</p>
      ) : (
        <ol className="space-y-4">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-700/40 last:border-0">
              <span className="flex-shrink-0 text-xs font-semibold text-slate-600 w-4 mt-0.5">{i + 1}.</span>
              <span className="text-sm text-slate-300 leading-relaxed">{rec}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
