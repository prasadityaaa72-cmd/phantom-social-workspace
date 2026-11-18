import { Minus, PanelBottom, PanelLeft, Search, Square, X } from "lucide-react";
import { AuthControl } from "./AuthControl";
import { useWorkspace } from "../state/workspace";
import { Hint, HintIconButton, Kbd, PhantomLogo } from "../ui/primitives";

export function TitleBar() {
  const ws = useWorkspace();
  return (
    <header className="flex h-9 shrink-0 items-center gap-2 border-b border-border bg-chrome pl-3 pr-1 select-none">
      <div className="flex min-w-0 items-center gap-2">
        <PhantomLogo className="size-[1.125rem] shrink-0" />
        <span className="font-mono text-micro font-semibold tracking-[0.18em] text-foreground">
          <span className="hidden sm:inline">PROJECT&nbsp;</span>PHANTOM
        </span>
        <span className="hidden items-center gap-1 rounded-sm border border-border px-1.5 font-mono text-[0.625rem] text-muted-foreground lg:inline-flex">
          <span className="size-1.5 rounded-full bg-violet" aria-hidden />
          phantom-workspace · demo
        </span>
      </div>

      <div className="flex flex-1 justify-center px-2">
        <button
          type="button"
          onClick={() => ws.setPaletteOpen(true)}
          className="group flex h-6 w-full max-w-md items-center gap-2 rounded-sm border border-border bg-panel px-2 text-micro text-muted-foreground transition-colors hover:border-input hover:bg-surface hover:text-foreground"
          aria-label="Open command palette"
        >
          <Search className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate sm:hidden">Search</span>
          <span className="hidden truncate sm:inline">Search modules and commands</span>
          <Kbd className="ml-auto hidden sm:inline-flex">Ctrl K</Kbd>
        </button>
      </div>

      <div className="flex items-center">
        <AuthControl />
        <HintIconButton
          label={ws.sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          hint="Toggle sidebar · Ctrl/Cmd+B"
          active={ws.sidebarOpen}
          onClick={ws.toggleSidebar}
        >
          <PanelLeft />
        </HintIconButton>
        <HintIconButton
          label={ws.terminalOpen ? "Hide panel" : "Show panel"}
          hint="Toggle panel · Ctrl+`"
          active={ws.terminalOpen}
          onClick={ws.toggleTerminal}
        >
          <PanelBottom />
        </HintIconButton>
        <Hint label="Window controls are visual only in this browser prototype">
          <div className="ml-1 hidden items-center text-muted-foreground/60 sm:flex" aria-label="Window controls (visual only)">
            <span className="flex h-9 w-10 items-center justify-center" aria-hidden>
              <Minus className="size-3.5" />
            </span>
            <span className="flex h-9 w-10 items-center justify-center" aria-hidden>
              <Square className="size-3" />
            </span>
            <span className="flex h-9 w-10 items-center justify-center" aria-hidden>
              <X className="size-3.5" />
            </span>
          </div>
        </Hint>
      </div>
    </header>
  );
}
