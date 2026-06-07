"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Global state: the logged-in learner + every quiz answer they give.
export const useStore = create(
  persist(
    (set, get) => ({
      user: null, // { name, email }
      answers: {}, // questionId -> { choice, correct, page }
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, answers: {} }),

      answerQuestion: (questionId, choice, correct, page) =>
        set((s) => ({
          answers: { ...s.answers, [questionId]: { choice, correct, page } },
        })),

      score: () => {
        const a = get().answers;
        const keys = Object.keys(a);
        const correct = keys.filter((k) => a[k].correct).length;
        return { correct, total: keys.length };
      },
    }),
    { name: "mms-process-station" }
  )
);
