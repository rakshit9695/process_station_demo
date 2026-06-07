"use client";

import { motion } from "framer-motion";

export function PageShell({ children }) {
  return <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>;
}

export function PageHeader({ index, title, lead }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 border-b border-ink/10 pb-8"
    >
      <p className="eyebrow">
        {index} · Process Station MMS04
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
      {lead && <p className="mt-4 max-w-2xl text-lg text-ink/60">{lead}</p>}
    </motion.header>
  );
}

export function Section({ title, kicker, children, className = "" }) {
  return (
    <section className={`mb-12 ${className}`}>
      {kicker && <p className="eyebrow mb-1">{kicker}</p>}
      {title && <h2 className="mb-4 text-2xl font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stat({ label, value }) {
  return (
    <div className="card px-4 py-3">
      <div className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
