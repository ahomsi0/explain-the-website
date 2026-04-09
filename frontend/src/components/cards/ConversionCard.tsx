import type { UXResult } from "../../types/analysis";

function Signal({ label, present, detail }: { label: string; present: boolean; detail: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-700/40 last:border-0">
      <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
        present ? "bg-emerald-900/50 text-emerald-400" : "bg-rose-900/50 text-rose-400"
      }`}>
        {present
          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        }
      </span>
      <span className="text-sm font-medium text-slate-300 w-36 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-500 truncate">{detail}</span>
    </div>
  );
}

export function ConversionCard({ ux }: { ux: UXResult }) {
  const signals = [ux.hasCTA, ux.hasForms, ux.hasSocialProof, ux.hasTrustSignals, ux.hasContactInfo, ux.mobileReady];
  const score   = Math.round((signals.filter(Boolean).length / signals.length) * 100);
  const scoreColor = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-rose-400";
  const trackColor = score >= 70 ? "bg-emerald-500"   : score >= 40 ? "bg-amber-500"   : "bg-rose-500";

  return (
    <div className="card card-accent-emerald">
      <div className="card-header">
        <span className="card-icon bg-emerald-950/60 text-emerald-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </span>
        <span className="card-title">Conversion / UX</span>
        <span className={`ml-auto text-sm font-bold ${scoreColor}`}>
          {score}<span className="text-xs font-normal text-slate-600">/100</span>
        </span>
      </div>

      {/* Compact score bar */}
      <div className="score-track mb-4">
        <div className={`h-full rounded-full transition-all duration-700 ${trackColor}`} style={{ width: `${score}%` }} />
      </div>

      <Signal label="Call-to-Action"    present={ux.hasCTA}         detail={ux.hasCTA ? `${ux.ctaCount} CTAs detected` : "None found"} />
      <Signal label="Lead Capture"      present={ux.hasForms}        detail={ux.hasForms ? `${ux.formCount} form(s)` : "No forms"} />
      <Signal label="Social Proof"      present={ux.hasSocialProof}  detail={ux.hasSocialProof ? "Reviews / ratings detected" : "None found"} />
      <Signal label="Trust Signals"     present={ux.hasTrustSignals} detail={ux.hasTrustSignals ? "Guarantee / secure detected" : "None found"} />
      <Signal label="Contact Info"      present={ux.hasContactInfo}  detail={ux.hasContactInfo ? "Phone / email present" : "None found"} />
      <Signal label="Mobile Ready"      present={ux.mobileReady}     detail={ux.mobileReady ? "Viewport tag present" : "Missing viewport"} />
    </div>
  );
}
