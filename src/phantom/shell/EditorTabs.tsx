import { ChevronRight, Plus, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MODULES, MODULE_BY_ID } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import { Hint, IconButton, SampleTag } from "../ui/primitives";

export function EditorTabs() {
  const ws = useWorkspace();
  return (
    <div className="flex h-9 shrink-0 items-stretch border-b border-border bg-panel">
      <div role="tablist" aria-label="Open editors" className="flex min-w-0 items-stretch overflow-x-auto">
        {ws.openTabs.map((id) => {
          const m = MODULE_BY_ID[id];
          const active = ws.activeTab === id;
          return (
            <div
              key={id}
              className={cn(
                "group flex shrink-0 items-center border-r border-border text-micro",
                active ? "tab-active bg-background text-foreground" : "text-muted-foreground hover:bg-hover/60",
              )}
              onAuxClick={(e) => {
                if (e.button === 1) ws.closeTab(id);
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => ws.setActiveTab(id)}
                className="flex h-full items-center gap-1.5 pl-3 pr-1 font-mono"
              >
                <m.icon className={cn("size-3.5", active ? "text-primary" : "")} aria-hidden />
                {m.file}
              </button>
              <button
                type="button"
                aria-label={`Close ${m.file}`}
                onClick={() => ws.closeTab(id)}
                className={cn(
                  "mr-1 flex size-5 items-center justify-center rounded-sm transition-opacity hover:bg-hover",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                )}
              >
                <X className="size-3" />
              </button>
            </div>
          );
        })}
      </div>
      <DropdownMenu>
        <Hint label="Open a module in a new tab">
          <DropdownMenuTrigger asChild>
            <IconButton label="Open module in new tab" className="m-1">
              <Plus />
            </IconButton>
          </DropdownMenuTrigger>
        </Hint>
        <DropdownMenuContent align="start" className="w-60 rounded-sm border-border bg-popover p-1">
          <DropdownMenuLabel className="font-mono text-micro font-normal text-muted-foreground">open editor</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MODULES.map((m) => (
            <DropdownMenuItem key={m.id} onSelect={() => ws.openModule(m.id)} className="gap-2 rounded-sm text-micro">
              <m.icon className="size-3.5" />
              <span className="font-mono">{m.file}</span>
              <span className="ml-auto font-mono text-[0.625rem] text-muted-foreground">
                {ws.openTabs.includes(m.id) ? "open" : m.shortcut}
              </span>
            </DropdownMenuItem>
          ))}
          {ws.openTabs.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={ws.closeAllTabs} className="rounded-sm text-micro">
                Close all editors
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex-1" />
    </div>
  );
}

export function Breadcrumbs() {
  const ws = useWorkspace();
  if (!ws.activeTab) return null;
  const m = MODULE_BY_ID[ws.activeTab];
  return (
    <div className="flex h-6 shrink-0 items-center gap-1 border-b border-line bg-background px-3 font-mono text-micro text-muted-foreground">
      <span className="hidden sm:inline">phantom-workspace</span>
      <ChevronRight className="hidden size-3 sm:inline" aria-hidden />
      <span className="hidden sm:inline">social</span>
      <ChevronRight className="hidden size-3 sm:inline" aria-hidden />
      <span className="text-foreground">{m.file}</span>
      <span className="ml-auto flex items-center gap-2">
        <span className="hidden md:inline">{m.description}</span>
        <SampleTag>demo data</SampleTag>
      </span>
    </div>
  );
}
