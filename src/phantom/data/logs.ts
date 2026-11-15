import type { LogEntry } from "../types";

export const OUTPUT_LINES: Array<{ time: string; tag: string; text: string }> = [
  { time: "18:42:01", tag: "phantom", text: "Workspace initialised in DEMO MODE" },
  { time: "18:42:01", tag: "fixtures", text: "Loaded 8 sample posts · 6 sample conversations · 24 explore items" },
  { time: "18:42:01", tag: "fixtures", text: "Loaded sample profile @phantom.sample" },
  { time: "18:42:02", tag: "integrations", text: "Instagram Graph API: not configured (expected in prototype phase)" },
  { time: "18:42:02", tag: "integrations", text: "No credentials requested, stored or transmitted" },
  { time: "18:42:02", tag: "storage", text: "Persistence disabled · all state resets on reload" },
  { time: "18:42:02", tag: "phantom", text: "Ready. Press Ctrl/Cmd+K to open the command palette." },
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: "l0", time: "18:42:01", level: "info", source: "workspace", message: "Session started (demo)" },
  { id: "l1", time: "18:42:02", level: "info", source: "editor", message: "Opened feed.timeline, inbox.messages, explore.search" },
];

export const CONNECTIONS = [
  { name: "Instagram Graph API", status: "not configured", tone: "warn", detail: "Official access planned for a later phase" },
  { name: "Instagram Messaging API", status: "not configured", tone: "warn", detail: "Inbox uses local sample threads" },
  { name: "Local sample fixtures", status: "loaded", tone: "ok", detail: "src/phantom/data/*" },
  { name: "Analytics / telemetry", status: "disabled", tone: "muted", detail: "No tracking in this prototype" },
  { name: "Persistent storage", status: "disabled", tone: "muted", detail: "State lives in memory only" },
] as const;
