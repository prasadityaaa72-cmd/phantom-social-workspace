import { Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import { Hint } from "../ui/primitives";

export function ActivityRail() {
  const ws = useWorkspace();
  const unread = ws.conversations.reduce((n, c) => n + c.unread, 0);
  const main = MODULES.filter((m) => m.id !== "settings");
  const settings = MODULES.find((m) => m.id === "settings")!;

  const railButton = (m: (typeof MODULES)[number], badge?: number) => {
    const active = ws.activeTab === m.id;
    return (
      <Hint key={m.id} label={`${m.label} · ${m.shortcut}`} side="right">
        <button
          type="button"
          aria-label={m.label}
          aria-current={active ? "page" : undefined}
          onClick={() => {
            if (active) ws.toggleSidebar();
            else ws.openModule(m.id);
          }}
          className={cn(
            "relative flex h-11 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
            active && "rail-active text-foreground",
          )}
        >
          <m.icon className="size-5" strokeWidth={1.6} />
          {!!badge && (
            <span className="absolute right-2 top-2 flex min-w-3.5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[0.5625rem] leading-3.5 text-primary-foreground">
              {badge}
            </span>
          )}
        </button>
      </Hint>
    );
  };

  return (
    <nav aria-label="Modules" className="flex w-12 shrink-0 flex-col items-center justify-between border-r border-border bg-chrome">
      <div className="flex flex-col">{main.map((m) => railButton(m, m.id === "inbox" ? unread : undefined))}</div>
      <div className="flex flex-col pb-1">
        <Hint label="Command palette · Ctrl/Cmd+K" side="right">
          <button
            type="button"
            aria-label="Open command palette"
            onClick={() => ws.setPaletteOpen(true)}
            className="flex h-11 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Command className="size-5" strokeWidth={1.6} />
          </button>
        </Hint>
        {railButton(settings)}
      </div>
    </nav>
  );
}
