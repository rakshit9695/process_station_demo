"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SEQUENCE, ACTUATORS } from "./data";

// Cumulatively apply each step's `set` to get every actuator's state at every
// step. timeline[0] = home; timeline[c] = state AFTER step c (1-indexed).
export function computeTimeline() {
  const state = {};
  ACTUATORS.forEach((a) => (state[a.id] = a.home));
  const timeline = [{ ...state }];
  SEQUENCE.forEach((step) => {
    Object.assign(state, step.set || {});
    timeline.push({ ...state });
  });
  return timeline;
}

export const TIMELINE = computeTimeline();

// Shared transport used by both the step-displacement chart and the
// electro-pneumatic diagram so they stay perfectly in sync.
export function useSequencer({ speed = 1300 } = {}) {
  const [i, setI] = useState(0); // active step index, 0..N-1
  const [running, setRunning] = useState(false);
  const [spd, setSpd] = useState(speed);
  const timer = useRef(null);

  const total = SEQUENCE.length;
  const step = SEQUENCE[i];
  const states = TIMELINE[i + 1]; // actuator states after the active step

  const next = useCallback(
    () => setI((p) => Math.min(p + 1, total - 1)),
    [total]
  );
  const prev = useCallback(() => setI((p) => Math.max(p - 1, 0)), []);
  const reset = useCallback(() => {
    setRunning(false);
    setI(0);
  }, []);

  useEffect(() => {
    if (!running) return;
    timer.current = setTimeout(() => {
      setI((p) => {
        if (p >= total - 1) {
          setRunning(false);
          return p;
        }
        return p + 1;
      });
    }, spd);
    return () => clearTimeout(timer.current);
  }, [running, i, spd, total]);

  return {
    i,
    setI,
    step,
    states,
    total,
    running,
    setRunning,
    next,
    prev,
    reset,
    speed: spd,
    setSpeed: setSpd,
  };
}

// Which Q-outputs are energised this step, and which input sensor confirms it.
export function activeIO(step) {
  const coils = new Set(step?.coils || []);
  const inputs = new Set();
  if (step?.sensor) inputs.add(step.sensor);
  if (step?.check) inputs.add(step.check);
  return { coils, inputs };
}
