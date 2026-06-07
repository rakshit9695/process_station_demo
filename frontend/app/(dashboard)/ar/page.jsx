"use client";

import { motion } from "framer-motion";
import { PageShell, PageHeader, Section, Reveal } from "@/components/ui";

const DRIVE_ID = "1n_hDEwPBsZ3zAeFBg73QqZ2om5KcABpv";
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_ID}`;
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_ID}/view`;

export default function ARPage() {
  return (
    <PageShell>
      <PageHeader
        index="06"
        title="AR Setup"
        lead="Step out of the 2D dashboard and into the station itself. The augmented-reality build lets you walk around the Process Station, trigger the cycle, and watch the pneumatics, mechanics and PLC come alive in space."
      />

      {/* BETA DISCLAIMER — stated up front, end to end */}
      <Reveal>
        <div className="mb-10 rounded-xl border-2 border-ink bg-ink p-6 text-paper">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-paper font-mono text-sm">
              β
            </span>
            <div>
              <p className="font-mono text-[11px] tracking-[0.25em] text-paper/60">
                PLEASE READ — BETA NOTICE
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                This AR/VR setup is a beta and may differ from the actual
                implementation
              </h2>
              <p className="mt-2 text-paper/75">
                The augmented-reality experience you are about to download is an
                early <strong>beta version</strong>. It is meant to convey the
                concept and feel of the Process Station in AR/VR. Some elements —
                visuals, interactions, timing and physical accuracy — may{" "}
                <strong>differ from the final, actual implementation</strong> of
                the product. Treat it as a preview, not the finished article.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* DOWNLOAD */}
      <Section kicker="Get the build" title="Download the AR experience">
        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          <div className="card lg:col-span-3">
            <div className="p-6">
              <p className="text-ink/70">
                The AR build is hosted on Google Drive. Use the button below to
                download it, then follow the steps to run it on your device.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  ↓ Download AR build
                </a>
                <a
                  href={VIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Open in Google Drive ↗
                </a>
              </div>

              <p className="mt-3 break-all font-mono text-[11px] text-ink/40">
                {VIEW_URL}
              </p>

              <hr className="hr-dotted my-5" />

              <p className="eyebrow mb-3">How to use</p>
              <ol className="space-y-2 text-sm text-ink/75">
                {[
                  "Download the file from the link above.",
                  "Install / extract it on a supported AR-capable device.",
                  "Launch the experience and point your device at a flat surface to place the station.",
                  "Trigger the cycle and explore the modules you learned about in this dashboard.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-5 rounded-md bg-ink/5 px-3 py-2 text-xs text-ink/55">
                Reminder: this is a <strong>beta</strong> — the experience may
                differ from the actual implementation.
              </p>
            </div>
          </div>

          {/* animated AR motif */}
          <div className="card-dark relative overflow-hidden lg:col-span-2">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative z-10 grid h-full place-items-center p-8">
              <ARMotif />
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function ARMotif() {
  return (
    <div className="relative h-48 w-48">
      {/* scanning rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-paper/30"
          initial={{ scale: 0.4, opacity: 0.7 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
      {/* floating cube */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 border-2 border-paper"
        animate={{ rotate: 360, y: [-6, 6, -6] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-paper/50">
        AR · PREVIEW
      </div>
    </div>
  );
}
