import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Ban, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONNECTIONS, OUTPUT_LINES } from "../data/logs";
import { useWorkspace } from "../state/workspace";
import type { TerminalTab } from "../types";
import { HintIconButton } from "../ui/primitives";

const TABS: Array<{ id: TerminalTab; label: string }> = [
  { id: "problems", label: "Problems" },
  { id: "output", label: "Output" },
  { id: "connections", label: "Connections" },
  { id: "log", label: "Log" },
];

function Line({ time, tag, children, tone = "info" }: { time: string; tag: string; children: React.ReactNode; tone?: "info" | "demo" | "warn" }) {
  return (
    <div className="flex gap-3 whitespace-pre-wrap py-px">
      <span className="shrink-0 text-muted-foreground/70">{time}</span>
      <span
        className={cn(
          "w-24 shrink-0 truncate",
          tone === "info" && "text-info",
          tone === "demo" && "text-violet",
          tone === "warn" && "text-warning",
        )}
      >
        [{tag}]
      </span>
      <span className="min-w-0 text-foreground/90">{children}</span>
    </div>
  );
}

export function TerminalPanel({ compact }: { compact?: boolean }) {
  const ws = useWorkspace();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ws.terminalOpen && ws.terminalTab === "log" && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [ws.logs, ws.terminalOpen, ws.terminalTab]);

  return (
    <section
      aria-label="Panel"
      className={cn(
        "flex shrink-0 flex-col border-t border-border bg-panel",
        ws.terminalOpen ? (compact ? "h-48" : "h-56") : "h-8",
      )}
    >
      <div className="flex h-8 shrink-0 items-center gap-1 pl-2 pr-1">
        <div role="tablist" aria-label="Panel views" className="flex min-w-0 items-center overflow-x-auto">
          {TABS.map((t) => {
            const active = ws.terminalOpen && ws.terminalTab === t.id;
            const count = t.id === "log" ? ws.logs.length : t.id === "problems" ? 2 : undefined;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => ws.showTerminalTab(t.id)}
                className={cn(
                  "flex h-8 shrink-0 items-center gap-1.5 border-b border-transparent px-2.5 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground hover:text-foreground",
                  active && "border-primary text-foreground",
                )}
              >
                {t.label}
                {count !== undefined && (
                  <span className="rounded-full bg-surface-2 px-1.5 text-[0.5625rem] leading-4 text-muted-foreground">{count}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center">
          {ws.terminalOpen && ws.terminalTab === "log" && (
            <HintIconButton label="Clear log" onClick={ws.clearLogs} disabled={ws.logs.length === 0}>
              <Ban />
            </HintIconButton>
          )}
          <HintIconButton
            label={ws.terminalOpen ? "Collapse panel" : "Expand panel"}
            hint={`${ws.terminalOpen ? "Collapse" : "Expand"} panel · Ctrl+\``}
            onClick={ws.toggleTerminal}
          >
            {ws.terminalOpen ? <ChevronDown /> : <ChevronUp />}
          </HintIconButton>
        </div>
      </div>

      {ws.terminalOpen && (
        <>
          <div ref={bodyRef} role="tabpanel" className="min-h-0 flex-1 overflow-y-auto px-3 pb-2 font-mono text-micro leading-5">
            {ws.terminalTab === "output" &&
              OUTPUT_LINES.map((l, i) => (
                <Line key={i} time={l.time} tag={l.tag} tone={l.tag === "integrations" ? "warn" : "info"}>
                  {l.text}
                </Line>
              ))}

            {ws.terminalTab === "problems" && (
              <div className="space-y-1 pt-1">
                <div className="flex items-start gap-2">
                  <span className="text-info">ⓘ</span>
                  <span>
                    Official integrations are not configured. <span className="text-muted-foreground">phantom/integrations · expected in prototype phase</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-info">ⓘ</span>
                  <span>
                    All social content is local sample data. <span className="text-muted-foreground">phantom/data · by design</span>
                  </span>
                </div>
                <div className="pt-2 text-success">0 errors · 0 warnings · 2 info</div>
              </div>
            )}

            {ws.terminalTab === "connections" && (
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-1 pr-4 font-normal">service</th>
                    <th className="py-1 pr-4 font-normal">status</th>
                    <th className="py-1 font-normal">detail</th>
                  </tr>
                </thead>
                <tbody>
                  {CONNECTIONS.map((c) => (
                    <tr key={c.name} className="border-t border-line">
                      <td className="py-1 pr-4 text-foreground">{c.name}</td>
                      <td className="py-1 pr-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5",
                            c.tone === "ok" && "text-success",
                            c.tone === "warn" && "text-warning",
                            c.tone === "muted" && "text-muted-foreground",
                          )}
                        >
                          <span className="size-1.5 rounded-full bg-current" aria-hidden />
                          {c.status}
                        </span>
                      </td>
                      <td className="py-1 text-muted-foreground">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {ws.terminalTab === "log" &&
              (ws.logs.length === 0 ? (
                <p className="pt-2 text-muted-foreground">Log is empty. Interact with any module to see local demo events here.</p>
              ) : (
                ws.logs.map((l) => (
                  <Line key={l.id} time={l.time} tag={l.source} tone={l.level}>
                    {l.message}
                  </Line>
                ))
              ))}
          </div>
          <div className="flex h-6 shrink-0 items-center gap-1.5 border-t border-line px-3 font-mono text-[0.625rem] text-muted-foreground">
            <ShieldCheck className="size-3 text-success" aria-hidden />
            Read-only demo output. Phantom does not execute shell commands.
          </div>
        </>
      )}
    </section>
  );
}
