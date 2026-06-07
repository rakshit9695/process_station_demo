// ---------------------------------------------------------------------------
// Single source of truth for the Process Station (Siemens MMS04).
// Extracted from the instructor workbook (Table of Components, IO List,
// System Steps, Step Displacement & Electro-Pneumatic diagrams).
// ---------------------------------------------------------------------------

export const STATION = {
  model: "MMS04",
  title: "Process Station",
  doc: "TD-MMS4-04-01-02-A",
  size: "72 × 64 × 141 cm",
  pressure: "6–8 bar",
  voltage: "AC 230 V, 50 Hz",
  ioVoltage: "24 V DC",
  power: "224 W (230 VA)",
  index: "60° per index (6 stations)",
};

// --- Table of components (from workbook §10) -------------------------------
export const COMPONENTS_TABLE = {
  Pneumatics: [
    ["1A", "Rotary indexing table"],
    ["2A", "Rodless cylinder (drill feed)"],
    ["3A", "Drilling motor"],
    ["4A", "Twin-rod cylinder (P&P vertical)"],
    ["5A", "Rodless cylinder (P&P horizontal)"],
    ["6A", "Vacuum generator with suction cup"],
    ["1V1–5V1", "5/2-way DCV, double solenoid (×5)"],
    ["xV2 / xV3", "Adjustable flow-control valves (inlet throttle)"],
    ["0V", "Ball valve"],
    ["0Z", "Filter–Regulator–Lubricator + pressure gauge (FRL)"],
  ],
  Mechanical: [
    ["—", "Rotary indexing table module"],
    ["—", "Drilling module"],
    ["—", "Pick & place module"],
  ],
  Sensors: [
    ["B1–B4", "Photo-electric sensors (diffuse)"],
    ["1B1/1B2", "Magnetic reed sensors – table"],
    ["2B1/2B2", "Magnetic reed sensors – drill feed"],
    ["4B1/4B2", "Magnetic reed sensors – P&P vertical"],
    ["5B1/5B2", "Magnetic reed sensors – P&P horizontal"],
    ["6P1", "Vacuum-on sensor"],
    ["BP", "Analogue pressure sensor"],
  ],
  Controls: [
    ["S1", "Start push button (N.O.) – green"],
    ["S2", "Reset push button (N.O.) – red"],
    ["S3", "Auto/Manual selector switch"],
    ["S4", "Emergency stop (N.C.)"],
    ["F1", "Miniature circuit breaker"],
    ["G1", "24 V DC power supply"],
  ],
  PLC: [
    ["—", "PLC Siemens S7-1200"],
    ["—", "Digital expansion module"],
  ],
};

// --- IO list (from workbook §17) -------------------------------------------
export const IO_INPUTS = [
  ["I0.0", "S1", "Start push button (N.O.) – green illuminated"],
  ["I0.1", "S2", "Reset push button (N.O.) – red illuminated"],
  ["I0.2", "S3", "Auto/Manual selector switch"],
  ["I0.3", "S4", "Emergency stop"],
  ["I0.4", "1B1", "Rotary indexing table 1A — retracted"],
  ["I0.5", "1B2", "Rotary indexing table 1A — extended"],
  ["I0.6", "2B1", "Rodless cylinder 2A — retracted"],
  ["I0.7", "2B2", "Rodless cylinder 2A — extended"],
  ["I1.0", "B1", "Component presence in rotary indexing module"],
  ["I1.1", "B2", "Drill position sensor"],
  ["I1.2", "B3", "Inspection sensor"],
  ["I1.3", "B4", "Pick position sensor"],
  ["I1.4", "4B1", "Twin cylinder 4A — retracted"],
  ["I1.5", "4B2", "Twin cylinder 4A — extended"],
  ["I2.0", "5B1", "Rodless cylinder 5A — retracted"],
  ["I2.1", "5B2", "Rodless cylinder 5A — extended"],
  ["I2.2", "IN1_NEXT", "Input from down-stream station"],
  ["I2.3", "6P1", "Vacuum ON"],
  ["I2.4", "IN2_PREV", "Input from up-stream station"],
  ["I2.5", "FB_PREV", "Connectivity feedback from up-stream station"],
  ["AI0.0", "BP", "Analogue pressure sensor"],
];

