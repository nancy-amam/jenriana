"use client";

/**
 * Compact loader for admin route transitions and in-content loading.
 * Uses pulse effect so the sidebar/nav stay visible.
 */
export default function AdminContentLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[200px] py-12 bg-white border border-black/10 rounded-lg"
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
