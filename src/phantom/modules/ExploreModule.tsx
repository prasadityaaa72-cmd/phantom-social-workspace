import { useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Compass, Heart, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPLORE_ITEMS } from "../data/explore";
import { filterExplore } from "../lib/explore-filter";
import { compact } from "../lib/format";
import { useWorkspace } from "../state/workspace";
import { EXPLORE_CATEGORIES, type ExploreItem } from "../types";
import { Avatar, EmptyState, IconButton, MediaTile, PhButton, SampleTag } from "../ui/primitives";

function Preview({ item, onClose }: { item: ExploreItem | null; onClose: () => void }) {
  const ws = useWorkspace();
  return (
    <DialogPrimitive.Root open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-chrome/70 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        {item && (
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[min(52rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border border-border bg-popover shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 md:flex-row"
          >
            <div className="min-h-0 bg-chrome md:w-3/5">
              <MediaTile media={{ ...item.media, ratio: "square" }} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2 border-b border-line p-3">
                <Avatar creator={item.creator} size={28} />
                <div className="min-w-0 flex-1">
                  <DialogPrimitive.Title className="truncate font-mono text-ui text-foreground">@{item.creator.handle}</DialogPrimitive.Title>
                  <p className="text-micro text-muted-foreground">{item.creator.name}</p>
                </div>
                <DialogPrimitive.Close asChild>
                  <IconButton label="Close preview">
                    <X />
                  </IconButton>
                </DialogPrimitive.Close>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-ui font-medium text-foreground">{item.title}</h3>
                  <SampleTag />
                </div>
                <p className="text-micro text-muted-foreground">
                  Sample discovery item in <span className="font-mono text-foreground">{item.category}</span>.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        ws.setExploreQuery(`#${t}`);
                        ws.setExploreCategory("all");
                        onClose();
                      }}
                      className="rounded-sm border border-border px-1.5 font-mono text-micro text-primary hover:bg-hover"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
                <dl className="grid grid-cols-2 gap-2 font-mono text-micro">
                  <div className="rounded-sm border border-border bg-surface p-2">
                    <dt className="text-muted-foreground">likes</dt>
                    <dd className="text-foreground">{compact(item.likes)}</dd>
                  </div>
                  <div className="rounded-sm border border-border bg-surface p-2">
                    <dt className="text-muted-foreground">id</dt>
                    <dd className="text-foreground">{item.id}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex gap-2 border-t border-line p-3">
                <PhButton
                  variant="primary"
                  onClick={() => {
                    ws.setExploreCategory(item.category);
                    ws.setExploreQuery("");
                    ws.log("explore", `Filtered to category "${item.category}" from ${item.id}`, "info");
                    onClose();
                  }}
                >
                  More in {item.category}
                </PhButton>
                <DialogPrimitive.Close asChild>
                  <PhButton>Close</PhButton>
                </DialogPrimitive.Close>
              </div>
            </div>
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function ExploreModule() {
  const ws = useWorkspace();
  const [preview, setPreview] = useState<ExploreItem | null>(null);
  const results = useMemo(
    () => filterExplore(EXPLORE_ITEMS, ws.exploreQuery, ws.exploreCategory),
    [ws.exploreQuery, ws.exploreCategory],
  );
  const filtered = ws.exploreQuery.trim() !== "" || ws.exploreCategory !== "all";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-2 border-b border-line px-3 py-2">
        <div className="flex items-center gap-2">
          <label className="flex h-8 max-w-xl flex-1 items-center gap-2 rounded-sm border border-border bg-panel px-2.5 focus-within:border-primary">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              value={ws.exploreQuery}
              onChange={(e) => ws.setExploreQuery(e.target.value)}
              placeholder="Search sample content, @handles or #tags"
              aria-label="Search explore"
              className="h-full flex-1 bg-transparent font-mono text-micro text-foreground outline-none placeholder:text-muted-foreground"
            />
            {ws.exploreQuery && (
              <button type="button" onClick={() => ws.setExploreQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </label>
          <span className="ml-auto shrink-0 font-mono text-micro text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        </div>
        <div role="radiogroup" aria-label="Category" className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(["all", ...EXPLORE_CATEGORIES] as const).map((cat) => {
            const active = ws.exploreCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => ws.setExploreCategory(cat)}
                className={cn(
                  "h-6 shrink-0 rounded-sm border px-2.5 font-mono text-micro transition-colors",
                  active ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:bg-hover hover:text-foreground",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {results.length === 0 ? (
          <EmptyState
            icon={<Compass />}
            title="No sample content matches"
            action={
              <PhButton
                onClick={() => {
                  ws.setExploreQuery("");
                  ws.setExploreCategory("all");
                }}
              >
                Clear search & filters
              </PhButton>
            }
          >
            Try a different keyword, like “fog”, “#ceramics” or “@byte.garden”.
          </EmptyState>
        ) : (
          <ul className="grid grid-cols-2 gap-(--gap) sm:grid-cols-3 xl:grid-cols-4" aria-label="Explore results">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setPreview(item)}
                  className="group block w-full overflow-hidden rounded-md border border-border bg-surface text-left transition-colors hover:border-primary/60"
                >
                  <MediaTile media={{ ...item.media, ratio: "square" }} showLabel={false}>
                    <span className="absolute inset-0 flex items-end bg-chrome/0 p-2 opacity-0 transition-opacity group-hover:bg-chrome/40 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="flex items-center gap-1 rounded-sm bg-chrome/85 px-1.5 py-0.5 font-mono text-micro text-foreground">
                        <Heart className="size-3" aria-hidden /> {compact(item.likes)}
                      </span>
                    </span>
                  </MediaTile>
                  <span className="block space-y-0.5 p-2">
                    <span className="block truncate text-micro font-medium text-foreground">{item.title}</span>
                    <span className="flex items-center justify-between gap-2 font-mono text-[0.625rem] text-muted-foreground">
                      <span className="truncate">@{item.creator.handle}</span>
                      <span className="shrink-0">{item.category}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {filtered && results.length > 0 && (
          <div className="pt-4 text-center">
            <PhButton
              variant="ghost"
              onClick={() => {
                ws.setExploreQuery("");
                ws.setExploreCategory("all");
              }}
            >
              Reset filters
            </PhButton>
          </div>
        )}
      </div>
      <Preview item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
