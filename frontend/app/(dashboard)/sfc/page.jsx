"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell, PageHeader, Section } from "@/components/ui";
import Quiz from "@/components/Quiz";
import { SFC_CARDS } from "@/lib/sfc";
import { SEQUENCE, PHASES } from "@/lib/data";

export default function SFCPage() {
  const [open, setOpen] = useState(null);
  const card = SFC_CARDS.find((c) => c.id === open);

  return (
    <PageShell>
      <PageHeader
        index="04"
        title="Sequential Function Chart"
        lead="The function chart is the formal recipe of the cycle: a chain of steps, each firing actuators and waiting on a transition condition. Below, the cycle as a chart — then every component, with its physics one click away."
      />

      {/* SFC overview chain, grouped by phase */}
      <Section kicker="The chart" title="Steps & transitions">
        <div className="space-y-6">
          {PHASES.map((phase) => {
            const steps = SEQUENCE.filter((s) => s.phase === phase);
            if (!steps.length) return null;
            return (
              <div key={phase}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="chip border-ink bg-ink text-paper">{phase}</span>
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {steps.map((s) => (
                    <motion.div
                      key={s.n}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="w-44 rounded-lg border border-ink/15 bg-white p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="grid h-6 w-6 place-items-center rounded bg-ink font-mono text-[11px] text-paper">
                          {s.n}
                        </span>
                        <span className="font-mono text-[10px] text-ink/40">
                          {s.input}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium leading-snug">
                        {s.title}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(s.coils || []).map((c) => (
                          <span
                            key={c}
                            className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[9px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-ink/50">
          A transition (the sensor in the corner) must be true before the chart
          moves to the next step — the same closed-loop rule the simulation obeys.
        </p>
      </Section>

      {/* component cards */}
      <Section kicker="Bridging pneumatics · mechanics · electronics" title="The components">
        <p className="mb-6 max-w-2xl text-ink/60">
          Each card is a quick overview — click to open the physics and working
          principle in depth.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SFC_CARDS.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.06 }}
              onClick={() => setOpen(c.id)}
              className="group text-left"
            >
              <div className="card h-full p-4 transition-all hover:border-ink hover:shadow-[4px_4px_0_0_#0a0a0a]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink/45">{c.tag}</span>
                  <span className="chip">{c.group}</span>
                </div>
                <h3 className="mt-2 font-semibold leading-tight">{c.name}</h3>
                <p className="mt-1.5 text-sm text-ink/60">{c.brief}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-ink/70 group-hover:text-ink">
                  Deep dive
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* modal */}
      <AnimatePresence>
        {card && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-ink/20 bg-white"
            >
              <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-ink/10 bg-white px-6 py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink/45">{card.tag}</span>
                    <span className="chip">{card.group}</span>
                  </div>
                  <h3 className="mt-1 text-2xl font-semibold">{card.name}</h3>
                  <p className="mt-1 text-sm text-ink/50">{card.role}</p>
                </div>
                <button
                  onClick={() => setOpen(null)}
                  className="btn-ghost shrink-0 px-3 py-1.5"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-5">
                <div className="mb-4 rounded-lg bg-ink px-4 py-3 font-mono text-sm text-paper">
                  {card.formula}
                </div>
                <div className="space-y-4 leading-relaxed text-ink/80">
                  {card.deep.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Quiz page="sfc" />
    </PageShell>
  );
}
