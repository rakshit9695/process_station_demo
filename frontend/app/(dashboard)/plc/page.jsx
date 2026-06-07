"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell, PageHeader, Section } from "@/components/ui";
import Quiz from "@/components/Quiz";
import Transport from "@/components/Transport";
import PLCPanel from "@/components/PLCPanel";
import LadderLogic from "@/components/LadderLogic";
import { useSequencer, activeIO } from "@/lib/sim";
import { IO_OUTPUTS } from "@/lib/data";

const PLC3D = dynamic(() => import("@/components/PLC3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-paper/50">
      <span className="animate-pulse font-mono text-sm">rendering 3D model…</span>
    </div>
  ),
});

// map output symbol -> address (e.g. 1Y1 -> Q0.0)
const SYM_ADDR = Object.fromEntries(IO_OUTPUTS.map(([a, s]) => [s, a]));

export default function PLCPage() {
  const seq = useSequencer();
  const { step } = seq;
  const { coils } = activeIO(step);

  // inputs lit this step
  const inputsOn = new Set();
  if (step.sensor) inputsOn.add(step.sensor);
  if (step.check) inputsOn.add(step.check);
  inputsOn.add("S3"); // auto mode held on while cycling

  // outputs lit this step
  const outputsOn = new Set(coils);

  // Q0.x byte for the 3D LED strip
  const qbits = [...Array(8)].map((_, b) =>
    [...coils].some((c) => SYM_ADDR[c] === `Q0.${b}`)
  );

  return (
    <PageShell>
      <PageHeader
        index="05"
        title="PLC & Ladder Logic — Siemens S7-1200"
        lead="The same cycle, now from the controller's seat. Step through it and watch three views stay in lockstep: the ladder rung that fires, the S7-1200 I/O that changes, and the 3D unit lighting its outputs. This is how code becomes motion."
      />

      <Transport seq={seq} />

      {/* 3D + narration */}
      <div className="mb-10 grid gap-4 lg:grid-cols-2">
        <div className="h-[360px] overflow-hidden rounded-xl border border-ink/20 bg-ink">
          <PLC3D qbits={qbits} run={true} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={seq.i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="card flex flex-col p-5"
          >
            <p className="eyebrow">Signal chain · this step</p>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>

            <div className="mt-4 flex-1 space-y-2">
              <ChainRow k="1 · Ladder" v={`Rung ${step.n} solves true`} />
              <ChainRow
                k="2 · PLC output"
                v={
                  [...coils].length
                    ? [...coils].map((c) => `${SYM_ADDR[c] || ""} (${c})`).join(", ")
                    : "no coil (internal/timed)"
                }
              />
              <ChainRow k="3 · Solenoid → valve" v="spool shifts, air re-routes" />
              <ChainRow k="4 · Actuator" v={step.desc} />
              <ChainRow
                k="5 · Feedback (input)"
                v={step.sensor ? `${step.sensor} → ${step.input}` : "timed transition"}
              />
            </div>

            <div className="mt-4 rounded-md bg-ink px-3 py-2 font-mono text-xs text-paper">
              {qbits.map((b, i) => `Q0.${i}=${b ? 1 : 0}`).join("  ")}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ladder + Panel side by side */}
      <Section kicker="Side by side" title="Ladder logic ⇄ PLC I/O">
        <p className="mb-4 max-w-2xl text-ink/60">
          On the left, the rung executing right now. On the right, the S7-1200
          face — inputs (I) confirm positions, outputs (Q) drive the solenoids.
          Use the transport (or click a rung) to see the program counter move and
          the lamps follow.
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          <LadderLogic seq={seq} />
          <PLCPanel inputsOn={inputsOn} outputsOn={outputsOn} run={true} />
        </div>
      </Section>

      <Quiz page="plc" />
    </PageShell>
  );
}

function ChainRow({ k, v }) {
  return (
    <div className="flex gap-3 border-b border-ink/5 pb-2 text-sm last:border-0">
      <span className="w-28 shrink-0 font-mono text-[11px] text-ink/45">{k}</span>
      <span className="text-ink/80">{v}</span>
    </div>
  );
}
