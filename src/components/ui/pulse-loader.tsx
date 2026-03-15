"use client";

export function PulseLoader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[200px] py-12 bg-white border border-black/10 rounded-lg ${className}`}
      aria-busy
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

export function PulseCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
          </div>
          <div className="mt-3 h-8 w-28 rounded bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function PulseTableRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-gray-100">
          <div className="h-4 flex-1 max-w-[120px] rounded bg-slate-200 animate-pulse" />
          <div className="h-4 flex-1 max-w-[180px] rounded bg-slate-200 animate-pulse" />
          <div className="h-4 flex-1 max-w-[100px] rounded bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
