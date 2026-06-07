"use client";

import { motion } from "framer-motion";
import { ACTUATORS } from "@/lib/data";
import { TIMELINE } from "@/lib/sim";

const LEFT = 150;
const COL = 50;
const ROW = 50;
const TOP = 34;

export default function StepDisplacementChart({ seq }) {
  const N = TIMELINE.length - 1; // number of steps
  const width = LEFT + N * COL + 24;
  const height = TOP + ACTUATORS.length * ROW + 16;
  const headX = LEFT + (seq.i + 1) * COL;

  return (
    <div className="overflow-x-auto rounded-xl border border-ink/15 bg-white p-2">
      <svg width={width} height={height} className="block">
        {/* column grid + step numbers */}
        {Array.from({ length: N + 1 }).map((_, c) => (
          <line
            key={`g${c}`}
            x1={LEFT + c * COL}
            y1={TOP - 6}
            x2={LEFT + c * COL}
            y2={height - 12}
            stroke="#0a0a0a"
            strokeOpacity={0.06}
          />
        ))}
        {Array.from({ length: N }).map((_, c) => (
          <text
            key={`n${c}`}
            x={LEFT + (c + 0.5) * COL}
            y={20}
            textAnchor="middle"
            className="fill-ink/40 font-mono"
            style={{ fontSize: 11 }}
          >
            {c + 1}
          </text>
        ))}

        {/* rows */}
        {ACTUATORS.map((a, r) => {
          const rowTop = TOP + r * ROW;
          const yHi = rowTop + 8;
          const yLo = rowTop + ROW - 16;
          const yOf = (lvl) => (lvl > 0 ? yHi : yLo);

          // full (faded) path + progress (solid) path
          const full = buildPath(a.id, N, yOf);
          const prog = buildPath(a.id, seq.i + 1, yOf);
          const labelHi = a.kind === "motor" || a.kind === "vacuum" ? "ON" : "EXT";
          const labelLo = a.kind === "motor" || a.kind === "vacuum" ? "OFF" : "RET";

          return (
            <g key={a.id}>
              <text x={12} y={rowTop + 18} className="fill-ink font-medium" style={{ fontSize: 12 }}>
                {a.id}
              </text>
              <text x={12} y={rowTop + 32} className="fill-ink/45" style={{ fontSize: 10 }}>
                {a.name.length > 22 ? a.name.slice(0, 20) + "…" : a.name}
              </text>
              <text x={LEFT - 8} y={yHi + 4} textAnchor="end" className="fill-ink/30 font-mono" style={{ fontSize: 8 }}>
                {labelHi}
              </text>
              <text x={LEFT - 8} y={yLo + 4} textAnchor="end" className="fill-ink/30 font-mono" style={{ fontSize: 8 }}>
                {labelLo}
              </text>

              {/* baseline guides */}
              <line x1={LEFT} y1={yLo} x2={LEFT + N * COL} y2={yLo} stroke="#0a0a0a" strokeOpacity={0.05} />

              <path d={full} fill="none" stroke="#0a0a0a" strokeOpacity={0.18} strokeWidth={2} />
              <motion.path
                d={prog}
                fill="none"
                stroke="#0a0a0a"
                strokeWidth={2.5}
                strokeLinejoin="round"
                initial={false}
                animate={{ d: prog }}
                transition={{ duration: 0.3 }}
              />
            </g>
          );
        })}

        {/* playhead */}
        <motion.line
          x1={headX}
          x2={headX}
          y1={TOP - 10}
          y2={height - 12}
          stroke="#0a0a0a"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          initial={false}
          animate={{ x1: headX, x2: headX }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        />
        <motion.circle
          cx={headX}
          cy={TOP - 10}
          r={4}
          fill="#0a0a0a"
          initial={false}
          animate={{ cx: headX }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        />
      </svg>
    </div>
  );
}

// Square-step polyline for actuator `id` up to column `maxC`.
function buildPath(id, maxC, yOf) {
  let d = "";
  let prevY = null;
  for (let c = 0; c <= maxC; c++) {
    const x = LEFT + c * COL;
    const y = yOf(TIMELINE[c][id]);
    if (c === 0) {
      d = `M ${x} ${y}`;
    } else {
      // horizontal at previous level, then vertical to new level
      d += ` L ${x} ${prevY} L ${x} ${y}`;
    }
    prevY = y;
  }
  return d;
}
