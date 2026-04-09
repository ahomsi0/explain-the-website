import type { Overview, PageLoadHint } from "../../types/analysis";

const loadHint: Record<PageLoadHint, { label: string; dot: string; badge: string }> = {
  lightweight: { label: "Lightweight",   dot: "bg-emerald-400", badge: "bg-emerald-950/50 text-emerald-300 border-emerald-700/40" },
  medium:      { label: "Medium weight", dot: "bg-amber-400",   badge: "bg-amber-950/50  text-amber-300  border-amber-700/40"  },
  heavy:       { label: "Heavy page",    dot: "bg-rose-400",    badge: "bg-rose-950/50   text-rose-300   border-rose-700/40"   },
};

export function OverviewCard({ overview, url, fetchedAt }: { overview: Overview; url: string; fetchedAt: string }) {
  const hint = loadHint[overview.pageLoadHint];

  return (
    <div className="card card-accent-violet">
      <div className="flex items-center gap-4">
        {/* Favicon */}
        {overview.favicon ? (
          <img src={overview.favicon} alt="favicon"
            className="w-10 h-10 rounded-xl object-contain border border-slate-600 flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-800/30 flex items-center justify-center flex-shrink-0 text-violet-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
        )}

        {/* Title + URL */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-100 truncate">
            {overview.title || <span className="text-slate-500 italic font-normal">No page title</span>}
          </h2>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="text-sm text-violet-400 hover:text-violet-300 hover:underline truncate block mt-0.5">
            {url}
          </a>
        </div>

        {/* Right badges */}
        <div className="flex-shrink-0 flex items-center gap-2 flex-wrap justify-end">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${hint.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hint.dot}`} />
            {hint.label}
          </span>
          {overview.language && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/40">
              {overview.language.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Description — only if present, compact */}
      {overview.description && (
        <p className="mt-3 text-sm text-slate-400 leading-relaxed border-t border-slate-700/40 pt-3">
          {overview.description}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-600">
        Analyzed {new Date(fetchedAt).toLocaleString()}
      </p>
    </div>
  );
}