export const IO_OUTPUTS = [
  ["Q0.0", "1Y1", "Extend rotary indexing table 1A (solenoid of DCV 1V1)"],
  ["Q0.1", "1Y2", "Retract rotary indexing table 1A (solenoid of DCV 1V1)"],
  ["Q0.2", "2Y1", "Extend rodless cylinder 2A (solenoid of DCV 2V1)"],
  ["Q0.3", "2Y2", "Retract rodless cylinder 2A (solenoid of DCV 2V1)"],
  ["Q0.4", "3Y1", "Drilling motor ON 3A (solenoid of DCV 3V1)"],
  ["Q0.5", "4Y1", "Extend twin cylinder 4A (solenoid of DCV 4V1)"],
  ["Q0.6", "4Y2", "Retract twin cylinder 4A (solenoid of DCV 4V1)"],
  ["Q0.7", "5Y1", "Extend rodless cylinder 5A (solenoid of DCV 5V1)"],
  ["Q1.0", "5Y2", "Retract rodless cylinder 5A (solenoid of DCV 5V1)"],
  ["Q1.1", "6Y1", "Switch ON vacuum generator 6A"],
  ["Q2.0", "6Y2", "Switch OFF vacuum generator 6A"],
  ["Q2.1", "OUT1_PREV", "Output to up-stream station"],
  ["Q2.2", "OUT2_NEXT", "Output to down-stream station"],
  ["Q2.3", "FB_NEXT", "Connectivity feedback to down-stream station"],
];

// --- Actuators model (used by simulation + PLC panel) ----------------------
// state: -1 = retracted/off (home), +1 = extended/on
export const ACTUATORS = [
  { id: "1A", name: "Rotary indexing table", kind: "rotary",
    extend: "1Y1", retract: "1Y2", sExt: "1B2", sRet: "1B1", home: -1 },
  { id: "2A", name: "Rodless cylinder (drill feed)", kind: "linearV",
    extend: "2Y1", retract: "2Y2", sExt: "2B2", sRet: "2B1", home: -1 },
  { id: "3A", name: "Drilling motor", kind: "motor",
    extend: "3Y1", retract: null, sExt: null, sRet: null, home: -1 },
  { id: "4A", name: "Twin-rod cylinder (P&P vertical)", kind: "linearV",
    extend: "4Y1", retract: "4Y2", sExt: "4B2", sRet: "4B1", home: -1 },
  { id: "5A", name: "Rodless cylinder (P&P horizontal)", kind: "linearH",
    extend: "5Y1", retract: "5Y2", sExt: "5B2", sRet: "5B1", home: -1 },
  { id: "6A", name: "Vacuum generator + suction cup", kind: "vacuum",
    extend: "6Y1", retract: "6Y2", sExt: "6P1", sRet: null, home: -1 },
];

