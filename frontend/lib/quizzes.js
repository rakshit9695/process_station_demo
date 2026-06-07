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
  physics: [
    {
      id: "phys-1",
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
      id: "phys-2",
      q: "The magnetic reed sensors (1B1, 2B2, …) on the cylinders detect:",
      options: [
        "Air pressure inside the line",
        "The end-of-stroke position of the piston (via its magnet)",
        "The temperature of the cylinder",
        "The rotational speed of the drill",
      ],
      answer: 1,
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
