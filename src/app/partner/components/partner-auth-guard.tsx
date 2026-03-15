"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok" | "redirect">("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/partner/me", { credentials: "include" });
        if (cancelled) return;
        if (res.status === 403) {
          setStatus("redirect");
          router.replace("/partner/auth/login");
          return;
        }
        if (res.ok) {
          setStatus("ok");
          return;
        }
        setStatus("redirect");
        router.replace("/partner/auth/login");
      } catch {
        if (!cancelled) {
          setStatus("redirect");
          router.replace("/partner/auth/login");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#fafafa]">
        <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
        <p className="mt-3 text-sm text-slate-500">Checking access…</p>
      </div>
    );
  }

  if (status === "redirect") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#fafafa]">
        <p className="text-sm text-slate-500">Redirecting to login…</p>
      </div>
    );
  }

  return <>{children}</>;
}
