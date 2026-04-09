import type { TechItem, TechCategory } from "../../types/analysis";
import { TechBadge } from "../ui/TechBadge";

const categoryOrder: TechCategory[] = ["cms", "ecommerce", "builder", "framework", "analytics", "cdn"];
const categoryLabels: Record<TechCategory, string> = {
  cms:       "CMS",
  ecommerce: "E-commerce",
  builder:   "Builder",
  framework: "Framework",
  analytics: "Analytics",
  cdn:       "CDN",
};

export function TechStackCard({ techStack }: { techStack: TechItem[] }) {
  const groups: Partial<Record<TechCategory, TechItem[]>> = {};
  for (const item of [...techStack].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category))) {
    (groups[item.category] ??= []).push(item);
  }
  const keys = categoryOrder.filter((c) => groups[c]);

  return (
    <div className="card card-accent-indigo">
      <div className="card-header">
        <span className="card-icon bg-indigo-950/60 text-indigo-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </span>
        <span className="card-title">Tech Stack</span>
        {techStack.length > 0 && (
          <span className="ml-auto text-xs text-slate-500">{techStack.length} detected</span>
        )}
      </div>

      {techStack.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">No technologies detected.</p>
      ) : (
        /* Table-style: category label left, badges right — compact and proportionate */
        <div className="divide-y divide-slate-700/40">
          {keys.map((cat) => (
            <div key={cat} className="flex items-start gap-4 py-2.5">
              <span className="flex-shrink-0 w-20 text-xs font-semibold text-slate-500 pt-1">
                {categoryLabels[cat]}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {groups[cat]!.map((t) => <TechBadge key={t.name} {...t} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
