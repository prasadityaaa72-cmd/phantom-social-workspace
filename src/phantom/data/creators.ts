import type { Creator } from "../types";

// Fictional handles for demo purposes only — not real accounts.
export const CREATORS = {
  atelier: { handle: "atelier.nord", name: "Atelier Nord", hue: 230 },
  kiln: { handle: "kiln_and_clay", name: "Kiln & Clay", hue: 35 },
  signal: { handle: "signal.kitchen", name: "Signal Kitchen", hue: 20 },
  field: { handle: "fieldnotes.co", name: "Field Notes Co.", hue: 140 },
  mono: { handle: "mono.trail", name: "Mono Trail", hue: 190 },
  loop: { handle: "loop.studio", name: "Loop Studio", hue: 300 },
  harbor: { handle: "harbor.frames", name: "Harbor Frames", hue: 255 },
  ridge: { handle: "ridge.runner", name: "Ridge Runner", hue: 95 },
  byte: { handle: "byte.garden", name: "Byte Garden", hue: 165 },
  vinyl: { handle: "vinyl.hours", name: "Vinyl Hours", hue: 330 },
} satisfies Record<string, Creator>;

export const SAMPLE_ME: Creator = { handle: "phantom.sample", name: "Sample Creator", hue: 265 };
