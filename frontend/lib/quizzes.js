// 1–2 quiz questions per content page. answer = index of correct option.
export const QUIZZES = {
  introduction: [
    {
      id: "intro-1",
      q: "Within the Siemens MMS line, what is the Process Station's primary job?",
      options: [
        "Assemble electronic boards",
        "Perform machining (e.g. drilling) on a rotary-indexed part, then transfer it downstream",
        "Sort parts purely by colour",
        "Package finished goods",
      ],
      answer: 1,
    },
    {
      id: "intro-2",
      q: "How does the rotary indexing table move parts between stations?",
      options: [
        "Continuous rotation at constant speed",
        "Random positioning by a servo",
        "In fixed 60° steps, dwelling at each of 6 stations",
        "It does not move; the tools move instead",
      ],
      answer: 2,
    },
  ],
  // Each physics question carries a `domain` so the page can show a short
  // checkpoint under each sub-domain. They all still live under page "physics",
  // so scoring, quizCount() and the Results breakdown stay correct.
  physics: [
    // — Pneumatics —
    {
      id: "phys-pn-1",
      domain: "pneumatics",
      q: "A pneumatic cylinder's output force is given by:",
      options: [
        "F = m·a only",
        "F = pressure × piston area (F = p·A)",
        "F = voltage × current",
        "F = ½·k·x²",
      ],
      answer: 1,
    },
    {
      id: "phys-pn-2",
      domain: "pneumatics",
      q: "Why is a 5/2 double-solenoid valve called bistable?",
      options: [
        "It needs continuous coil power to hold the cylinder still",
        "It remembers its last commanded position after the coil is de-energised",
        "It can only ever extend the cylinder",
        "It vents both cylinder ports at the same time",
      ],
      answer: 1,
    },
    // — Mechanics —
    {
      id: "phys-me-1",
      domain: "mechanics",
      q: "The rotary indexing table is 'self-locating'. Where does its positional accuracy come from?",
      options: [
        "From precisely timing the air pulse",
        "From a mechanical detent/stop machined in steel, not from the air",
        "From a servo encoder counting degrees",
        "From the operator nudging it by hand",
      ],
      answer: 1,
    },
    {
      id: "phys-me-2",
      domain: "mechanics",
      q: "To spin up the indexing table you must supply a torque τ. It relates to inertia and angular acceleration by:",
      options: [
        "τ = m·g",
        "τ = I·α (moment of inertia × angular acceleration)",
        "τ = p·A",
        "τ = V·I",
      ],
      answer: 1,
    },
    // — Electronics —
    {
      id: "phys-el-1",
      domain: "electronics",
      q: "The magnetic reed sensors (1B1, 2B2, …) on the cylinders detect:",
      options: [
        "Air pressure inside the line",
        "The end-of-stroke position of the piston (via its magnet)",
        "The temperature of the cylinder",
        "The rotational speed of the drill",
      ],
      answer: 1,
    },
    {
      id: "phys-el-2",
      domain: "electronics",
      q: "What is the key difference between the digital vacuum switch 6P1 and the analogue pressure sensor BP?",
      options: [
        "There is none — both output a yes/no signal",
        "6P1 answers yes/no (gripped?), BP reports how much pressure as a continuous value",
        "BP is digital and 6P1 is analogue",
        "Both report a continuous 4–20 mA current",
      ],
      answer: 1,
    },
    // — Electrical —
    {
      id: "phys-ec-1",
      domain: "electrical",
      q: "The S7-1200 PLC runs a fixed scan cycle. What is its correct order?",
      options: [
        "Write outputs → read inputs → solve logic",
        "Read inputs → solve ladder logic → write outputs → repeat",
        "Solve logic → write outputs → never read inputs again",
        "It reacts instantly with no repeating cycle",
      ],
      answer: 1,
    },
    {
      id: "phys-ec-2",
      domain: "electrical",
      q: "A PLC output sources only a small current, yet it drives a solenoid/relay. What principle bridges the gap?",
      options: [
        "Electromagnetic amplification — a small coil current switches a much larger load",
        "Nuclear decay",
        "Bernoulli's principle",
        "Simple resistive heating",
      ],
      answer: 0,
    },
  ],
  simulation: [
    {
      id: "sim-1",
      q: "A 5/2-way double-solenoid valve is bistable. What does that mean for the cylinder it drives?",
      options: [
        "It needs constant power to hold a position",
        "It remembers its last commanded position even after the coil is de-energised",
        "It can only ever extend",
        "It vents both cylinder ports at once",
      ],
      answer: 1,
    },
    {
      id: "sim-2",
      q: "In the step-displacement diagram, a step only advances when…",
      options: [
        "A fixed timer expires regardless of motion",
        "The end-position sensor confirms the move actually completed",
        "The operator presses Start again",
        "Air pressure drops below 4 bar",
      ],
      answer: 1,
    },
  ],
  sfc: [
    {
      id: "sfc-1",
      q: "How does the vacuum generator create suction with no moving pump?",
      options: [
        "It heats the air to expand it",
        "A venturi accelerates compressed air, dropping static pressure (Bernoulli)",
        "It uses a magnet to attract the part",
        "It freezes the part to the cup",
      ],
      answer: 1,
    },
    {
      id: "sfc-2",
      q: "Why does the twin-rod cylinder use two parallel rods for the pick & place head?",
      options: [
        "To double the speed",
        "To resist the bending moment from off-axis load and keep the cup square",
        "Purely for decoration",
        "To carry electrical signals",
      ],
      answer: 1,
    },
  ],
  plc: [
    {
      id: "plc-1",
      q: "In the IO list, Q0.0 (1Y1) is an output coil. Energising it does what?",
      options: [
        "Reads the start button",
        "Switches the solenoid that extends the rotary indexing table 1A",
        "Measures line pressure",
        "Turns off the PLC",
      ],
      answer: 1,
    },
    {
      id: "plc-2",
      q: "A ladder-logic rung reads left-to-right as:",
      options: [
        "Output coils on the left, input contacts on the right",
        "Input/condition contacts in series/parallel on the left, the output coil on the right",
        "Only timers, never contacts",
        "A wiring diagram of the 230 V mains",
      ],
      answer: 1,
    },
  ],
};

export function quizCount() {
  return Object.values(QUIZZES).reduce((n, arr) => n + arr.length, 0);
}
