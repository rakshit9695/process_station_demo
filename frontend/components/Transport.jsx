"use client";

import { SEQUENCE } from "@/lib/data";

export default function Transport({ seq }) {
  const { i, total, running, setRunning, next, prev, reset, speed, setSpeed } =
    seq;

  return (
    <div className="sticky top-0 z-20 -mx-8 mb-8 border-y border-ink/10 bg-paper/95 px-8 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <button onClick={reset} className="btn-ghost px-2.5 py-1.5" title="Reset">
            ⏮
          </button>
          <button onClick={prev} className="btn-ghost px-2.5 py-1.5" title="Previous step">
            ◀
          </button>
          <button
            onClick={() => setRunning(!running)}
            className="btn-primary w-28 py-1.5"
          >
            {running ? "❚❚ Pause" : "▶ Play"}
          </button>
          <button onClick={next} className="btn-ghost px-2.5 py-1.5" title="Next step">
            ▶
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="eyebrow">Step</span>
          <span className="font-mono text-sm">
            {String(i + 1).padStart(2, "0")} / {total}
          </span>
          <span className="chip">{SEQUENCE[i]?.phase}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="eyebrow">Speed</span>
          <input
            type="range"
            min="400"
            max="2400"
            step="100"
            value={2800 - speed}
            onChange={(e) => setSpeed(2800 - Number(e.target.value))}
            className="h-1 w-28 cursor-pointer accent-ink"
          />
        </div>
      </div>

      {/* progress rail */}
      <div className="mt-3 flex gap-1">
        {Array.from({ length: total }).map((_, k) => (
          <button
            key={k}
            onClick={() => seq.setI(k)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              k <= i ? "bg-ink" : "bg-ink/15"
            }`}
            title={`Step ${k + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
