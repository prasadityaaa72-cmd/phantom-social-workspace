import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  Ban,
  Brush,
  ChevronRight,
  PanelBottom,
  PanelLeft,
  PlugZap,
  Rows2,
  Search,
  SquareTerminal,
  X,
  XSquare,
  type LucideIcon,
} from "lucide-react";
import { MODULES } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import type { AccentId, TerminalTab, ThemeId } from "../types";
import { THEME_LABEL } from "./StatusBar";

interface PaletteCommand {
  id: string;
  group: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  keywords?: string[];
  run: () => void;
}

export function CommandPalette() {
  const ws = useWorkspace();

  const commands: PaletteCommand[] = [
    ...MODULES.map((m) => ({
      id: `go-${m.id}`,
      group: "Go to module",
      label: `Open ${m.label}`,
      icon: m.icon,
      shortcut: m.shortcut,
      keywords: [m.file, m.description],
      run: () => ws.openModule(m.id),
    })),
    {
      id: "toggle-sidebar",
      group: "View",
      label: ws.sidebarOpen ? "Hide sidebar" : "Show sidebar",
      icon: PanelLeft,
      shortcut: "Ctrl+B",
      run: ws.toggleSidebar,
    },
    {
      id: "toggle-terminal",
      group: "View",
      label: ws.terminalOpen ? "Collapse panel" : "Expand panel",
      icon: PanelBottom,
      shortcut: "Ctrl+`",
      keywords: ["terminal", "output"],
      run: ws.toggleTerminal,
    },
    ...(["output", "connections", "log", "problems"] as TerminalTab[]).map((t) => ({
      id: `panel-${t}`,
      group: "View",
      label: `Panel: show ${t}`,
      icon: SquareTerminal,
      keywords: ["terminal"],
      run: () => ws.showTerminalTab(t),
    })),
    {
      id: "density",
      group: "Appearance",
      label: `Switch to ${ws.settings.density === "compact" ? "comfortable" : "compact"} density`,
      icon: Rows2,
      run: () => ws.updateSettings({ density: ws.settings.density === "compact" ? "comfortable" : "compact" }),
    },
    ...(Object.keys(THEME_LABEL) as ThemeId[]).map((t) => ({
      id: `theme-${t}`,
      group: "Appearance",
      label: `Theme: ${THEME_LABEL[t]}${ws.settings.theme === t ? " (current)" : ""}`,
      icon: Brush,
      keywords: ["color theme"],
      run: () => ws.updateSettings({ theme: t }),
    })),
    ...(["blue", "violet", "cyan", "amber"] as AccentId[]).map((a) => ({
      id: `accent-${a}`,
      group: "Appearance",
      label: `Accent: ${a}${ws.settings.accent === a ? " (current)" : ""}`,
      icon: Brush,
      run: () => ws.updateSettings({ accent: a }),
    })),
    {
      id: "integrations",
      group: "Workspace",
      label: "View integration status",
      icon: PlugZap,
      keywords: ["instagram", "api", "connect"],
      run: () => {
        ws.openModule("settings");
        ws.setSettingsSection("integrations");
      },
    },
    ...(ws.activeTab
      ? [
          {
            id: "close-tab",
            group: "Workspace",
            label: "Close active tab",
            icon: X,
            shortcut: "Alt+W",
            run: () => ws.activeTab && ws.closeTab(ws.activeTab),
          },
        ]
      : []),
    ...(ws.openTabs.length
      ? [{ id: "close-all", group: "Workspace", label: "Close all tabs", icon: XSquare, run: ws.closeAllTabs }]
      : []),
    { id: "clear-log", group: "Workspace", label: "Clear demo log", icon: Ban, run: ws.clearLogs },
  ];

  const groups = Array.from(new Set(commands.map((c) => c.group)));

  return (
    <DialogPrimitive.Root open={ws.paletteOpen} onOpenChange={ws.setPaletteOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-chrome/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[10%] z-50 w-[min(36rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <Command loop className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-border px-3">
              <ChevronRight className="size-4 text-primary" aria-hidden />
              <Command.Input
                autoFocus
                placeholder="Type a command or module name…"
                className="h-10 flex-1 bg-transparent font-mono text-ui text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Search className="size-3.5 text-muted-foreground" aria-hidden />
            </div>
            <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto p-1">
              <Command.Empty className="px-3 py-8 text-center font-mono text-micro text-muted-foreground">
                No matching commands.
              </Command.Empty>
              {groups.map((g) => (
                <Command.Group
                  key={g}
                  heading={g}
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.625rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {commands
                    .filter((c) => c.group === g)
                    .map((c) => (
                      <Command.Item
                        key={c.id}
                        value={`${c.group} ${c.label}`}
                        keywords={c.keywords ?? []}
                        onSelect={() => {
                          ws.setPaletteOpen(false);
                          c.run();
                        }}
                        className="flex h-8 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-ui text-foreground/90 data-[selected=true]:bg-selection data-[selected=true]:text-foreground"
                      >
                        <c.icon className="size-3.5 text-muted-foreground" aria-hidden />
                        {c.label}
                        {c.shortcut && <span className="ml-auto font-mono text-[0.625rem] text-muted-foreground">{c.shortcut}</span>}
                      </Command.Item>
                    ))}
                </Command.Group>
              ))}
            </Command.List>
            <div className="flex items-center gap-3 border-t border-border px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ run</span>
              <span>esc close</span>
              <span className="ml-auto">commands only affect this demo UI</span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
