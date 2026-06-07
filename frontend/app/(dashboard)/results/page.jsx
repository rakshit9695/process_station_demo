"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageShell, PageHeader, Section } from "@/components/ui";
import { useStore } from "@/lib/store";
import { QUIZZES, quizCount } from "@/lib/quizzes";
import { api } from "@/lib/api";

const PAGE_LABELS = {
  introduction: "Introduction",
  physics: "Physics",
  simulation: "Step & Pneumatic",
  sfc: "Function Chart",
  plc: "PLC & Ladder",
};

export default function ResultsPage() {
  const user = useStore((s) => s.user);
  const answers = useStore((s) => s.answers);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");

  const total = quizCount();
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter((a) => a.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const byPage = Object.entries(QUIZZES).map(([page, qs]) => {
    const a = qs.map((q) => answers[q.id]).filter(Boolean);
    const c = a.filter((x) => x.correct).length;
    return { page, label: PAGE_LABELS[page] || page, answered: a.length, total: qs.length, correct: c };
  });

  async function submit() {
    if (!user) return;
    setBusy(true);
    setErr("");
    try {
      await api.submit({
        email: user.email,
        name: user.name,
        results: byPage,
        score: correct,
        total,
      });
      setSubmitted(true);
    } catch (e) {
      console.warn("submit failed:", e.message);
      setErr("Backend offline — results are saved locally on this device.");
      setSubmitted(true);
    }
    setBusy(false);
  }

  return (
    <PageShell>
      <PageHeader
        index="07"
        title="Your results"
        lead="Here's how you did across the dashboard. Submit to record your score in the backend."
      />

      {/* score ring */}
      <Section>
        <div className="grid items-center gap-6 sm:grid-cols-[auto,1fr]">
          <ScoreRing pct={pct} correct={correct} total={total} />
          <div className="card p-6">
            <p className="eyebrow">Learner</p>
            <p className="text-xl font-semibold">{user?.name}</p>
            <p className="text-sm text-ink/50">{user?.email}</p>
            <hr className="hr-dotted my-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold">{answered}</div>
                <div className="eyebrow">Answered</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">{correct}</div>
                <div className="eyebrow">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">{total}</div>
                <div className="eyebrow">Total</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* per page */}
      <Section kicker="Breakdown" title="By page">
        <div className="space-y-2">
          {byPage.map((p) => (
            <div key={p.page} className="card flex items-center gap-4 p-4">
              <span className="w-40 font-medium">{p.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full bg-ink"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${p.total ? (p.correct / p.total) * 100 : 0}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="w-16 text-right font-mono text-sm">
                {p.correct}/{p.total}
              </span>
              {p.answered < p.total && (
                <Link
                  href={`/${p.page}`}
                  className="text-xs font-medium text-ink/50 underline underline-offset-2 hover:text-ink"
                >
                  finish
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* submit */}
      <Section>
        <div className="card-dark flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {submitted ? "Results recorded ✓" : "Submit your results"}
            </h3>
            <p className="mt-1 text-sm text-paper/70">
              {submitted
                ? "Thanks! Your score is stored. " + (err || "")
                : answered < total
                ? `You've answered ${answered} of ${total}. You can submit now or finish the rest first.`
                : "All questions answered — nice work."}
            </p>
          </div>
          <button
            onClick={submit}
            disabled={busy || submitted}
            className="btn bg-paper text-ink hover:bg-white disabled:opacity-50"
          >
            {busy ? "Submitting…" : submitted ? "Submitted" : "Submit results →"}
          </button>
        </div>
      </Section>

      {/* AR link */}
      <Section>
        <Link href="/ar" className="block">
          <div className="rounded-xl border border-dashed border-ink/25 p-6 text-center transition-colors hover:border-ink hover:bg-ink/[0.02]">
            <p className="eyebrow">Try it in augmented reality</p>
            <h3 className="mt-1 text-xl font-semibold">AR Setup →</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
              Download the AR/VR build of the Process Station. Note: it&apos;s a
              beta and may differ from the actual implementation.
            </p>
          </div>
        </Link>
      </Section>
    </PageShell>
  );
}

function ScoreRing({ pct, correct, total }) {
  const r = 64;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-48 w-48 place-items-center">
      <svg width="192" height="192" className="-rotate-90">
        <circle cx="96" cy="96" r={r} fill="none" stroke="#0a0a0a" strokeOpacity="0.1" strokeWidth="12" />
        <motion.circle
          cx="96"
          cy="96"
          r={r}
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-semibold">{pct}%</div>
        <div className="eyebrow mt-1">
          {correct}/{total} correct
        </div>
      </div>
    </div>
  );
}
