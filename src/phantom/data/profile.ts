import type { MediaSpec } from "../types";
import { SAMPLE_ME } from "./creators";

// Sample profile shown while no official account integration exists.
export const SAMPLE_PROFILE = {
  creator: SAMPLE_ME,
  bio: "Designer & tinkerer. This is a sample profile used to preview the Phantom workspace layout.",
  website: "phantom.example/sample",
  stats: { posts: 128, followers: 4820, following: 312 },
  grid: Array.from({ length: 12 }, (_, i) => ({
    id: `pg_${i + 1}`,
    likes: 90 + ((i * 3571) % 1400),
    media: {
      hue: (265 + i * 31) % 360,
      pattern: ((i * 3) % 4) as MediaSpec["pattern"],
      ratio: "square",
      label: `SMP_${String(i + 1).padStart(3, "0")}`,
    } satisfies MediaSpec,
  })),
};
