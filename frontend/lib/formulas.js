// Every formula shown on the Physics page is registered here. Clicking a formula
// chip opens its entry: a plain-English description, a worked mathematical
// example, and a concrete use on the Process Station — so each one becomes
// intuitive end to end. (PV = nRT is also rendered open, as a live demo.)

export const FORMULAS = {
  "ideal-gas": {
    name: "Ideal-gas law",
    expr: "p · V = n · R · T",
    what:
      "It ties together the four things that describe a trapped gas: pressure p, volume V, how much gas there is n, and temperature T (R is a constant). Squeeze the same gas into half the volume and the pressure doubles. Because gas is compressible, it behaves like an invisible spring — it can store energy and cushion shocks.",
    example: [
      "Take 1 mol of air at room temp T = 293 K.",
      "R = 8.314 J/(mol·K)",
      "In a V = 0.5 L = 5×10⁻⁴ m³ space:",
      "p = nRT / V = (1 × 8.314 × 293) / 5×10⁻⁴",
      "p ≈ 4.9×10⁶ Pa ≈ 49 bar — squeezing the volume raises pressure fast.",
    ],
    application:
      "It is the reason the station runs on air at all. The compressor packs many moles of air into the receiver (high p), and that 'spring' drives every cylinder. The same compliance is why raw pneumatics can't hold an exact mid-position — so we use mechanical end-stops + sensors instead.",
  },

  "comp-work": {
    name: "Compression work",
    expr: "W = ∫ p dV",
    what:
      "The work done squeezing a gas is the pressure multiplied by the tiny volume change, added up across the whole stroke (that's what the integral ∫ means). This is the energy the compressor spends — and exactly the energy the air banks as pressure, ready to give back to a cylinder.",
    example: [
      "Compress air at a roughly steady p = 6×10⁵ Pa,",
      "reducing its volume by ΔV = 2×10⁻⁴ m³.",
      "W ≈ p·ΔV = 6×10⁵ × 2×10⁻⁴",
      "W ≈ 120 J banked into that air.",
    ],
    application:
      "Every cycle, the compressor does this work to refill the receiver. That stored energy is what later becomes drilling thrust, table indexing and pick-&-place motion — the whole station is spending banked compression work.",
  },

  "cyl-force": {
    name: "Cylinder force",
    expr: "F = p · A",
    what:
      "A piston turns pressure into a straight push. The force equals the air pressure times the piston's face area. Bigger bore or higher pressure → more force. Simple, but it's the master equation for every linear move on the station.",
    example: [
      "Bore d = 20 mm → A = π/4 × (0.020)² = 3.14×10⁻⁴ m²",
      "Supply p = 6 bar = 6×10⁵ Pa",
      "F = p·A = 6×10⁵ × 3.14×10⁻⁴",
      "F ≈ 188 N  (~19 kgf of push).",
    ],
    application:
      "Sets the drilling thrust of cylinder 2A and the clamping/lifting force everywhere. If a move stalls, this equation tells you whether to raise pressure or fit a bigger bore.",
  },

  "piston-area": {
    name: "Piston area",
    expr: "A = π · d² / 4",
    what:
      "The area of the round piston face, from its bore diameter d. It feeds straight into F = p·A — double the diameter and the area (and force) quadruples, because area grows with the square.",
    example: [
      "d = 20 mm = 0.020 m",
      "A = π/4 × d² = 0.7854 × (0.020)²",
      "A = 0.7854 × 4×10⁻⁴",
      "A ≈ 3.14×10⁻⁴ m² (314 mm²).",
    ],
    application:
      "Choosing a cylinder is really choosing this number: it converts the fixed 6 bar supply into the force a given module needs. Spec the bore, and F = p·A tells you the thrust.",
  },

  "retract-area": {
    name: "Retract (annulus) area",
    expr: "A_ret = π (d² − d_rod²) / 4",
    what:
      "On the retract stroke the piston rod occupies part of the face, so the effective area is the ring (annulus) left over. Less area at the same pressure means the pull force is a little weaker than the push.",
    example: [
      "Bore d = 20 mm, rod d_rod = 8 mm",
      "A_ret = π/4 × (0.020² − 0.008²)",
      "A_ret = π/4 × (4×10⁻⁴ − 6.4×10⁻⁵)",
      "A_ret ≈ 2.64×10⁻⁴ m² — about 16% less than extend.",
    ],
    application:
      "Why a double-acting cylinder pushes harder than it pulls. Matters when a module must lift or hold load on the retract stroke — you size for the weaker direction.",
  },

  torque: {
    name: "Newton's law for rotation",
    expr: "τ = I · α",
    what:
      "The rotational twin of F = m·a. To angularly accelerate something you need torque τ equal to its moment of inertia I (how hard it is to spin) times the angular acceleration α. Heavier/larger table → more torque to index it.",
    example: [
      "Table inertia I ≈ 0.02 kg·m²",
      "Index 60° (=1.047 rad) in t = 0.4 s",
      "α = 2θ/t² = 2×1.047 / 0.16 ≈ 13.1 rad/s²",
      "τ = I·α = 0.02 × 13.1 ≈ 0.26 N·m.",
    ],
    application:
      "Sizes the indexing drive: the cylinder + linkage must supply at least this torque (plus friction and detent margin) to rotate the table one station in time.",
  },

  "ang-kin": {
    name: "Angular kinematics",
    expr: "θ = ½ · α · t²",
    what:
      "Starting from rest, the angle turned grows with the square of time under constant angular acceleration α. Rearranged, it tells you the α needed to cover a known angle in a known time — the input to τ = I·α.",
    example: [
      "Need θ = 60° = 1.047 rad in t = 0.4 s",
      "θ = ½·α·t²  →  α = 2θ / t²",
      "α = 2×1.047 / (0.4)²",
      "α ≈ 13.1 rad/s².",
    ],
    application:
      "Turns a timing requirement ('one index in 0.4 s') into the acceleration the mechanism must deliver, which then sets the torque and the cylinder force behind it.",
  },

  "rot-power": {
    name: "Rotational power",
    expr: "P = τ · ω",
    what:
      "The power a spinning shaft delivers is its torque τ times its angular speed ω (in rad/s). It's the rotational version of P = F·v — high torque at high speed means high power into the cut.",
    example: [
      "Drill torque τ = 0.5 N·m",
      "Speed = 3000 rpm → ω = 3000 × 2π/60 ≈ 314 rad/s",
      "P = τ·ω = 0.5 × 314",
      "P ≈ 157 W into the cut.",
    ],
    application:
      "Describes the air-motor drill. Too much feed lowers ω until the motor stalls — a safe, self-limiting failure: the air just can't deliver more power, so nothing breaks.",
  },

  "lift-min": {
    name: "Minimum lift condition",
    expr: "F_lift > m · g",
    what:
      "To raise a part, the lifting force must beat gravity: mass m times g (9.81 m/s²). Meet it exactly and the part just floats; you always design with margin above it for grip and acceleration.",
    example: [
      "Part mass m = 0.2 kg",
      "Weight = m·g = 0.2 × 9.81",
      "Weight ≈ 1.96 N",
      "So F_lift must exceed ~2 N (plus margin).",
    ],
    application:
      "The first check for the pick-&-place vacuum cup + twin-rod cylinder 4A: can it hold the part against gravity before it even starts moving?",
  },

  "lift-dyn": {
    name: "Lifting with acceleration",
    expr: "F = m · (g + a)",
    what:
      "When you don't just hold a part but accelerate it upward at a, the force must cover gravity and the acceleration. The faster you snatch it up, the more force (and grip) you need.",
    example: [
      "m = 0.2 kg, lifted at a = 3 m/s²",
      "F = m(g + a) = 0.2 × (9.81 + 3)",
      "F = 0.2 × 12.81",
      "F ≈ 2.56 N — ~30% more than just holding it.",
    ],
    application:
      "Sizes the vacuum grip and cylinder for a brisk pick. If the cup can only hold ~2 N, lifting too fast peels the part off mid-air — so cycle speed is limited by this.",
  },

  "amp-turns": {
    name: "Ampere-turns (magnetomotive force)",
    expr: "F ∝ N · I",
    what:
      "The magnetic pull a coil produces grows with the number of turns N times the current I through it. More turns or more current → stronger field → enough force to throw a valve spool or relay armature.",
    example: [
      "Coil of N = 500 turns carrying I = 0.1 A",
      "Magnetomotive force ∝ N·I = 500 × 0.1",
      "= 50 ampere-turns of 'magnetic push'.",
      "Enough field to shift a 5/2 valve spool.",
    ],
    application:
      "How one tiny PLC output bit becomes real motion: Q0.0 energises solenoid 1Y1, its ampere-turns shift the valve spool, air flows, and cylinder 1A strokes. Amplification — small current, big mechanical action.",
  },
};
