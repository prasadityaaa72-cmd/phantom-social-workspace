import type { ExploreCategory, ExploreItem } from "../types";

/** Filters sample explore items by free-text query and category. */
export function filterExplore(
  items: ExploreItem[],
  query: string,
  category: ExploreCategory | "all",
): ExploreItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!q) return true;
    const haystack = [item.title, item.creator.handle, item.creator.name, item.category, ...item.tags]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((term) => haystack.includes(term.replace(/^#/, "")));
  });
}
