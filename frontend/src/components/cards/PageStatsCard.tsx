import { Separator } from "@/components/ui/separator";
import type { PageStats } from "../../types/analysis";

function Stat({ label, value, sub, valueClass = "text-zinc-100" }: {
  label: string; value: string | number; sub?: string; valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <span className={`text-lg font-semibold leading-none ${valueClass}`}>{value}</span>
      {sub && <span className="text-[11px] text-zinc-600 whitespace-nowrap">{sub}</span>}
    </div>
  );
}

export function PageStatsCard({ pageStats }: { pageStats: PageStats }) {
  const readMins   = Math.max(1, Math.round(pageStats.wordCount / 200));
  const totalLinks = pageStats.internalLinks + pageStats.externalLinks;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider mb-4">Page Stats</p>

      <div className="flex items-start gap-0 overflow-x-auto">
        <Stat label="Words"    value={pageStats.wordCount.toLocaleString()} sub={`~${readMins} min read`} />
        <Separator orientation="vertical" className="mx-4 h-10 self-center bg-zinc-800 shrink-0" />
        <Stat label="Images"   value={pageStats.imageCount} />
        <Separator orientation="vertical" className="mx-4 h-10 self-center bg-zinc-800 shrink-0" />
        <Stat label="Scripts"  value={pageStats.scriptCount}
          valueClass={pageStats.scriptCount > 15 ? "text-amber-400" : "text-zinc-100"}
          sub={pageStats.scriptCount > 15 ? "high load" : "lean"} />
        <Separator orientation="vertical" className="mx-4 h-10 self-center bg-zinc-800 shrink-0" />
        <Stat label="Links"    value={totalLinks}
          sub={`${pageStats.internalLinks} in · ${pageStats.externalLinks} ext`} />
        <Separator orientation="vertical" className="mx-4 h-10 self-center bg-zinc-800 shrink-0" />
        <Stat label="H1"       value={pageStats.h1Count}
          valueClass={pageStats.h1Count === 1 ? "text-emerald-400" : pageStats.h1Count === 0 ? "text-red-400" : "text-amber-400"}
          sub={pageStats.h1Count === 1 ? "ideal" : pageStats.h1Count === 0 ? "missing" : "too many"} />
        <Separator orientation="vertical" className="mx-4 h-10 self-center bg-zinc-800 shrink-0" />
        <Stat label="Headings" value={pageStats.h1Count + pageStats.h2Count + pageStats.h3Count}
          sub={`H2:${pageStats.h2Count} · H3:${pageStats.h3Count}`} />
      </div>
    </div>
  );
}
