import { describe, expect, it } from "vitest";
import { EXPLORE_ITEMS } from "../data/explore";
import { filterExplore } from "./explore-filter";

describe("filterExplore", () => {
  it("returns every sample item with no query and 'all' category", () => {
    expect(filterExplore(EXPLORE_ITEMS, "", "all")).toHaveLength(EXPLORE_ITEMS.length);
  });

  it("limits results to the chosen category", () => {
    const food = filterExplore(EXPLORE_ITEMS, "", "food");
    expect(food.length).toBe(3);
    expect(food.every((i) => i.category === "food")).toBe(true);
  });

  it("matches handles and #tags case-insensitively", () => {
    expect(filterExplore(EXPLORE_ITEMS, "BYTE.garden", "all").map((i) => i.id)).toEqual([
      "ex_007",
      "ex_011",
      "ex_021",
    ]);
    expect(filterExplore(EXPLORE_ITEMS, "#fog", "all").map((i) => i.id)).toEqual(["ex_004", "ex_023"]);
  });

  it("combines query and category", () => {
    expect(filterExplore(EXPLORE_ITEMS, "night", "travel").map((i) => i.id)).toEqual(["ex_006", "ex_024"]);
    expect(filterExplore(EXPLORE_ITEMS, "night", "food")).toEqual([]);
  });
});
