"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { QUIZZES } from "@/lib/quizzes";
import { api } from "@/lib/api";

export default function Quiz({
  page,
  questions: questionsProp,
  heading = "Test your understanding",
  kicker = "Checkpoint",
  compact = false,
}) {
  const questions = questionsProp || QUIZZES[page] || [];
  const answers = useStore((s) => s.answers);
  const answerQuestion = useStore((s) => s.answerQuestion);
  const user = useStore((s) => s.user);
  const [saved, setSaved] = useState(false);

  function choose(qid, idx, correctIdx) {
    if (answers[qid]) return; // lock after first answer
    const correct = idx === correctIdx;
    answerQuestion(qid, idx, correct, page);
  }

  const answeredHere = questions.filter((q) => answers[q.id]).length;
  const allDone = answeredHere === questions.length && questions.length > 0;

  async function persist() {
    if (!user) return;
    const score = questions.filter((q) => answers[q.id]?.correct).length;
    try {
      await api.saveQuiz({
        email: user.email,
        page,
        answers: questions.map((q) => ({
          id: q.id,
          choice: answers[q.id]?.choice,
          correct: answers[q.id]?.correct,
        })),
        score,
        total: questions.length,
      });
      setSaved(true);
    } catch (e) {
      console.warn("quiz save failed:", e.message);
      setSaved(true); // already stored locally
    }
  }

  if (!questions.length) return null;

  return (
    <section
      className={`rounded-xl border border-ink/15 bg-white p-6 ${
        compact ? "mt-8" : "mt-14"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2 className={compact ? "text-lg font-semibold" : "text-xl font-semibold"}>
            {heading}
          </h2>
        </div>
        <span className="chip">
          {answeredHere}/{questions.length} answered
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const a = answers[q.id];
          return (
            <div key={q.id} className="rounded-lg border border-ink/10 p-4">
              <p className="font-medium">
                <span className="mr-2 font-mono text-ink/40">Q{qi + 1}.</span>
                {q.q}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const chosen = a?.choice === oi;
                  const isCorrect = oi === q.answer;
                  let cls =
                    "border-ink/15 hover:border-ink/40 hover:bg-ink/[0.03]";
                  if (a) {
                    if (isCorrect) cls = "border-ink bg-ink text-paper";
                    else if (chosen) cls = "border-ink/40 bg-ink/5 line-through text-ink/50";
                    else cls = "border-ink/10 text-ink/40";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={!!a}
                      onClick={() => choose(q.id, oi, q.answer)}
                      className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${cls} ${
                        a ? "cursor-default" : ""
                      }`}
                    >
                      <span className="mr-2 font-mono text-xs opacity-60">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {a && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-sm"
                  >
                    {a.correct ? (
                      <span className="text-ink">✓ Correct.</span>
                    ) : (
                      <span className="text-ink/60">
                        ✗ Not quite — the right answer is{" "}
                        <strong>{String.fromCharCode(65 + q.answer)}</strong>.
                      </span>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {compact ? (
        <p className="mt-4 text-right text-xs text-ink/40">
          {allDone
            ? "Recorded ✓ — submitted with the rest on the Results page."
            : "Answers are saved automatically as you go."}
        </p>
      ) : (
        <div className="mt-5 flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-ink/50">Saved ✓</span>}
          <button
            onClick={persist}
            disabled={!allDone}
            className="btn-primary text-sm"
          >
            Save answers
          </button>
        </div>
      )}
    </section>
  );
}
