import { CircleAlert, GitBranch, PlugZap, Radio } from "lucide-react";
import { MODULE_BY_ID } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import type { ThemeId } from "../types";

const THEME_ORDER: ThemeId[] = ["phantom", "midnight", "graphite", "daylight"];
const THEME_LABEL: Record<ThemeId, string> = {
  phantom: "Phantom Dark",
  midnight: "Midnight",
  graphite: "Graphite",
  daylight: "Daylight",
};

function SbButton({
  children,
  onClick,
  label,
  className = "flex",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`${className} h-full items-center gap-1 px-2 transition-colors hover:bg-statusbar-foreground/15 [&_svg]:size-3`}
    >
      {children}
    </button>
  );
}

export function StatusBar() {
  const ws = useWorkspace();
  const nextTheme = THEME_ORDER[(THEME_ORDER.indexOf(ws.settings.theme) + 1) % THEME_ORDER.length]!;
  return (
    <footer className="flex h-6 shrink-0 items-stretch overflow-hidden whitespace-nowrap bg-statusbar font-mono text-[0.6875rem] text-statusbar-foreground select-none">
      <span className="flex items-center gap-1 bg-statusbar-foreground/15 px-2.5">
        <Radio className="size-3" aria-hidden />
        DEMO<span className="hidden sm:inline">&nbsp;MODE</span>
      </span>
      <span className="hidden items-center gap-1 px-2 sm:flex">
        <GitBranch className="size-3" aria-hidden />
        sample-data
      </span>
      <SbButton
        label="Instagram not connected — view integration status"
        onClick={() => {
          ws.openModule("settings");
          ws.setSettingsSection("integrations");
        }}
      >
        <PlugZap />
        <span className="hidden md:inline">Instagram: not connected (demo)</span>
        <span className="md:hidden">offline</span>
      </SbButton>
      <SbButton label="Show problems" onClick={() => ws.showTerminalTab("problems")}>
        <CircleAlert />0<span className="hidden sm:inline">&nbsp;· 2 info</span>
      </SbButton>

      <div className="ml-auto flex items-stretch">
        {ws.activeTab && <span className="hidden items-center px-2 lg:flex">{MODULE_BY_ID[ws.activeTab].file}</span>}
        <SbButton
          label={`Switch to ${ws.settings.density === "compact" ? "comfortable" : "compact"} density`}
          onClick={() => ws.updateSettings({ density: ws.settings.density === "compact" ? "comfortable" : "compact" })}
          className="hidden sm:flex"
        >
          {ws.settings.density}
        </SbButton>
        <SbButton label={`Theme: ${THEME_LABEL[ws.settings.theme]} — click for ${THEME_LABEL[nextTheme]}`} onClick={() => ws.updateSettings({ theme: nextTheme })} className="hidden sm:flex">
          {THEME_LABEL[ws.settings.theme]}
        </SbButton>
        <SbButton label="Open command palette" onClick={() => ws.setPaletteOpen(true)}>
          ⌘K
        </SbButton>
      </div>
    </footer>
  );
}

export { THEME_LABEL };
