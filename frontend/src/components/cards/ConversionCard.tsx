import type { UXResult } from "../../types/analysis";

function Row({ label, present, detail }: { label: string; present: boolean; detail: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-zinc-800/60 last:border-0">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${present ? "bg-emerald-500" : "bg-zinc-700"}`} />
      <span className="text-xs text-zinc-400 w-28 shrink-0">{label}</span>
      <span className="text-xs text-zinc-600 truncate">{detail}</span>
    </div>
  );
}

export function ConversionCard({ ux }: { ux: UXResult }) {
  const signals = [ux.hasCTA, ux.hasForms, ux.hasSocialProof, ux.hasTrustSignals, ux.hasContactInfo, ux.mobileReady];
  const score   = Math.round((signals.filter(Boolean).length / signals.length) * 100);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Conversion & UX</p>
        <span className={`font-semibold text-sm ${score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400"}`}>
          {score}<span className="text-zinc-600 font-normal text-xs">/100</span>
        </span>
      </div>

      <Row label="Call-to-Action"  present={ux.hasCTA}          detail={ux.hasCTA    ? `${ux.ctaCount} detected`    : "None found"} />
      <Row label="Lead Form"       present={ux.hasForms}         detail={ux.hasForms  ? `${ux.formCount} form(s)`    : "None found"} />
      <Row label="Social Proof"    present={ux.hasSocialProof}   detail={ux.hasSocialProof   ? "Detected" : "None found"} />
      <Row label="Trust Signals"   present={ux.hasTrustSignals}  detail={ux.hasTrustSignals  ? "Detected" : "None found"} />
      <Row label="Contact Info"    present={ux.hasContactInfo}   detail={ux.hasContactInfo   ? "Present"  : "None found"} />
      <Row label="Mobile Ready"    present={ux.mobileReady}      detail={ux.mobileReady      ? "Viewport tag present" : "Missing"} />
    </div>
  );
}
