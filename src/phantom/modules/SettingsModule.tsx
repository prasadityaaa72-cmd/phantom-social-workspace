import type { CSSProperties } from "react";
import { Check, KeyRound, Palette, PlugZap, RotateCcw, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SHORTCUTS } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import type { AccentId, SettingsSection, ThemeId } from "../types";
import { DisabledAction, Kbd, PhButton, Segmented } from "../ui/primitives";

const THEMES: Array<{ id: ThemeId; label: string; note: string }> = [
  { id: "phantom", label: "Phantom Dark", note: "default charcoal" },
  { id: "midnight", label: "Midnight", note: "deep blue-black" },
  { id: "graphite", label: "Graphite", note: "neutral, higher contrast" },
  { id: "daylight", label: "Daylight", note: "light workspace" },
];

const ACCENTS: Array<{ id: AccentId; hue: number }> = [
  { id: "blue", hue: 258 },
  { id: "violet", hue: 295 },
  { id: "cyan", hue: 210 },
  { id: "amber", hue: 70 },
];

const SECTIONS: Array<{ id: SettingsSection; label: string; icon: typeof Palette }> = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "shortcuts", label: "Shortcuts", icon: KeyRound },
  { id: "integrations", label: "Integrations", icon: PlugZap },
];

function SettingRow({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-line py-(--pad) sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-micro text-foreground">{title}</p>
        <p className="text-micro text-muted-foreground">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Appearance() {
  const ws = useWorkspace();
  const s = ws.settings;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">workbench.colorTheme</h3>
        <div role="radiogroup" aria-label="Color theme" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={s.theme === t.id}
              onClick={() => ws.updateSettings({ theme: t.id })}
              className={cn(
                "overflow-hidden rounded-md border text-left transition-colors",
                s.theme === t.id ? "border-primary" : "border-border hover:border-input",
              )}
            >
              <span data-theme-preview={t.id} className="theme-preview flex h-14 gap-1 p-1.5">
                <span className="w-2 rounded-[2px] tp-chrome" />
                <span className="w-6 rounded-[2px] tp-panel" />
                <span className="flex flex-1 flex-col gap-1 rounded-[2px] p-1 tp-bg">
                  <span className="h-1 w-3/4 rounded-full tp-line" />
                  <span className="h-1 w-1/2 rounded-full bg-primary" />
                  <span className="h-1 w-2/3 rounded-full tp-line" />
                </span>
              </span>
              <span className="flex items-center justify-between gap-2 border-t border-border bg-surface px-2 py-1.5">
                <span>
                  <span className="block text-micro text-foreground">{t.label}</span>
                  <span className="block text-[0.625rem] text-muted-foreground">{t.note}</span>
                </span>
                {s.theme === t.id && <Check className="size-3.5 text-primary" aria-hidden />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">workbench.layout</h3>
        <SettingRow title="Accent color" desc="Used for focus, selection and active states.">
          <div role="radiogroup" aria-label="Accent color" className="flex gap-1.5">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={s.accent === a.id}
                aria-label={a.id}
                title={a.id}
                onClick={() => ws.updateSettings({ accent: a.id })}
                className={cn(
                  "hue-dot flex size-6 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow",
                  s.accent === a.id ? "ring-2 ring-foreground/70" : "hover:ring-1 hover:ring-border",
                )}
                style={{ "--h": a.hue } as CSSProperties}
              >
                {s.accent === a.id && <Check className="size-3 text-primary-foreground" aria-hidden />}
              </button>
            ))}
          </div>
        </SettingRow>
        <SettingRow title="Density" desc="Row height and spacing across panels.">
          <Segmented
            label="Density"
            value={s.density}
            onChange={(v) => ws.updateSettings({ density: v })}
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
            ]}
          />
        </SettingRow>
        <SettingRow title="UI scale" desc="Scales all text and controls.">
          <Segmented
            label="UI scale"
            value={s.fontScale}
            onChange={(v) => ws.updateSettings({ fontScale: v })}
            options={[
              { value: "sm", label: "90%" },
              { value: "md", label: "100%" },
              { value: "lg", label: "110%" },
            ]}
          />
        </SettingRow>
        <SettingRow title="Monospace captions" desc="Render feed captions in the code font.">
          <Switch checked={s.monoCaptions} onCheckedChange={(v) => ws.updateSettings({ monoCaptions: v })} aria-label="Monospace captions" />
        </SettingRow>
        <SettingRow title="Show status bar" desc="The strip at the bottom of the window.">
          <Switch checked={s.showStatusBar} onCheckedChange={(v) => ws.updateSettings({ showStatusBar: v })} aria-label="Show status bar" />
        </SettingRow>
        <SettingRow title="Reduce motion" desc="Turns off transitions and animations.">
          <Switch checked={s.reduceMotion} onCheckedChange={(v) => ws.updateSettings({ reduceMotion: v })} aria-label="Reduce motion" />
        </SettingRow>
      </div>

      <PhButton onClick={ws.resetSettings}>
        <RotateCcw /> Reset to defaults
      </PhButton>
    </div>
  );
}

