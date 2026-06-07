"use client";

import { motion } from "framer-motion";
import { PageShell, PageHeader, Section, Reveal } from "@/components/ui";

const DRIVE_ID = "1h5MygTkKvKHdUjUPmUyVcDbfdiwI_Pvw";
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_ID}`;
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_ID}/view?usp=drive_link`;

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

          {/* SCAN-TO-DOWNLOAD QR — built for phones */}
          <div className="card-dark relative overflow-hidden lg:col-span-2">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="font-mono text-[10px] tracking-[0.3em] text-paper/50">
                SCAN TO DOWNLOAD
              </p>

              <a
                href={VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="Scan or tap to open the AR build on Google Drive"
              >
                {/* scanning corner brackets */}
                <span className="pointer-events-none absolute -inset-3">
                  {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c, i) => (
                    <span key={i} className={`absolute h-5 w-5 border-paper/60 ${c}`} />
                  ))}
                </span>

                {/* the QR itself, on a white tile so cameras read it cleanly */}
                <span className="block rounded-xl bg-paper p-4 shadow-lg transition-transform group-hover:scale-[1.02]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/ar-qr.svg"
                    alt="QR code — scan to open the AR build on Google Drive"
                    width={180}
                    height={180}
                    className="h-44 w-44"
                  />
                </span>

                {/* animated scan line sweeping over the code */}
                <motion.span
                  className="pointer-events-none absolute inset-x-4 top-4 h-0.5 rounded bg-paper/80 mix-blend-difference"
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 168, 0], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </a>

              <p className="max-w-[15rem] text-xs leading-relaxed text-paper/60">
                Point your phone camera at the code to open the AR build on Google
                Drive, then tap download.
              </p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-paper/40">
                AR · PREVIEW
              </p>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
