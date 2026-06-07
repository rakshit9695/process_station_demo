"use client";

import { motion } from "framer-motion";
import { ACTUATORS } from "@/lib/data";
import { activeIO } from "@/lib/sim";

export default function ElectroPneumaticDiagram({ seq }) {
  const { step, states } = seq;
  const { coils } = activeIO(step);

  return (
    <div className="rounded-xl border border-ink/15 bg-white p-5">
      {/* Air preparation rail */}
      <div className="mb-5 flex items-center gap-3 rounded-lg border border-ink/15 bg-paper p-3">
        <Node label="Compressor" sub="6–8 bar" />
        <Flow />
        <Node label="FRL · 0Z" sub="filter·reg·lube" />
        <Flow />
        <Gauge ok />
        <Flow />
        <div className="ml-auto flex items-center gap-2">
          <span className="eyebrow">Supply rail</span>
          <div className="relative h-2 w-24 overflow-hidden rounded-full bg-ink/10">
            <div className="absolute inset-0 animate-marquee bg-[repeating-linear-gradient(90deg,#0a0a0a_0_6px,transparent_6px_12px)] opacity-40" />
          </div>
        </div>
      </div>

      {/* Actuator + valve grid */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ACTUATORS.map((a) => (
          <ActuatorBlock
            key={a.id}
            a={a}
            state={states[a.id]}
            extendOn={coils.has(a.extend)}
            retractOn={a.retract ? coils.has(a.retract) : false}
          />
        ))}
      </div>
    </div>
  );
}

function ActuatorBlock({ a, state, extendOn, retractOn }) {
  const extended = state > 0;
  const active = extendOn || retractOn;
  const isMotor = a.kind === "motor";
  const isVac = a.kind === "vacuum";

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        active ? "border-ink bg-ink/[0.03]" : "border-ink/15"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="font-mono text-sm font-semibold">{a.id}</span>
          <span className="ml-2 text-[11px] text-ink/55">{a.name}</span>
        </div>
        {active && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-2 w-2 rounded-full bg-ink"
          />
        )}
      </div>

      {/* 5/2 valve solenoids */}
      <div className="mb-2 flex items-center gap-2">
        <Solenoid label={a.extend} on={extendOn} />
        <div className="h-px flex-1 bg-ink/15" />
        <span className="font-mono text-[9px] text-ink/40">5/2 DCV</span>
        <div className="h-px flex-1 bg-ink/15" />
        {a.retract ? (
          <Solenoid label={a.retract} on={retractOn} />
        ) : (
          <span className="w-12" />
        )}
      </div>

      {/* device visual */}
      {isMotor ? (
        <MotorVisual on={extended} />
      ) : isVac ? (
        <VacuumVisual on={extended} />
      ) : (
        <CylinderVisual extended={extended} vertical={a.kind === "linearV"} />
      )}

      {/* end sensors */}
      <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
        {a.sRet ? (
          <Led label={a.sRet} on={!extended} />
        ) : (
          <span />
        )}
        {a.sExt && <Led label={a.sExt} on={extended} />}
      </div>
    </div>
  );
}