function Shortcuts() {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-left">
        <thead className="bg-panel font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-normal">Keybinding</th>
            <th className="px-3 py-2 font-normal">Command</th>
          </tr>
        </thead>
        <tbody>
          {SHORTCUTS.map((s) => (
            <tr key={s.keys} className="border-t border-line text-micro hover:bg-hover/50">
              <td className="whitespace-nowrap px-3 py-2">
                <Kbd>{s.keys}</Kbd>
              </td>
              <td className="px-3 py-2 text-foreground/90">{s.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Integrations() {
  const items = [
    {
      name: "Instagram Graph API",
      desc: "Feed, profile and media via the official Meta developer platform.",
    },
    {
      name: "Instagram Messaging API",
      desc: "Official messaging for business and creator accounts.",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-micro text-foreground">
        <p className="mb-1 font-mono font-medium text-warning">Official API access is not configured</p>
        <p className="text-foreground/85">
          This is an interface prototype. Every post, message and profile shown is local sample data. Real account connections will only
          be added in a later phase through official, approved APIs.
        </p>
      </div>

      {items.map((i) => (
        <div key={i.name} className="flex flex-col gap-3 rounded-md border border-border bg-surface p-3 sm:flex-row sm:items-center">
          <PlugZap className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-mono text-ui text-foreground">{i.name}</p>
              <span className="inline-flex items-center gap-1 font-mono text-[0.625rem] text-warning">
                <span className="size-1.5 rounded-full bg-current" aria-hidden />
                not configured
              </span>
            </div>
            <p className="text-micro text-muted-foreground">{i.desc}</p>
          </div>
          <DisabledAction reason="Available in a later phase via official APIs only">Connect</DisabledAction>
        </div>
      ))}

      <div className="rounded-md border border-border bg-panel p-3">
        <p className="mb-2 flex items-center gap-1.5 font-mono text-micro text-success">
          <ShieldCheck className="size-3.5" aria-hidden />
          What this prototype never does
        </p>
        <ul className="list-inside list-disc space-y-1 text-micro text-muted-foreground">
          <li>Ask for, store or transmit social-media passwords or tokens</li>
          <li>Scrape websites or use unofficial APIs</li>
          <li>Send messages, post, like or follow on any real platform</li>
          <li>Track you, save data, or contact a server</li>
        </ul>
      </div>
    </div>
  );
}

export function SettingsModule() {
  const ws = useWorkspace();
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="tablist" aria-label="Settings sections" className="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={ws.settingsSection === s.id}
            onClick={() => ws.setSettingsSection(s.id)}
            className={cn(
              "-mb-px flex h-9 shrink-0 items-center gap-1.5 border-b px-2.5 text-micro text-muted-foreground hover:text-foreground",
              ws.settingsSection === s.id ? "border-primary text-foreground" : "border-transparent",
            )}
          >
            <s.icon className="size-3.5" aria-hidden />
            {s.label}
          </button>
        ))}
        <span className="ml-auto hidden items-center font-mono text-[0.625rem] text-muted-foreground sm:flex">
          changes apply instantly · not saved after reload
        </span>
      </div>
      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-5">
          {ws.settingsSection === "appearance" && <Appearance />}
          {ws.settingsSection === "shortcuts" && <Shortcuts />}
          {ws.settingsSection === "integrations" && <Integrations />}
        </div>
      </div>
    </div>
  );
}
