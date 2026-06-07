"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export const NAV = [
  { href: "/introduction", n: "01", label: "Introduction", sub: "What it is" },
  { href: "/physics", n: "02", label: "Physics", sub: "First principles" },
  { href: "/simulation", n: "03", label: "Step & Pneumatic", sub: "Simulations" },
  { href: "/sfc", n: "04", label: "Function Chart", sub: "Components" },
  { href: "/plc", n: "05", label: "PLC & Ladder", sub: "S7-1200" },
  { href: "/ar", n: "06", label: "AR Setup", sub: "Beta download" },
  { href: "/results", n: "07", label: "Results", sub: "Your score" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const score = useStore((s) => s.score)();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-white">
      <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-5">
        <div className="grid h-8 w-8 place-items-center rounded border border-ink/20">
          <div className="h-3.5 w-3.5 rounded-sm bg-ink" />
        </div>
        <div className="leading-tight">
          <div className="font-mono text-[11px] tracking-[0.25em] text-ink/60">
            SIEMENS · MMS
          </div>
          <div className="text-sm font-semibold">Process Station</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                active ? "bg-ink text-paper" : "text-ink/80 hover:bg-ink/5"
              }`}
            >
              <span
                className={`font-mono text-[11px] ${
                  active ? "text-paper/60" : "text-ink/40"
                }`}
              >
                {item.n}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium leading-none">
                  {item.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    active ? "text-paper/60" : "text-ink/40"
                  }`}
                >
                  {item.sub}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Score</span>
          <span className="font-mono text-sm">
            {score.correct}/{score.total || 0}
          </span>
        </div>
        <div className="mb-3 rounded-md bg-ink/5 px-3 py-2">
          <div className="truncate text-sm font-medium">{user?.name || "—"}</div>
          <div className="truncate text-[11px] text-ink/50">{user?.email}</div>
        </div>
        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="btn-ghost w-full text-xs"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
