"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const user = useStore((s) => s.user);

  useEffect(() => {
    router.replace(user ? "/introduction" : "/login");
  }, [user, router]);

  return (
    <div className="grid min-h-screen place-items-center text-ink/50">
      <div className="animate-pulse font-mono text-sm">Loading…</div>
    </div>
  );
}
