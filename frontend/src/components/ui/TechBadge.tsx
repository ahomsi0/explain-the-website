import type { TechCategory } from "../../types/analysis";

export function TechBadge({ name, confidence }: { name: string; category: TechCategory; confidence: string }) {
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/40"
      title={`Confidence: ${confidence}`}
    >
      {name}
      {confidence === "low" && <span className="ml-1 opacity-40 text-[10px]">?</span>}
    </span>
  );
}
