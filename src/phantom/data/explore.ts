import type { ExploreCategory, ExploreItem, MediaSpec } from "../types";
import { CREATORS as C } from "./creators";

const SEED: Array<[string, keyof typeof C, ExploreCategory, string[]]> = [
  ["Brutalist poster series", "atelier", "design", ["poster", "type"]],
  ["Wood-fired bowls", "kiln", "design", ["ceramics"]],
  ["Miso caramel tart", "signal", "food", ["dessert", "baking"]],
  ["Coastal ridge loop", "mono", "outdoors", ["trail", "fog"]],
  ["Kinetic type loop", "loop", "design", ["motion", "type"]],
  ["Night market stalls", "harbor", "travel", ["street", "night"]],
  ["Tiny home lab rack", "byte", "tech", ["homelab", "setup"]],
  ["B-side Sunday dig", "vinyl", "music", ["vinyl", "crate"]],
  ["Alpine hut at dawn", "ridge", "outdoors", ["alpine", "hut"]],
  ["Film grain test roll", "harbor", "photo", ["film", "35mm"]],
  ["Split keyboard build", "byte", "tech", ["keyboard", "diy"]],
  ["Fermentation shelf", "signal", "food", ["ferment"]],
  ["Old town rooftops", "harbor", "travel", ["city", "rooftops"]],
  ["Field recording kit", "vinyl", "music", ["audio", "field"]],
  ["Notebook layouts", "field", "design", ["stationery", "grid"]],
  ["Desert road trip", "mono", "travel", ["road", "desert"]],
  ["Ramen broth, 18h", "signal", "food", ["ramen"]],
  ["Lake swim, 9°C", "ridge", "outdoors", ["coldwater"]],
  ["Synth patch notes", "loop", "music", ["synth", "modular"]],
  ["Studio portrait light", "atelier", "photo", ["portrait", "light"]],
  ["E-ink dashboard", "byte", "tech", ["e-ink", "dashboard"]],
  ["Glaze test tiles", "kiln", "design", ["ceramics", "color"]],
  ["Harbour fog panorama", "harbor", "photo", ["panorama", "fog"]],
  ["Night train window", "mono", "travel", ["train", "night"]],
];

const RATIOS: MediaSpec["ratio"][] = ["square", "portrait", "square", "landscape"];

export const EXPLORE_ITEMS: ExploreItem[] = SEED.map(([title, key, category, tags], i) => ({
  id: `ex_${String(i + 1).padStart(3, "0")}`,
  title,
  creator: C[key],
  category,
  tags,
  likes: 180 + ((i * 7919) % 4800),
  media: {
    hue: (C[key].hue + i * 23) % 360,
    pattern: (i % 4) as MediaSpec["pattern"],
    ratio: RATIOS[i % RATIOS.length] ?? "square",
    label: `EXP_${String(i + 1).padStart(4, "0")}`,
  },
}));
