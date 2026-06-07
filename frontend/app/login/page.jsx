"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email);

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setErr("");
    try {
      await api.login(name.trim(), email.trim());
    } catch (e) {
      // Don't block learning if the backend is unreachable — record locally.
      console.warn("Backend login failed, continuing locally:", e.message);
      setErr("Saved locally (backend offline). You can still continue.");
    }
    setUser({ name: name.trim(), email: email.trim() });
    setBusy(false);
    router.push("/introduction");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: brand / animated machine motif */}
      <div className="relative hidden overflow-hidden bg-ink text-paper lg:block grid-bg">
        <div className="absolute inset-0 dots-bg opacity-30" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-mono text-sm tracking-[0.3em]">SIEMENS · MMS</span>
          </div>

          <div>
            <RotaryMotif />
          </div>

          <div className="max-w-md">
            <p className="eyebrow text-paper/60">Mechatronics &amp; Industrial Automation</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">
              Process Station
            </h1>
            <p className="mt-4 text-paper/70">
              An interactive teaching beta — pneumatics, mechanics, sensing and
              PLC control, simulated end-to-end. The companion to our AR/VR build.
            </p>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmit}
          className="w-full max-w-sm"
        >
          <p className="eyebrow">Sign in</p>
          <h2 className="mt-2 text-2xl font-semibold">Welcome, learner</h2>
          <p className="mt-1 text-sm text-ink/60">
            We&apos;ll save your name &amp; email to track your quiz results.
          </p>

          <label className="mt-8 block">
            <span className="text-xs font-medium uppercase tracking-wide text-ink/60">
              Full name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className="mt-1.5 w-full rounded-md border border-ink/20 bg-white px-3 py-2.5
                         text-sm outline-none focus:border-ink"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium uppercase tracking-wide text-ink/60">
              Email
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              type="email"
              className="mt-1.5 w-full rounded-md border border-ink/20 bg-white px-3 py-2.5
                         text-sm outline-none focus:border-ink"
            />
          </label>

          {err && <p className="mt-3 text-xs text-ink/60">{err}</p>}

          <button
            type="submit"
            disabled={!valid || busy}
            className="btn-primary mt-6 w-full"
          >
            {busy ? "Entering…" : "Enter dashboard →"}
          </button>

          <p className="mt-6 text-center font-mono text-[11px] text-ink/40">
            TD-MMS4-04-01-02-A · Process Station MMS04
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="grid h-9 w-9 place-items-center rounded border border-paper/30">
      <div className="h-4 w-4 rounded-sm bg-paper" />
    </div>
  );
}

function RotaryMotif() {
  return (
    <div className="relative mx-auto h-56 w-56">
      <div className="absolute inset-0 rounded-full border border-paper/20 animate-[spin-slow_8s_linear_infinite]" />
      <div className="absolute inset-6 rounded-full border border-dashed border-paper/30" />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/80"
          style={{
            transform: `rotate(${i * 60}deg) translateY(-96px)`,
          }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-paper/60">
        60°
      </div>
    </div>
  );
}
