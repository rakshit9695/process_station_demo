"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useStore } from "@/lib/store";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // zustand/persist hydrates on the client; wait one tick before guarding.
    if (user === null) {
      const t = setTimeout(() => {
        if (!useStore.getState().user) router.replace("/login");
        else setReady(true);
      }, 50);
      return () => clearTimeout(t);
    }
    setReady(true);
  }, [user, router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-ink/40">
        <div className="animate-pulse font-mono text-sm">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
