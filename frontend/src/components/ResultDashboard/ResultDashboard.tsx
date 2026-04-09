import type { AnalysisResult } from "../../types/analysis";
import { OverviewCard }        from "../cards/OverviewCard";
import { TechStackCard }       from "../cards/TechStackCard";
import { SeoAuditCard }        from "../cards/SeoAuditCard";
import { ConversionCard }      from "../cards/ConversionCard";
import { WeakPointsCard }      from "../cards/WeakPointsCard";
import { RecommendationsCard } from "../cards/RecommendationsCard";
import { PageStatsCard }       from "../cards/PageStatsCard";
import { CopyButton }          from "../ui/CopyButton";
import { DownloadButton }      from "../ui/DownloadButton";

function computeScores(result: AnalysisResult) {
  const pass    = result.seoChecks.filter((c) => c.status === "pass").length;
  const seoScore = result.seoChecks.length ? Math.round((pass / result.seoChecks.length) * 100) : 0;
  const uxSignals = [result.ux.hasCTA, result.ux.hasForms, result.ux.hasSocialProof, result.ux.hasTrustSignals, result.ux.hasContactInfo, result.ux.mobileReady];
  const uxScore   = Math.round((uxSignals.filter(Boolean).length / uxSignals.length) * 100);
  return { seoScore, uxScore };
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

function StatCard({ label, value, suffix, sub, valueClass = "text-slate-100" }: {
  label: string; value: string | number; suffix?: string; sub?: string; valueClass?: string;
}) {
  return (
    <div className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-4">
      <p className="text-[11px] font-medium text-slate-500 mb-2">{label}</p>
      <p className={`text-2xl font-bold leading-none ${valueClass}`}>
        {value}
        {suffix && <span className="text-sm font-normal text-slate-600 ml-0.5">{suffix}</span>}
      </p>
      {sub && <p className="text-xs text-slate-600 mt-1.5">{sub}</p>}
    </div>
  );
}

export function ResultDashboard({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const { seoScore, uxScore } = computeScores(result);
  const issueCount = result.weakPoints.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-5 pb-20">

      {/* ── Sticky action bar ── */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 -mx-5 px-5 py-3 mb-7 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-xs font-medium text-slate-300 truncate">{result.url}</span>
          <span className="flex-shrink-0 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/50 px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
            ✓ Done
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton result={result} />
          <DownloadButton result={result} />
          <button onClick={onReset} className="btn-ghost text-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
            </svg>
            New analysis
          </button>
        </div>
      </div>

      <div className="space-y-5">

        {/* ── Row 1: Overview ── */}
        <OverviewCard overview={result.overview} url={result.url} fetchedAt={result.fetchedAt} />

        {/* ── Row 2: Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="SEO Score"    value={seoScore} suffix="/100"
            valueClass={scoreColor(seoScore)}
            sub={seoScore >= 80 ? "Good" : seoScore >= 50 ? "Needs work" : "Critical"} />
          <StatCard label="UX Score"     value={uxScore}  suffix="/100"
            valueClass={scoreColor(uxScore)}
            sub={uxScore >= 70 ? "Good" : uxScore >= 40 ? "Needs work" : "Weak"} />
          <StatCard label="Technologies" value={result.techStack.length}
            sub={result.techStack.length > 0 ? "detected" : "none found"} />
          <StatCard label="Issues Found" value={issueCount}
            valueClass={issueCount === 0 ? "text-emerald-400" : issueCount <= 3 ? "text-amber-400" : "text-rose-400"}
            sub={issueCount === 0 ? "All clear" : `${issueCount} to fix`} />
        </div>

        {/* ── Row 3: SEO + Tech + Conversion ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <SeoAuditCard seoChecks={result.seoChecks} />
          <div className="flex flex-col gap-5">
            <TechStackCard techStack={result.techStack} />
            <ConversionCard ux={result.ux} />
          </div>
        </div>

        {/* ── Row 4: Page Stats (full width) ── */}
        {result.pageStats && <PageStatsCard pageStats={result.pageStats} />}

        {/* ── Row 5: Weak Points + Recommendations ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <WeakPointsCard weakPoints={result.weakPoints} />
          <RecommendationsCard recommendations={result.recommendations} />
        </div>

      </div>
    </div>
  );
}