// ---------------------------------------------------------------------------
// Canonical operating sequence (cleaned & made pedagogically consistent from
// workbook §19 "System steps"). Each step energises output coil(s); the move
// completes when the target end-position sensor reports back.
//   set     : actuator id -> target state (+1 extend/on, -1 retract/off)
//   coils   : Q-output symbols energised during this step
//   sensor  : input symbol that confirms completion (the "feedback")
// ---------------------------------------------------------------------------
export const SEQUENCE = [
  {
    n: 1, phase: "Load", title: "Index workpiece in",
    desc: "Rotary indexing cylinder strokes the table, rotating it 60° to bring the next fixture to the drilling position.",
    set: { "1A": +1 }, coils: ["1Y1"], sensor: "1B2", input: "I0.5",
    physics: "A single-acting index stroke is converted to 60° rotation through a ratchet/Geneva-style mechanism. Pawl engagement makes the motion unidirectional and self-locating.",
  },
  {
    n: 2, phase: "Load", title: "Table home & presence check",
    desc: "Index cylinder retracts to re-cock the pawl; diffuse sensor B1 confirms a workpiece is present in the fixture.",
    set: { "1A": -1 }, coils: ["1Y2"], sensor: "1B1", input: "I0.4",
    check: "B1", physics: "Diffuse photo-electric sensing: emitted IR reflects off the part back to the receiver. No part → no reflection → cycle holds (interlock).",
  },
  {
    n: 3, phase: "Drill", title: "Spin up drill",
    desc: "Pneumatic drilling motor 3A switches ON and reaches cutting speed before feed begins.",
    set: { "3A": +1 }, coils: ["3Y1"], sensor: null, input: "—",
    physics: "An air motor converts compressed-air enthalpy into shaft torque via a vane rotor. Free-running speed is high; torque rises as load (cutting resistance) increases.",
  },
  {
    n: 4, phase: "Drill", title: "Feed drill down",
    desc: "Rodless cylinder 2A extends, feeding the spinning drill into the workpiece. Pressure sensor BP must read > 4 bar for the cut to proceed.",
    set: { "2A": +1 }, coils: ["2Y1"], sensor: "2B2", input: "I0.7",
    check: "BP", physics: "Cutting thrust F = p·A (regulator pressure × piston area). The inlet throttle (flow-control valve) meters exhaust air to set a smooth, controlled feed rate.",
  },
  {
    n: 5, phase: "Drill", title: "Retract drill",
    desc: "Rodless cylinder 2A retracts, lifting the drill clear of the finished hole.",
    set: { "2A": -1 }, coils: ["2Y2"], sensor: "2B1", input: "I0.6",
    physics: "Direction reverses when the 5/2 valve's other solenoid is energised, swapping the pressurised and exhaust ports of the cylinder.",
  },
  {
    n: 6, phase: "Drill", title: "Stop drill",
    desc: "Drilling motor 3A switches OFF. The drilled part is ready to index onward.",
    set: { "3A": -1 }, coils: [], sensor: null, input: "—",
    physics: "Removing air supply lets the rotor coast down; residual angular momentum dissipates through bearing and vane friction.",
  },
  {
    n: 7, phase: "Inspect", title: "Index to inspection",
    desc: "Table indexes 60° to the inspection station; sensor B3 verifies the hole was produced.",
    set: { "1A": +1 }, coils: ["1Y1"], sensor: "1B2", input: "I0.5",
    physics: "Same index mechanism. B3 is a diffuse sensor positioned to detect the through-hole (presence/absence of reflected light at the hole).",
  },
  {
    n: 8, phase: "Inspect", title: "Table home",
    desc: "Index cylinder retracts and re-cocks for the next move.",
    set: { "1A": -1 }, coils: ["1Y2"], sensor: "1B1", input: "I0.4",
    physics: "Repeatable indexing relies on the mechanical detent, not on cylinder stroke accuracy — a key first-principle of robust automation.",
  },
  {
    n: 9, phase: "Transfer", title: "Index to pick station",
    desc: "Table indexes once more to bring the part under the pick & place head; sensor B4 confirms pick position.",
    set: { "1A": +1 }, coils: ["1Y1"], sensor: "1B2", input: "I0.5",
    physics: "Each station is 60° apart, so the same single-stroke index serves load, drill, inspect, pick and transfer stations in turn.",
  },
  {
    n: 10, phase: "Transfer", title: "Table home",
    desc: "Index cylinder retracts; part now sits beneath the suction cup.",
    set: { "1A": -1 }, coils: ["1Y2"], sensor: "1B1", input: "I0.4",
    physics: "Mechanical locking holds the table rigid while the P&P forces act on the part.",
  },
  {
    n: 11, phase: "Transfer", title: "Lower P&P head",
    desc: "Twin-rod cylinder 4A extends downward so the suction cup meets the workpiece.",
    set: { "4A": +1 }, coils: ["4Y1"], sensor: "4B2", input: "I1.5",
    physics: "Twin guide rods resist the bending moment from off-axis load, keeping the cup square to the part — pure mechanics: a couple resisted by two parallel reactions.",
  },
  {
    n: 12, phase: "Transfer", title: "Grip (vacuum ON)",
    desc: "Vacuum generator 6A switches ON; suction cup grips the part. Sensor 6P1 confirms vacuum is established.",
    set: { "6A": +1 }, coils: ["6Y1"], sensor: "6P1", input: "I2.3",
    physics: "A venturi nozzle accelerates air to drop static pressure (Bernoulli), creating suction. Hold force ≈ (P_atm − P_vac) × cup area.",
  },
  {
    n: 13, phase: "Transfer", title: "Raise P&P head",
    desc: "Twin-rod cylinder 4A retracts, lifting the gripped part.",
    set: { "4A": -1 }, coils: ["4Y2"], sensor: "4B1", input: "I1.4",
    physics: "Lift force must exceed part weight + vacuum seal stiffness; the regulator pressure is set with margin so the cup never slips.",
  },
  {
    n: 14, phase: "Transfer", title: "Traverse to outfeed",
    desc: "Rodless cylinder 5A extends, carrying the part horizontally toward the down-stream station.",
    set: { "5A": +1 }, coils: ["5Y1"], sensor: "5B2", input: "I2.1",
    physics: "A rodless cylinder couples piston to carriage magnetically/mechanically, giving a long stroke in a compact body — momentum is controlled by exhaust throttling.",
  },
  {
    n: 15, phase: "Transfer", title: "Lower at drop point",
    desc: "Twin-rod cylinder 4A extends to place the part onto the outfeed.",
    set: { "4A": +1 }, coils: ["4Y1"], sensor: "4B2", input: "I1.5",
    physics: "Controlled descent (throttled exhaust) prevents impact loading on the placed part.",
  },
  {
    n: 16, phase: "Transfer", title: "Release (vacuum OFF)",
    desc: "Vacuum generator 6A switches OFF; the part is released to the down-stream station and OUT2_NEXT is signalled.",
    set: { "6A": -1 }, coils: ["6Y2", "OUT2_NEXT"], sensor: null, input: "—",
    physics: "A short blow-off pulse breaks the vacuum cleanly so the part drops without sticking — overcoming residual seal adhesion.",
  },
  {
    n: 17, phase: "Reset", title: "Raise & traverse home",
    desc: "4A retracts and 5A retracts, returning the P&P to its home position. Cycle complete — ready for the next part.",
    set: { "4A": -1, "5A": -1 }, coils: ["4Y2", "5Y2"], sensor: "5B1", input: "I2.0",
    physics: "Returning all actuators to a defined home state guarantees a deterministic start for every cycle — the foundation of repeatable automation.",
  },
];

// --- Phase grouping for the step-displacement chart ------------------------
export const PHASES = ["Load", "Drill", "Inspect", "Transfer", "Reset"];
