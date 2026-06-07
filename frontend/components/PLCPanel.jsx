"use client";

import { motion } from "framer-motion";
import { IO_INPUTS, IO_OUTPUTS } from "@/lib/data";

export default function PLCPanel({ inputsOn, outputsOn, run = true }) {
  return (
    <div className="rounded-xl border border-ink/20 bg-[#ededed] p-4 shadow-inner">
      {/* header strip */}
      <div className="mb-3 flex items-center justify-between rounded-md bg-ink px-4 py-2 text-paper">
        <span className="font-mono text-sm tracking-[0.2em]">SIEMENS · S7-1200</span>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <StatusLed label="RUN" on={run} />
          <StatusLed label="STOP" on={!run} />
          <StatusLed label="ERROR" on={false} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* INPUTS */}
        <div className="rounded-lg bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow">Digital inputs · I</span>
            <span className="font-mono text-[10px] text-ink/40">DI 14 + exp</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {IO_INPUTS.filter((r) => r[0].startsWith("I")).map(([addr, sym, desc]) => (
              <IoRow key={addr} addr={addr} sym={sym} desc={desc} on={inputsOn.has(sym)} />
            ))}
          </div>
          {/* analog */}
          <div className="mt-2 rounded-md border border-ink/10 bg-paper p-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-ink/60">AI0.0 · BP</span>
              <span className="font-mono text-[10px] text-ink/60">~6 bar</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                className="h-full bg-ink"
                initial={{ width: "0%" }}
                animate={{ width: "72%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="rounded-lg bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow">Digital outputs · Q</span>
            <span className="font-mono text-[10px] text-ink/40">DQ → solenoids</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {IO_OUTPUTS.map(([addr, sym, desc]) => (
              <IoRow key={addr} addr={addr} sym={sym} desc={desc} on={outputsOn.has(sym)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IoRow({ addr, sym, desc, on }) {
  return (
    <div
      className={`flex items-center gap-2 rounded px-2 py-1 transition-colors ${
        on ? "bg-ink text-paper" : "bg-transparent"
      }`}
    >
      <motion.span
        animate={{ scale: on ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.4 }}
        className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
          on ? "bg-paper" : "bg-ink/20"
        }`}
      />
      <span className="w-12 shrink-0 font-mono text-[10px]">{addr}</span>
      <span className="w-16 shrink-0 font-mono text-[11px] font-semibold">{sym}</span>
      <span className={`truncate text-[10px] ${on ? "text-paper/70" : "text-ink/45"}`}>
        {desc}
      </span>
    </div>
  );
}

function StatusLed({ label, on }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          on ? "bg-paper" : "bg-paper/25"
        }`}
      />
      {label}
    </span>
  );
}
