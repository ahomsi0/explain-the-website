import { useEffect, useState } from "react";

const steps = [
  { label: "Fetching page HTML",           delay: 0    },
  { label: "Detecting tech stack",         delay: 700  },
  { label: "Running SEO audit",            delay: 1400 },
  { label: "Analysing conversion signals", delay: 2100 },
  { label: "Generating recommendations",  delay: 2800 },
];

export function LoadingSpinner({ url }: { url: string }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = steps.map((s, i) => setTimeout(() => setActiveStep(i), s.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-28 px-4 gap-9">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full bg-slate-800 flex items-center justify-center text-lg">🔬</div>
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-slate-200">Analyzing website…</p>
        <p className="text-sm text-slate-500 mt-1 max-w-sm truncate">{url}</p>
      </div>

      <div className="flex flex-col gap-3 min-w-[240px]">
        {steps.map((step, i) => {
          const done = i < activeStep, current = i === activeStep;
          return (
            <div key={step.label} className="step-item flex items-center gap-3 text-sm" style={{ animationDelay: `${step.delay}ms` }}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 ${
                done ? "bg-emerald-900/60 text-emerald-400" : current ? "bg-violet-900/60 text-violet-400" : "bg-slate-700/60 text-slate-600"
              }`}>
                {done ? "✓" : current ? <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft" /> : "·"}
              </span>
              <span className={`transition-colors duration-300 ${done ? "text-slate-600 line-through" : current ? "text-slate-200 font-medium" : "text-slate-600"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
