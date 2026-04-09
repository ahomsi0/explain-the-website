import { useEffect, useState } from "react";

const steps = [
  { label: "Fetching page HTML",          delay: 0    },
  { label: "Detecting tech stack",        delay: 700  },
  { label: "Running SEO audit",          delay: 1400 },
  { label: "Analysing conversion signals", delay: 2100 },
  { label: "Generating recommendations", delay: 2800 },
];

export function LoadingSpinner({ url }: { url: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timers = steps.map((s, i) => setTimeout(() => setActive(i), s.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-8">
      {/* Spinner */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin-slow" />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-zinc-200">Analyzing</p>
        <p className="text-xs text-zinc-600 mt-1 max-w-xs truncate">{url}</p>
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
        {steps.map((step, i) => {
          const done = i < active, current = i === active;
          return (
            <div key={step.label} className="flex items-center gap-2.5">
              <span className={`text-xs transition-colors ${
                done ? "text-emerald-500" : current ? "text-violet-400" : "text-zinc-700"
              }`}>
                {done ? "✓" : current ? "›" : "·"}
              </span>
              <span className={`transition-colors ${
                done ? "text-zinc-600" : current ? "text-zinc-300" : "text-zinc-700"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
