// Thin client for the Hugging Face FastAPI backend.
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7860";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

export const api = {
  base: BASE,
  login: (name, email) => post("/api/login", { name, email }),
  saveQuiz: (payload) => post("/api/quiz", payload),
  submit: (payload) => post("/api/submit", payload),
};
