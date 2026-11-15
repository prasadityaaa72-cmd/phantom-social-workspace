import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { MODULES } from "../lib/modules";
import { ExploreModule } from "../modules/ExploreModule";
import { FeedModule } from "../modules/FeedModule";
import { InboxModule } from "../modules/InboxModule";
import { ProfileModule } from "../modules/ProfileModule";
import { SettingsModule } from "../modules/SettingsModule";
import { useWorkspace, WorkspaceProvider } from "../state/workspace";
import type { ModuleId } from "../types";
import { ActivityRail } from "./ActivityRail";
import { CommandPalette } from "./CommandPalette";
import { Breadcrumbs, EditorTabs } from "./EditorTabs";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { TerminalPanel } from "./TerminalPanel";
import { TitleBar } from "./TitleBar";
import { Welcome } from "./Welcome";

const MODULE_VIEWS: Record<ModuleId, () => React.ReactNode> = {
  feed: FeedModule,
  inbox: InboxModule,
  explore: ExploreModule,
  profile: ProfileModule,
  settings: SettingsModule,
};

function useShortcuts() {
  const ws = useWorkspace();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ws.setPaletteOpen(!ws.paletteOpen);
        return;
      }
      if (ws.paletteOpen) return;
      if (mod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        ws.toggleSidebar();
      } else if (e.ctrlKey && (e.key === "`" || e.code === "Backquote")) {
        e.preventDefault();
        ws.toggleTerminal();
      } else if (e.altKey && !mod && /^Digit[1-5]$/.test(e.code)) {
        e.preventDefault();
        ws.openModule(MODULES[Number(e.code.slice(5)) - 1]!.id);
      } else if (e.altKey && !mod && e.code === "KeyW" && ws.activeTab) {
        e.preventDefault();
        ws.closeTab(ws.activeTab);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ws]);
}

function Workbench() {
  const ws = useWorkspace();
  const isMobile = useIsMobile();
  useShortcuts();

  // On small screens start with panels tucked away; the user can reopen them.
  useEffect(() => {
    if (isMobile) {
      ws.setSidebarOpen(false);
      ws.setTerminalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const View = ws.activeTab ? MODULE_VIEWS[ws.activeTab] : null;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <ActivityRail />
        {ws.sidebarOpen && (
          <>
            {isMobile && (
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => ws.setSidebarOpen(false)}
                className="fixed inset-0 z-30 bg-chrome/50"
              />
            )}
            <Sidebar overlay={isMobile} />
          </>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex min-h-0 flex-1 flex-col" aria-label="Editor">
            <EditorTabs />
            <Breadcrumbs />
            <div className="min-h-0 flex-1 overflow-hidden">{View ? <View /> : <Welcome />}</div>
          </main>
          <TerminalPanel compact={isMobile} />
        </div>
      </div>
      {ws.settings.showStatusBar && <StatusBar />}
      <CommandPalette />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "!rounded-md !border-border !bg-popover !text-popover-foreground !font-sans",
            description: "!text-muted-foreground !font-mono",
          },
        }}
      />
    </div>
  );
}

export function PhantomApp() {
  return (
    <WorkspaceProvider>
      <TooltipProvider delayDuration={350}>
        <Workbench />
      </TooltipProvider>
    </WorkspaceProvider>
  );
}
