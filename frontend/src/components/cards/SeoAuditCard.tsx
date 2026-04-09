import type { SEOCheck } from "../../types/analysis";
import { SeoCheckRow } from "../ui/SeoCheckRow";

export function SeoAuditCard({ seoChecks }: { seoChecks: SEOCheck[] }) {
  const pass    = seoChecks.filter((c) => c.status === "pass").length;
  const warning = seoChecks.filter((c) => c.status === "warning").length;
  const fail    = seoChecks.filter((c) => c.status === "fail").length;
  const score   = seoChecks.length ? Math.round((pass / seoChecks.length) * 100) : 0;
  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";
  const trackColor = score >= 80 ? "bg-emerald-500"   : score >= 50 ? "bg-amber-500"   : "bg-rose-500";

  return (
    <div className="card card-accent-blue">
      {/* Header row with score inline */}
      <div className="flex items-center gap-3 mb-4">
        <span className="card-icon bg-blue-950/60 text-blue-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </span>
        <span className="card-title flex-1">SEO Audit</span>

        {/* Inline score + pills */}
        <span className={`text-xl font-extrabold ${scoreColor}`}>
          {score}<span className="text-xs font-medium text-slate-600">/100</span>
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span><span className="text-emerald-400 font-semibold">{pass}</span> pass</span>
          <span><span className="text-amber-400 font-semibold">{warning}</span> warn</span>
          <span><span className="text-rose-400 font-semibold">{fail}</span> fail</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="score-track mb-5">
        <div className={`h-full rounded-full transition-all duration-700 ${trackColor}`} style={{ width: `${score}%` }} />
      </div>

      {/* Check rows */}
      <div>{seoChecks.map((c) => <SeoCheckRow key={c.id} check={c} />)}</div>
    </div>
  );
}