function CylinderVisual({ extended, vertical }) {
  return (
    <svg viewBox="0 0 200 56" className="w-full">
      {/* barrel */}
      <rect x="20" y="16" width="120" height="24" rx="3" fill="none" stroke="#0a0a0a" strokeOpacity="0.5" />
      {/* piston */}
      <motion.rect
        y="18"
        width="10"
        height="20"
        fill="#0a0a0a"
        initial={false}
        animate={{ x: extended ? 116 : 24 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
      {/* rod */}
      <motion.rect
        y="26"
        height="4"
        fill="#0a0a0a"
        fillOpacity="0.6"
        initial={false}
        animate={{ x: extended ? 126 : 34, width: extended ? 60 : 6 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
      {/* tool tip */}
      <motion.circle
        cy="28"
        r="4"
        fill="#0a0a0a"
        initial={false}
        animate={{ cx: extended ? 188 : 42 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
      <text x="20" y="52" className="fill-ink/40 font-mono" style={{ fontSize: 9 }}>
        {extended ? (vertical ? "down / extended" : "extended") : "home / retracted"}
      </text>
    </svg>
  );
}

function MotorVisual({ on }) {
  return (
    <svg viewBox="0 0 200 56" className="w-full">
      <rect x="70" y="12" width="60" height="22" rx="3" fill="none" stroke="#0a0a0a" strokeOpacity="0.5" />
      <line x1="100" y1="34" x2="100" y2="48" stroke="#0a0a0a" strokeOpacity="0.6" />
      <motion.g
        style={{ originX: "100px", originY: "22px" }}
        animate={on ? { rotate: 360 } : { rotate: 0 }}
        transition={on ? { repeat: Infinity, ease: "linear", duration: 0.4 } : {}}
      >
        <line x1="92" y1="22" x2="108" y2="22" stroke="#0a0a0a" strokeWidth="2" />
        <line x1="100" y1="14" x2="100" y2="30" stroke="#0a0a0a" strokeWidth="2" />
      </motion.g>
      <polygon points="96,48 104,48 100,54" fill="#0a0a0a" />
      <text x="6" y="50" className="fill-ink/40 font-mono" style={{ fontSize: 9 }}>
        {on ? "drill spinning" : "stopped"}
      </text>
    </svg>
  );
}

function VacuumVisual({ on }) {
  return (
    <svg viewBox="0 0 200 56" className="w-full">
      <line x1="100" y1="6" x2="100" y2="28" stroke="#0a0a0a" strokeOpacity="0.6" />
      <path d="M86 28 Q100 44 114 28 Z" fill="none" stroke="#0a0a0a" strokeOpacity="0.6" />
      {on && (
        <>
          <motion.circle
            cx="100" cy="40" r="6" fill="none" stroke="#0a0a0a"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <rect x="90" y="40" width="20" height="10" rx="2" fill="#0a0a0a" />
        </>
      )}
      <text x="6" y="52" className="fill-ink/40 font-mono" style={{ fontSize: 9 }}>
        {on ? "vacuum ON · gripped" : "released"}
      </text>
    </svg>
  );
}

function Solenoid({ label, on }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className={`grid h-5 w-7 place-items-center rounded-sm border text-[8px] ${
          on ? "border-ink bg-ink text-paper" : "border-ink/30 text-ink/40"
        }`}
      >
        {on ? "⚡" : ""}
      </div>
      <span className="font-mono text-[10px] text-ink/60">{label}</span>
    </div>
  );
}

function Led({ label, on }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          on ? "bg-ink" : "bg-ink/20"
        }`}
      />
      <span className={on ? "text-ink" : "text-ink/40"}>{label}</span>
    </span>
  );
}

function Node({ label, sub }) {
  return (
    <div className="rounded-md border border-ink/20 bg-white px-3 py-1.5 text-center">
      <div className="text-xs font-semibold">{label}</div>
      <div className="font-mono text-[9px] text-ink/45">{sub}</div>
    </div>
  );
}

function Flow() {
  return (
    <div className="relative h-1 w-6 overflow-hidden rounded-full bg-ink/10">
      <div className="absolute inset-0 animate-marquee bg-[repeating-linear-gradient(90deg,#0a0a0a_0_4px,transparent_4px_8px)] opacity-40" />
    </div>
  );
}

function Gauge({ ok }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-ink/20 bg-white px-2 py-1">
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="9" fill="none" stroke="#0a0a0a" strokeOpacity="0.4" />
        <line x1="11" y1="11" x2="16" y2="6" stroke="#0a0a0a" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="1.5" fill="#0a0a0a" />
      </svg>
      <span className="font-mono text-[9px] text-ink/55">{ok ? ">4 bar" : "low"}</span>
    </div>
  );
}
