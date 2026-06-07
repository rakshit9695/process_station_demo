"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PageShell, PageHeader, Section } from "@/components/ui";
import Quiz from "@/components/Quiz";
import Transport from "@/components/Transport";
import StepDisplacementChart from "@/components/StepDisplacementChart";
import ElectroPneumaticDiagram from "@/components/ElectroPneumaticDiagram";
import { useSequencer, activeIO } from "@/lib/sim";

export default function SimulationPage() {
  const seq = useSequencer();
  const { step } = seq;
  const { coils } = activeIO(step);

  return (
    <PageShell>
      <PageHeader
        index="03"
        title="Step Displacement & Electro-Pneumatic Simulation"
        lead="One transport drives both diagrams at once. Watch the displacement chart trace each actuator's position while the pneumatic schematic shows the very same air, valves and motion — simplified to block level, explained from first principles."
      />

      <Transport seq={seq} />

      {/* current step narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={seq.i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mb-10 grid gap-4 lg:grid-cols-3"
        >
          <div className="card-dark p-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-paper font-mono text-sm font-bold text-ink">
                {step.n}
              </span>
              <div>
                <p className="font-mono text-[11px] tracking-widest text-paper/50">
                  {step.phase.toUpperCase()}
                </p>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-paper/80">{step.desc}</p>
            <p className="mt-3 border-l-2 border-paper/30 pl-3 text-sm text-paper/65">
              <span className="font-semibold text-paper/80">Physics: </span>
              {step.physics}
            </p>
          </div>

          <div className="card p-5">
            <p className="eyebrow mb-2">PLC signals this step</p>
            <Row label="Energised coils (Q)">
              {coils.size ? (
                [...coils].map((c) => (
                  <span key={c} className="chip border-ink bg-ink text-paper">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-sm text-ink/40">— none —</span>
              )}
            </Row>
            <Row label="Confirming sensor (I)">
              {step.sensor ? (
                <span className="chip">{step.sensor}</span>
              ) : (
                <span className="text-sm text-ink/40">— timed —</span>
              )}
              <span className="font-mono text-xs text-ink/40">{step.input}</span>
            </Row>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* STEP DISPLACEMENT */}
      <Section kicker="Diagram A" title="Step-displacement diagram">
        <p className="mb-4 max-w-2xl text-ink/60">
          Each row is one actuator; the trace rises to <strong>EXT/ON</strong> and
          falls to <strong>RET/OFF</strong>. The playhead marks the current step.
          A step only advances when the end-position sensor confirms the move —
          that&apos;s closed-loop sequencing.
        </p>
        <StepDisplacementChart seq={seq} />
      </Section>

      {/* ELECTRO-PNEUMATIC */}
      <Section kicker="Diagram B" title="Electro-pneumatic schematic (simplified)">
        <p className="mb-4 max-w-2xl text-ink/60">
          Air is prepared (compressor → FRL → &gt;4 bar), then distributed to six{" "}
          <strong>5/2 double-solenoid valves</strong>, each driving one actuator.
          The lit ⚡ solenoid is the coil the PLC energised this step; the cylinder
          animates to the position its reed sensor will confirm.
        </p>
        <ElectroPneumaticDiagram seq={seq} />
      </Section>

      <Quiz page="simulation" />
    </PageShell>
  );
}

function Row({ label, children }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink/50">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
