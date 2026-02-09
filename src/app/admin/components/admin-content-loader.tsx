"use client";

import { Loader2 } from "lucide-react";

/**
 * Compact loader for admin route transitions and in-content loading.
 * Renders only in the main content area so the sidebar/nav stay visible.
 */
export default function AdminContentLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] py-12 bg-[#f1f1f1] rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-slate-500" aria-hidden />
      <p className="mt-3 text-sm text-slate-500">Loading...</p>
    </div>
  );
}
