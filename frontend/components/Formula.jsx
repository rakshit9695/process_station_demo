"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FORMULAS } from "@/lib/formulas";

// Clickable formula chip. Looks like the old black highlight, but opens a panel
// describing what it is, a worked example and a real use on the station.
export function Formula({ id, children }) {
  const [open, setOpen] = useState(false);
  const f = FORMULAS[id];

  if (!f) {
    // unregistered → render as a plain (non-clickable) chip so nothing breaks
    return <Tag>{children}</Tag>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Click for an explanation"
        className="group mx-0.5 inline-flex items-center gap-1 rounded bg-ink px-2 py-0.5 align-baseline font-mono text-[13px] text-paper underline decoration-paper/40 decoration-dotted underline-offset-2 transition-colors hover:decoration-paper"
      >
        {children}
        <span className="grid h-3 w-3 place-items-center rounded-full border border-paper/50 text-[8px] leading-none text-paper/70 group-hover:border-paper group-hover:text-paper">
          i
        </span>
      </button>

      <AnimatePresence>
        {open && <FormulaModal f={f} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// A plain, non-clickable highlight — for symbols/signal names that aren't formulas.
export function Tag({ children }) {
  return (
    <span className="mx-0.5 rounded bg-ink px-2 py-0.5 font-mono text-[13px] text-paper">
      {children}
    </span>
  );
}

function FormulaModal({ f, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={f.name}
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink/15 bg-white p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-ink/15 text-ink/50 transition-colors hover:border-ink hover:text-ink"
        >
          ✕
        </button>
        <FormulaBody f={f} />
      </motion.div>
    </motion.div>
  );
}

// Inline, always-open version (used to demo PV = nRT without a click).
export function FormulaCard({ id, badge = "Worked example — open by default" }) {
  const f = FORMULAS[id];
  if (!f) return null;
  return (
    <div className="mt-4 rounded-2xl border-2 border-ink/15 bg-paper-soft/60 p-6">
      <p className="eyebrow mb-3">{badge}</p>
      <FormulaBody f={f} />
    </div>
  );
}

function FormulaBody({ f }) {
  return (
    <div>
      <p className="eyebrow">{f.name}</p>
      <div className="mt-2 inline-block rounded-lg bg-ink px-4 py-2 font-mono text-lg text-paper">
        {f.expr}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
          What it means
        </p>
        <p className="mt-1 leading-relaxed text-ink/80">{f.what}</p>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
          Worked example
        </p>
        <div className="mt-2 space-y-1 rounded-lg border border-ink/10 bg-white p-3 font-mono text-[13px] text-ink/80">
          {f.example.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
          On this station
        </p>
        <p className="mt-1 leading-relaxed text-ink/80">{f.application}</p>
      </div>
    </div>
  );
}
