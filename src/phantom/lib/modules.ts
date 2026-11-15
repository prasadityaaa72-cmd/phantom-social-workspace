import { CircleUser, Compass, MessagesSquare, Rows3, Settings2, type LucideIcon } from "lucide-react";
import type { ModuleId } from "../types";

export interface ModuleMeta {
  id: ModuleId;
  label: string;
  file: string;
  icon: LucideIcon;
  shortcut: string;
  description: string;
}

export const MODULES: ModuleMeta[] = [
  { id: "feed", label: "Feed", file: "feed.timeline", icon: Rows3, shortcut: "Alt+1", description: "Sample post timeline" },
  { id: "inbox", label: "Inbox", file: "inbox.messages", icon: MessagesSquare, shortcut: "Alt+2", description: "Sample conversations" },
  { id: "explore", label: "Explore", file: "explore.search", icon: Compass, shortcut: "Alt+3", description: "Search & discover sample content" },
  { id: "profile", label: "Profile", file: "profile.sample", icon: CircleUser, shortcut: "Alt+4", description: "Sample profile & connection state" },
  { id: "settings", label: "Settings", file: "settings.json", icon: Settings2, shortcut: "Alt+5", description: "Appearance, shortcuts, integrations" },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const SHORTCUTS: Array<{ keys: string; action: string }> = [
  { keys: "Ctrl/Cmd + K", action: "Open command palette" },
  { keys: "Ctrl/Cmd + B", action: "Toggle sidebar" },
  { keys: "Ctrl + `", action: "Toggle terminal panel" },
  { keys: "Alt + 1 … 5", action: "Open Feed / Inbox / Explore / Profile / Settings" },
  { keys: "Alt + W", action: "Close active tab" },
  { keys: "Enter", action: "Send demo message (Inbox composer)" },
  { keys: "Double-click media", action: "Like a sample post (local only)" },
  { keys: "Esc", action: "Close palette / dialogs" },
];
