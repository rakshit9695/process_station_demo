// Component knowledge cards for the Sequential Function Chart page.
// `brief` shows on the card; `deep` (physics + working principle) opens on click.
export const SFC_CARDS = [
  {
    id: "rotary",
    tag: "1A",
    group: "Mechanical",
    name: "Rotary indexing table",
    brief:
      "Pneumatically driven turntable that indexes the workpiece 60° per step through 6 stations.",
    role: "Steps 1–2, 7–10 of the cycle.",
    deep: [
      "A single-acting pneumatic stroke is converted into a precise 60° rotation by a ratchet / Geneva-type indexing mechanism. The cylinder pushes a pawl that rotates the table exactly one division, then retracts and re-engages for the next move.",
      "First principle — accuracy by geometry, not by air: pneumatics is compressible and can't position accurately on its own. The index relies on a mechanical detent that physically locates each stop, so repeatability comes from the hardened steel, independent of cylinder speed.",
      "Dynamics: to turn the table you supply torque against its rotational inertia, τ = I·α. The 60° (1.047 rad) move is accelerated then decelerated into the detent; reed sensors 1B1 (home) and 1B2 (indexed) confirm each transition.",
    ],
    formula: "τ = I · α   ·   60° = 1.047 rad per index",
  },
  {
    id: "drill-motor",
    tag: "3A",
    group: "Mechanical · Pneumatic",
    name: "Pneumatic drilling motor",
    brief:
      "Air motor that spins the drill bit; switched ON before the feed stroke and OFF after.",
    role: "Steps 3 & 6.",
    deep: [
      "Compressed air expands across a vane rotor, converting pressure energy into shaft rotation. Free speed is high; as the bit meets material, cutting resistance raises the required torque and the motor slows — a naturally load-sensing behaviour.",
      "Mechanical power delivered to the cut is P = τ·ω. If feed is too aggressive the air motor simply stalls instead of breaking the bit — an inherently safe, self-limiting failure mode that geared electric drills don't have.",
      "It is spun up to speed before the feed cylinder advances so the bit is already cutting cleanly when it contacts the part.",
    ],
    formula: "P = τ · ω",
  },
  {
    id: "drill-feed",
    tag: "2A",
    group: "Pneumatic",
    name: "Drill-feed rodless cylinder",
    brief:
      "Feeds the spinning drill down into the workpiece, then retracts it clear.",
    role: "Steps 4 & 5.",
    deep: [
      "The feed thrust is pure F = p·A — supply pressure times piston area. At 6 bar on a ~20 mm bore that's roughly 190 N of drilling force.",
      "Feed rate is set by a meter-out flow-control valve that throttles the exhaust air, creating a back-pressure cushion for a smooth, controllable descent rather than a sudden slam.",
      "The pressure sensor BP gates the cut: if supply falls below 4 bar there isn't enough thrust, so the PLC holds the step — protecting both the bit and the hole quality.",
    ],
    formula: "F = p · A   (≈190 N @ 6 bar, ⌀20)",
  },
  {
    id: "pp-vertical",
    tag: "4A",
    group: "Pneumatic · Mechanical",
    name: "Twin-rod cylinder (P&P vertical)",
    brief:
      "Raises and lowers the vacuum head over the part; two guide rods keep it square.",
    role: "Steps 11, 13, 15, 17.",
    deep: [
      "Two parallel rods convert an off-centre (eccentric) load into a couple resisted by two reactions, preventing the head from cocking. That keeps the suction cup flat against the part so it can seal — a direct application of moment balance.",
      "Lifting requires F_lift > m·g, plus margin for acceleration and the small force to peel the seal: F = m(g + a). The regulator pressure is set with headroom so the grip never slips mid-transfer.",
      "Throttled exhaust gives a controlled descent at the place point, avoiding impact loads on the part being set down.",
    ],
    formula: "ΣM = 0  →  cup stays square ·  F = m(g + a)",
  },
  {
    id: "pp-horizontal",
    tag: "5A",
    group: "Pneumatic",
    name: "Rodless cylinder (P&P horizontal)",
    brief:
      "Carries the gripped part horizontally between pick and drop positions.",
    role: "Steps 14 & 17.",
    deep: [
      "A rodless cylinder couples the internal piston to an external carriage (magnetically or mechanically), giving a long stroke in a body barely longer than the stroke itself — no protruding rod to double the footprint.",
      "Because the moving mass can be significant, end-of-stroke momentum is absorbed by exhaust throttling and internal cushions: ½mv² of kinetic energy is dissipated smoothly instead of as a bang.",
      "Reed sensors 5B1/5B2 confirm the home and extended positions before the next motion is allowed.",
    ],
    formula: "stroke ≫ body length ·  KE = ½ m v²",
  },
  {
    id: "vacuum",
    tag: "6A",
    group: "Pneumatic",
    name: "Vacuum generator + suction cup",
    brief:
      "Creates suction with no moving parts to grip the part; releases with a blow-off.",
    role: "Steps 12 (ON) & 16 (OFF).",
    deep: [
      "Compressed air is forced through a converging venturi nozzle; the high velocity drops the static pressure (Bernoulli's principle), and that low pressure is ported to the suction cup. No pump, no moving parts — just airflow.",
      "Hold force ≈ (P_atm − P_vac) × cup area. A bigger cup or deeper vacuum grips harder; the digital sensor 6P1 confirms the vacuum is actually established before the part is lifted.",
      "Release uses a short blow-off pulse to break residual seal adhesion, so the part drops cleanly instead of sticking to the cup.",
    ],
    formula: "F_hold ≈ (P_atm − P_vac) · A_cup",
  },
  {
    id: "dcv",
    tag: "1V1–5V1",
    group: "Pneumatic · Electrical",
    name: "5/2-way double-solenoid valve",
    brief:
      "The electrically-controlled 'switch' that routes air to extend or retract each cylinder.",
    role: "Every actuator move.",
    deep: [
      "Five ports, two states: it connects supply to one cylinder port while exhausting the other, then swaps. Two solenoids (e.g. 1Y1 / 1Y2) flip the spool one way or the other.",
      "Being bistable, it is a memory element: a brief PLC pulse moves the spool and it stays there after the coil de-energises. That's why the ladder can pulse a coil rather than hold it, and the cylinder keeps its commanded state.",
      "This is the bridge between the electrical and pneumatic worlds — a 24 V logic bit (Q-output) becomes a real airflow and therefore real motion.",
    ],
    formula: "Q-bit → solenoid → spool shift → airflow",
  },
  {
    id: "flow",
    tag: "xV2/xV3",
    group: "Pneumatic",
    name: "Adjustable flow-control valves",
    brief:
      "Meter-out throttles that set each cylinder's speed independently of force.",
    role: "Speed of every stroke.",
    deep: [
      "A needle restriction in parallel with a check valve lets air flow freely in, but throttles it on the way out (meter-out). Restricting the exhaust builds a back-pressure cushion that resists the piston, smoothing the motion.",
      "Key insight: speed and force are decoupled. Force is set by supply pressure (F = p·A); speed is set here by how fast air can leave. You can have a strong, slow stroke or a light, fast one.",
      "Tuning these is how the station gets a gentle drill feed but a brisk index.",
    ],
    formula: "throttle exhaust ⇒ controlled v, same F",
  },
  {
    id: "frl",
    tag: "0Z · BP",
    group: "Pneumatic",
    name: "FRL unit & pressure sensing",
    brief:
      "Conditions the incoming air and measures it; the cycle only runs above 4 bar.",
    role: "Whole-station supply & safety.",
    deep: [
      "Filter removes particulates and condensate; Regulator holds a constant downstream pressure regardless of upstream swings; Lubricator mists a little oil to protect valve and cylinder seals. Clean, steady, lubricated air is the foundation of reliable pneumatics.",
      "The analogue pressure sensor BP maps pressure to a continuous signal the PLC reads at AI0.0 via its ADC. Below 4 bar there isn't enough force for a clean cut, so the PLC interlocks the cycle.",
      "Digital sensors answer yes/no; this analogue one answers 'how much' — enabling threshold logic in software.",
    ],
    formula: "AI0.0 = ADC(pressure) ·  run if p > 4 bar",
  },
  {
    id: "photo",
    tag: "B1–B4",
    group: "Electronics",
    name: "Photo-electric sensors (diffuse)",
    brief:
      "Optical sensors that detect part presence, the drilled hole, and pick position.",
    role: "Presence & inspection.",
    deep: [
      "An LED emits infra-red light; a photodiode in the same housing measures light reflected back from a nearby object. A comparator switches the 24 V output when the reflected power crosses a set threshold.",
      "Diffuse mode needs no separate reflector — it senses off the part itself. B1 confirms a workpiece is loaded, B2/B3 watch the drill and inspection stations, B4 confirms pick position.",
      "First principle: reflected optical power → photocurrent → logic level. Surface finish and distance set the margin, which is why the threshold is tuned during commissioning.",
    ],
    formula: "reflected light → photocurrent → 24 V logic",
  },
  {
    id: "reed",
    tag: "xB1/xB2",
    group: "Electronics",
    name: "Magnetic reed sensors",
    brief:
      "End-of-stroke feedback on every cylinder, triggered by the piston's magnet.",
    role: "Confirms each move completed.",
    deep: [
      "The piston carries a permanent magnet. A reed switch clamped on the outside of the barrel closes when the magnet arrives at that end of stroke — no need to breach the pressure boundary.",
      "This gives cheap, robust position feedback (retracted = xB1, extended = xB2) that closes the control loop: the PLC waits for the sensor before advancing, so timing self-adjusts to real motion.",
      "Without it the sequence would be open-loop guesswork; with it, the station is deterministic and safe.",
    ],
    formula: "piston magnet ⇒ reed closes ⇒ I-bit = 1",
  },
  {
    id: "plc",
    tag: "S7-1200",
    group: "Control",
    name: "PLC Siemens S7-1200 (+ expansion)",
    brief:
      "The brain: scans inputs, solves ladder logic, drives the output coils every few ms.",
    role: "Sequences the entire cycle.",
    deep: [
      "A deterministic loop: read all inputs into an image table → execute the program against that snapshot → write all outputs together → repeat. Same inputs always give the same outputs in bounded time.",
      "The digital expansion module adds the I/O points needed for all the sensors and solenoids in the table. Ethernet lets it talk to up- and down-stream stations (IN/OUT signals) and to engineering software.",
      "Everything else on this page is an actuator or a sensor; the PLC is what turns sensing into the next decision — the closed loop made programmable.",
    ],
    formula: "read I → solve logic → write Q → ↺",
  },
];

export const SFC_GROUPS = ["Mechanical", "Pneumatic", "Electronics", "Control"];
