"use client";

import { useState } from "react";
import { PageShell, PageHeader, Reveal } from "@/components/ui";
import Quiz from "@/components/Quiz";
import { Formula, Tag, FormulaCard } from "@/components/Formula";
import { QUIZZES } from "@/lib/quizzes";

// Pull just the questions for one sub-domain (they all live under page "physics").
const physicsQ = (domain) =>
  QUIZZES.physics.filter((q) => q.domain === domain);

function Worked({ title, lines }) {
  return (
    <div className="mt-4 rounded-lg border border-ink/15 bg-paper-soft/60 p-4">
      <p className="eyebrow mb-2">{title}</p>
      <div className="space-y-1 font-mono text-[13px] text-ink/80">
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}

const DOMAINS = [
  { id: "pneumatics", n: "01", t: "Pneumatics", s: "The energy source" },
  { id: "mechanics", n: "02", t: "Mechanics", s: "Motion & torque" },
  { id: "electronics", n: "03", t: "Electronics", s: "Sensing" },
  { id: "electrical", n: "04", t: "Electrical", s: "Control" },
];

export default function PhysicsPage() {
  const [active, setActive] = useState("pneumatics");

  return (
    <PageShell>
      <PageHeader
        index="02"
        title="The Physics, from first principles"
        lead="Follow the energy: compressed air stores it, mechanics turns it into precise motion, electronics senses what happened, and the electrical/PLC layer decides what to do next. Read top-to-bottom and the whole station makes sense."
      />

      {/* causal-chain sub-nav */}
      <div className="sticky top-0 z-10 -mx-8 mb-10 border-b border-ink/10 bg-paper/90 px-8 py-3 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((d) => (
            <a
              key={d.id}
              href={`#${d.id}`}
              onClick={() => setActive(d.id)}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                active === d.id
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 hover:border-ink/40"
              }`}
            >
              <span className="font-mono text-[11px] opacity-60">{d.n}</span>
              <span className="font-medium">{d.t}</span>
              <span className="hidden text-[11px] opacity-50 sm:inline">
                · {d.s}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* how-to: formulas are interactive */}
      <Reveal>
        <div className="mb-10 flex items-start gap-3 rounded-xl border border-ink/15 bg-paper-soft/50 p-4">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] text-paper">
            i
          </span>
          <p className="text-sm leading-relaxed text-ink/75">
            <strong>Every black formula on this page is clickable.</strong> Tap
            one to open a plain-English description, a worked numerical example,
            and exactly how it shows up on this station. The first formula below,{" "}
            <Tag>p·V = n·R·T</Tag>, is shown <em>already opened</em> as an
            example — all the others reveal the same when you click them.
          </p>
        </div>
      </Reveal>

      {/* 01 — PNEUMATICS */}
      <Domain id="pneumatics" n="01" title="Pneumatics — storing & delivering energy">
        <p>
          Everything starts with a <strong>compressor</strong> squeezing
          atmospheric air into a receiver. Compressing a gas does work on it
          (<Formula id="comp-work">W = ∫ p dV</Formula>); that work is banked as
          pressure energy. The station runs on <strong>6–8 bar</strong> of
          filtered air conditioned by the <strong>FRL unit (0Z)</strong> —{" "}
          <em>Filter</em> (removes dirt/water), <em>Regulator</em> (holds a
          steady set pressure) and <em>Lubricator</em> (mists oil to protect
          seals).
        </p>

        <h4 className="mt-6 font-semibold">Why air? The ideal-gas intuition</h4>
        <p className="mt-2">
          For the air in a line, pressure, volume, amount and temperature are
          linked by the ideal-gas law. Because gas is{" "}
          <strong>compressible</strong>, it acts like a spring: it can store
          energy, cushion shocks, and a cylinder can stall against a load without
          damage. That compliance is also why we never get servo-like position
          accuracy from raw pneumatics — we use mechanical end-stops and sensors
          instead.
        </p>
        {/* PV = nRT shown OPEN as the worked demo of the click-to-expand idea */}
        <FormulaCard id="ideal-gas" badge="Shown open as an example — every other formula opens like this on click" />

        <h4 className="mt-6 font-semibold">Cylinder force — the master equation</h4>
        <p className="mt-2">
          A piston converts pressure into a straight push:{" "}
          <Formula id="cyl-force">F = p · A</Formula>, where{" "}
          <Formula id="piston-area">A = π·d² / 4</Formula> is the piston area. On
          the retract stroke the piston rod steals some area, so the pulling
          force is a little lower (
          <Formula id="retract-area">A_ret = π(d² − d_rod²)/4</Formula>).
        </p>
        <Worked
          title="Worked example — drill-feed cylinder 2A"
          lines={[
            "Assume bore d = 20 mm, supply p = 6 bar = 6×10⁵ Pa",
            "A = π/4 × (0.020)² = 3.14×10⁻⁴ m²",
            "F_extend = p·A = 6×10⁵ × 3.14×10⁻⁴ ≈ 188 N",
            "→ ~19 kgf of drilling thrust available at the bit.",
          ]}
        />

        <h4 className="mt-6 font-semibold">Controlling speed & direction</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>5/2-way double-solenoid valves (1V1–5V1)</strong> route air to
            one side of the cylinder and exhaust the other. Being{" "}
            <strong>bistable</strong>, they <em>remember</em> the last command even
            after the coil drops — so a brief PLC pulse flips the cylinder and it
            stays put.
          </li>
          <li>
            <strong>Adjustable flow-control valves (meter-out)</strong> throttle
            the <em>exhaust</em> air. Restricting the air leaving the cylinder
            creates a back-pressure cushion that gives smooth, controllable speed.
          </li>
          <li>
            The <strong>analogue pressure sensor BP</strong> enforces a safety
            interlock: the cycle only runs when supply pressure exceeds{" "}
            <strong>4 bar</strong>, so actuators never move with too little force.
          </li>
        </ul>

        <Quiz
          page="physics"
          compact
          kicker="Checkpoint · Pneumatics"
          heading="Quick check — Pneumatics"
          questions={physicsQ("pneumatics")}
        />
      </Domain>

      {/* 02 — MECHANICS */}
      <Domain id="mechanics" n="02" title="Mechanics — turning pressure into precise motion">
        <p>
          Pneumatic force is only useful once geometry turns it into the{" "}
          <em>right</em> motion at the <em>right</em> place. That is the job of the
          three mechanical modules.
        </p>

        <h4 className="mt-6 font-semibold">Rotary indexing table — Newton for rotation</h4>
        <p className="mt-2">
          A single cylinder stroke is converted into a fixed{" "}
          <strong>60° rotation</strong> by an indexing mechanism
          (ratchet/Geneva-type). The mechanism is <strong>self-locating</strong>:
          a detent defines the stop, so accuracy comes from the steel, not from
          the air. To spin the table you must overcome its rotational inertia:
        </p>
        <p className="mt-2">
          <Formula id="torque">τ = I · α</Formula> &nbsp;and&nbsp;{" "}
          <Formula id="ang-kin">θ = ½ α t²</Formula> for the 60° (=1.047 rad)
          move.
        </p>
        <Worked
          title="Worked example — indexing torque"
          lines={[
            "Table inertia I ≈ 0.02 kg·m², index in t = 0.4 s over θ = 1.047 rad",
            "α = 2θ / t² = 2×1.047 / 0.16 ≈ 13.1 rad/s²",
            "τ = I·α = 0.02 × 13.1 ≈ 0.26 N·m to accelerate the table",
            "(plus friction & detent — sized with margin)",
          ]}
        />

        <h4 className="mt-6 font-semibold">Drilling — torque, speed & cutting power</h4>
        <p className="mt-2">
          The air-motor drill delivers torque <Tag>τ</Tag> at angular speed{" "}
          <Tag>ω</Tag>; the mechanical power into the cut is{" "}
          <Formula id="rot-power">P = τ · ω</Formula>. Feed thrust (from cylinder
          2A) presses the bit in while rotation removes material. Too much feed
          stalls the air motor — which is actually a safe, self-limiting failure
          mode.
        </p>

        <h4 className="mt-6 font-semibold">Pick &amp; place — resisting moments</h4>
        <p className="mt-2">
          The vertical axis uses a <strong>twin-rod cylinder (4A)</strong>. Two
          parallel rods turn an off-centre load into a <strong>couple</strong>{" "}
          resisted by two reactions, keeping the suction cup square so it seals.
          The horizontal axis is a <strong>rodless cylinder (5A)</strong>: the
          piston is coupled to an external carriage, giving a long stroke in a
          short body. Lifting needs{" "}
          <Formula id="lift-min">F_lift &gt; m·g</Formula> with margin for the
          seal and acceleration (<Formula id="lift-dyn">F = m(g + a)</Formula>).
        </p>

        <Quiz
          page="physics"
          compact
          kicker="Checkpoint · Mechanics"
          heading="Quick check — Mechanics"
          questions={physicsQ("mechanics")}
        />
      </Domain>

      {/* 03 — ELECTRONICS */}
      <Domain id="electronics" n="03" title="Electronics — sensing what actually happened">
        <p>
          Open-loop motion is a guess; the station closes the loop with sensors so
          the PLC only advances when a move is <em>confirmed</em>.
        </p>

        <h4 className="mt-6 font-semibold">Diffuse photo-electric sensors (B1–B4)</h4>
        <p className="mt-2">
          An LED emits (usually infra-red) light; the same housing holds a
          photodiode. When a part is present, light scatters back and the receiver
          current crosses a threshold — a comparator then switches the 24 V output
          (PNP/NPN). Used for <strong>part presence (B1)</strong>,{" "}
          <strong>drill/inspection (B2,B3)</strong> and{" "}
          <strong>pick position (B4)</strong>. First principle:{" "}
          <em>reflected optical power → photocurrent → logic level.</em>
        </p>

        <h4 className="mt-6 font-semibold">Magnetic reed sensors (1B1/1B2 … 5B1/5B2)</h4>
        <p className="mt-2">
          Each cylinder piston carries a permanent magnet. A{" "}
          <strong>reed switch</strong> clamped on the barrel closes when the
          piston-magnet arrives at the end of stroke — giving cheap, reliable{" "}
          <strong>end-position feedback</strong> (retracted = B1, extended = B2)
          without breaking into the pressure boundary.
        </p>

        <h4 className="mt-6 font-semibold">Vacuum &amp; analogue pressure (6P1, BP)</h4>
        <p className="mt-2">
          <strong>6P1</strong> is a digital vacuum switch — it confirms the cup
          actually gripped before the part is lifted. <strong>BP</strong> is{" "}
          <strong>analogue</strong>: it maps pressure to a continuous signal
          (e.g. 4–20 mA or 0–10 V) that the PLC&apos;s ADC turns into a number at{" "}
          <Tag>AI0.0</Tag>. <em>Digital answers yes/no; analogue answers how much.</em>
        </p>

        <Quiz
          page="physics"
          compact
          kicker="Checkpoint · Electronics"
          heading="Quick check — Electronics"
          questions={physicsQ("electronics")}
        />
      </Domain>

      {/* 04 — ELECTRICAL */}
      <Domain id="electrical" n="04" title="Electrical & Control — deciding what to do next">
        <p>
          Two voltage worlds coexist: <strong>230 V AC mains</strong> (protected
          by the <strong>MCB F1</strong>) powers the{" "}
          <strong>24 V DC supply (G1)</strong>, and{" "}
          <strong>24 V DC</strong> runs all the logic, sensors and solenoids —
          safe to touch and standard across the MMS line.
        </p>

        <h4 className="mt-6 font-semibold">The PLC scan cycle (S7-1200)</h4>
        <p className="mt-2">
          A PLC is a deterministic loop, repeated every few milliseconds:
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
          {["Read inputs (I)", "Solve ladder logic", "Write outputs (Q)", "↺"].map(
            (s, i) => (
              <span
                key={i}
                className="rounded-md border border-ink/20 bg-white px-3 py-1.5"
              >
                {s}
              </span>
            )
          )}
        </div>
        <p className="mt-3">
          Inputs are sampled into an image table, the program runs against that
          snapshot, then outputs are updated together. Determinism is the whole
          point: the same inputs always give the same outputs in bounded time.
        </p>

        <h4 className="mt-6 font-semibold">Relays, solenoids &amp; amplification</h4>
        <p className="mt-2">
          A PLC output can only source a small current, but it switches a{" "}
          <strong>solenoid coil</strong> (on the 5/2 valves) or a{" "}
          <strong>relay</strong> — where a tiny coil current closes contacts
          carrying far more power. This is electromagnetic{" "}
          <strong>amplification</strong>:{" "}
          <Formula id="amp-turns">F ∝ N·I</Formula> (ampere-turns) builds the
          field that throws the armature. It is exactly how{" "}
          <Tag>Q0.0 → 1Y1</Tag> turns one logic bit into a real cylinder stroke.
        </p>
        <Worked
          title="Bit → motion, end to end"
          lines={[
            "PLC sets Q0.0 = 1  (a logic bit in memory)",
            "→ output transistor sources 24 V to solenoid 1Y1",
            "→ coil field shifts the 5/2 valve spool",
            "→ air pressurises cylinder 1A → table indexes 60°",
            "→ reed sensor 1B2 = 1 → input I0.5 → PLC advances",
          ]}
        />

        <Quiz
          page="physics"
          compact
          kicker="Checkpoint · Electrical"
          heading="Quick check — Electrical & Control"
          questions={physicsQ("electrical")}
        />
      </Domain>
    </PageShell>
  );
}

function Domain({ id, n, title, children }) {
  return (
    <Reveal>
      <section id={id} className="mb-16 scroll-mt-24">
        <div className="mb-4 flex items-baseline gap-3 border-b border-ink/10 pb-3">
          <span className="font-mono text-sm text-ink/40">{n}</span>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <div className="space-y-1 text-ink/80 [&_h4]:text-ink [&_p]:leading-relaxed [&_li]:leading-relaxed">
          {children}
        </div>
      </section>
    </Reveal>
  );
}
