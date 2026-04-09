export function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4">
      <p className="text-sm font-medium text-zinc-200">Analysis failed</p>
      <p className="text-sm text-zinc-600 max-w-sm text-center leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors border border-zinc-700"
      >
        Try another URL
      </button>
    </div>
  );
}
