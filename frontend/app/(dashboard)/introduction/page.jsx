"use client";

import { motion } from "framer-motion";
import { PageShell, PageHeader, Section, Reveal, Stat } from "@/components/ui";
import Quiz from "@/components/Quiz";
import { STATION } from "@/lib/data";

const FLOW = [
  { k: "Infeed", d: "Part arrives from the up-stream station" },
  { k: "Index", d: "Rotary table rotates 60° per step" },
  { k: "Drill", d: "Pneumatic drill machines the part" },
  { k: "Inspect", d: "Photo-sensor verifies the hole" },
  { k: "Pick & Place", d: "Vacuum head lifts the part" },
  { k: "Outfeed", d: "Transfer to the down-stream station" },
];

export default function IntroductionPage() {
  return (
    <PageShell>
      <PageHeader
        index="01"
        title="Introduction"
        lead="The Process Station is one cell in the Siemens MMS modular production line — a hands-on platform for learning mechatronics and industrial automation."
      />

      {/* HERO --------------------------------------------------------------- */}
      <Reveal className="mb-14">
        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          <div className="overflow-hidden rounded-xl border border-ink/15 bg-white lg:col-span-3">
            <div className="relative grid place-items-center bg-paper-soft">
              <div className="pointer-events-none absolute inset-0 dots-bg opacity-40" />
              <img
                src="/img/station.jpeg"
                alt="Siemens MMS04 Process Station"
                className="relative z-10 h-[420px] w-auto max-w-full object-contain p-3"
              />
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 bg-ink px-5 py-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.25em] text-paper/60">
                  MMS04 · {STATION.doc}
                </p>
                <p className="text-base font-semibold text-paper">
                  The physical station you are modelling
                </p>
              </div>
              <span className="hidden font-mono text-[11px] text-paper/50 sm:block">
                rotary index · drill · pick &amp; place
              </span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card h-full p-6">
              <p className="eyebrow">What is the MMS kit?</p>
              <p className="mt-3 text-ink/80">
                The <strong>Modular Mechatronics System (MMS)</strong> is a chain
                of independent stations — distribution, testing, processing,
                handling, sorting — that together emulate a real production line.
                Each station has its own <strong>PLC</strong> and talks to its
                neighbours over I/O networking.
              </p>
              <hr className="hr-dotted my-4" />
              <p className="text-ink/80">
                This <strong>Process Station</strong> is the machining cell: it
                performs a mock <strong>drilling</strong> operation on a part
                carried by a pneumatically-driven{" "}
                <strong>rotary indexing table</strong>, then hands the part to the
                next station with a <strong>pick &amp; place</strong> module.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* STATS -------------------------------------------------------------- */}
      <Section kicker="At a glance" title="Technical envelope">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Model" value={STATION.model} />
          <Stat label="Index" value="60° × 6" />
          <Stat label="Pressure" value={STATION.pressure} />
          <Stat label="I/O" value={STATION.ioVoltage} />
          <Stat label="Mains" value="230 V" />
          <Stat label="Power" value="224 W" />
        </div>
      </Section>

      {/* HIGH-LEVEL FLOW ---------------------------------------------------- */}
      <Section kicker="Before we deep-dive" title="How a part flows through the station">
        <p className="mb-6 max-w-2xl text-ink/60">
          Keep this mental model handy — every later page zooms into one of these
          stages. The whole cycle is a loop: as one part leaves, the next begins.
        </p>

        <div className="card p-6">
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-stretch justify-center gap-2">
              {FLOW.map((s, i) => (
                <div key={s.k} className="flex items-stretch gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex w-28 shrink-0 flex-col rounded-lg border border-ink/15 bg-paper p-3 text-center"
                  >
                    <span className="font-mono text-[11px] text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 text-sm font-semibold">{s.k}</span>
                    <span className="mt-1 text-[11px] leading-snug text-ink/55">
                      {s.d}
                    </span>
                  </motion.div>
                  {i < FLOW.length - 1 && (
                    <div className="flex items-center">
                      <Arrow delay={i * 0.1 + 0.1} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-ink/40">
            <span className="h-px w-8 bg-ink/20" />
            cycle repeats
            <span className="h-px w-8 bg-ink/20" />
          </div>
        </div>
      </Section>

      {/* THREE DOMAINS ------------------------------------------------------ */}
      <Section kicker="Three engineering domains meet here" title="Why this station is a great teacher">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Pneumatics",
              d: "Compressed air drives every motion — cylinders, the rotary index, the drill and the vacuum gripper.",
            },
            {
              t: "Mechanics",
              d: "Indexing mechanisms, guided cylinders and torque at the drill turn air pressure into precise, repeatable motion.",
            },
            {
              t: "Electronics & Control",
              d: "Sensors report position; a Siemens S7-1200 PLC runs the ladder logic that sequences the whole cycle.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1}>
              <div className="card-dark h-full p-5">
                <div className="font-mono text-[11px] tracking-widest text-paper/50">
                  0{i + 1}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm text-paper/70">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Quiz page="introduction" />
    </PageShell>
  );
}

function Arrow({ delay = 0 }) {
  return (
    <motion.svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <path
        d="M0 8 H22 M16 2 L24 8 L16 14"
        stroke="#0a0a0a"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="none"
      />
    </motion.svg>
  );
}
