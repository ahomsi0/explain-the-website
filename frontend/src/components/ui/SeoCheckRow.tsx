import type { ReactNode } from "react";
import type { SEOCheck, SEOStatus } from "../../types/analysis";

const config: Record<SEOStatus, { icon: ReactNode; iconBg: string }> = {
  pass: {
    iconBg: "bg-emerald-900/50 text-emerald-400",
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
  warning: {
    iconBg: "bg-amber-900/50 text-amber-400",
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  fail: {
    iconBg: "bg-rose-900/50 text-rose-400",
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  },
};

export function SeoCheckRow({ check }: { check: SEOCheck }) {
  const c = config[check.status];
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/40 last:border-0">
      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${c.iconBg}`}>
        {c.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-200">{check.label}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{check.detail}</p>
      </div>
    </div>
  );
}
