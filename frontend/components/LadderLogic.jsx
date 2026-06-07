"use client";

import { motion } from "framer-motion";
import { SEQUENCE } from "@/lib/data";

// Build a teaching rung for a given step: safety + transition + interlock
// contacts in series energising the step's output coil(s).
function rungFor(idx) {
  const s = SEQUENCE[idx];
  const prev = idx > 0 ? SEQUENCE[idx - 1] : null;
  const transition =
    idx === 0
      ? { sym: "S1", nc: false, label: "Start" }
      : prev.sensor
      ? { sym: prev.sensor, nc: false, label: "prev done" }
      : { sym: "T", nc: false, label: "timer" };

  const contacts = [
    { sym: "S4", nc: true, label: "E-Stop" },
    { sym: "S3", nc: false, label: "Auto" },
    transition,
  ];
  if (s.check) contacts.push({ sym: s.check, nc: false, label: "interlock" });
  const coils = s.coils && s.coils.length ? s.coils : ["(internal)"];
  return { contacts, coils, step: s };
}

export default function LadderLogic({ seq }) {
  const { i } = seq;
  const rung = rungFor(i);

  return (
    <div className="rounded-xl border border-ink/15 bg-white p-5">
      {/* Active rung — large, with animated power flow */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="chip border-ink bg-ink text-paper">
            Rung {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm text-ink/60">{rung.step.title}</span>
        </div>

        <div className="relative overflow-x-auto rounded-lg border border-ink/10 bg-paper p-5">
          <div className="flex min-w-max items-center">
            {/* left power rail */}
            <div className="relative h-20 w-1 rounded bg-ink">
              <motion.span
                className="absolute -left-[3px] h-2.5 w-2.5 rounded-full bg-ink"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* series contacts */}
            {rung.contacts.map((c, k) => (
              <div key={k} className="flex items-center">
                <Wire energized />
                <Contact sym={c.sym} nc={c.nc} label={c.label} energized />
              </div>
            ))}

            <Wire energized />

            {/* coils */}
            <div className="flex flex-col gap-2">
              {rung.coils.map((coil, k) => (
                <div key={k} className="flex items-center">
                  <Wire energized short />
                  <Coil sym={coil} energized={coil !== "(internal)"} />
                </div>
              ))}
            </div>

            {/* right rail */}
            <div className="ml-2 h-20 w-1 rounded bg-ink" />
          </div>
        </div>

        <p className="mt-3 text-sm text-ink/60">
          Read left→right: power flows through the closed contacts (safety + the
          previous step&apos;s confirmation{rung.contacts.length > 3 ? " + interlock" : ""})
          and energises{" "}
          <span className="font-mono text-ink">
            {rung.coils.join(", ")}
          </span>
          . That output bit drives the solenoid → the cylinder moves → its reed
          sensor reports back, satisfying the <em>next</em> rung. That is how
          ladder logic becomes real motion.
        </p>
      </div>

      {/* Whole program — compact, active rung highlighted */}
      <details className="group" open>
        <summary className="mb-2 cursor-pointer list-none">
          <span className="eyebrow">Full ladder program · click a rung to jump</span>
        </summary>
        <div className="grid gap-1">
          {SEQUENCE.map((s, idx) => {
            const r = rungFor(idx);
            const active = idx === i;
            return (
              <button
                key={s.n}
                onClick={() => seq.setI(idx)}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-left font-mono text-[11px] transition-colors ${
                  active ? "bg-ink text-paper" : "hover:bg-ink/5"
                }`}
              >
                <span className="w-6 opacity-60">{String(idx + 1).padStart(2, "0")}</span>
                <span className="flex-1 truncate">
                  {r.contacts.map((c) => `${c.nc ? "/" : ""}${c.sym}`).join(" · ")}
                  {"  →  "}
                  <span className="font-semibold">{r.coils.join(", ")}</span>
                </span>
              </button>
            );
          })}
        </div>
      </details>
    </div>
  );
}

function Wire({ energized, short }) {
  return (
    <div
      className={`h-0.5 ${short ? "w-5" : "w-8"} ${
        energized ? "bg-ink" : "bg-ink/20"
      }`}
    />
  );
}

function Contact({ sym, nc, label, energized }) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 font-mono text-[10px] text-ink/60">{sym}</span>
      <div className="flex items-center">
        <span className={`h-7 w-1 ${energized ? "bg-ink" : "bg-ink/30"}`} />
        <span className="mx-0.5 font-mono text-sm text-ink">{nc ? "/" : ""}</span>
        <span className={`h-7 w-1 ${energized ? "bg-ink" : "bg-ink/30"}`} />
      </div>
      <span className="mt-1 text-[9px] text-ink/40">{label}</span>
    </div>
  );
}

function Coil({ sym, energized }) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 font-mono text-[10px] text-ink/60">{sym}</span>
      <motion.div
        animate={energized ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 0.6, repeat: Infinity }}
        className={`grid h-9 w-9 place-items-center rounded-full border-2 ${
          energized ? "border-ink bg-ink text-paper" : "border-ink/30 text-ink/30"
        }`}
      >
        <span className="text-lg leading-none">◯</span>
      </motion.div>
      <span className="mt-1 text-[9px] text-ink/40">coil</span>
    </div>
  );
}
