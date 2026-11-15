import { useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown, ChevronsLeft, FolderOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPLORE_ITEMS } from "../data/explore";
import { MODULES } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import { EXPLORE_CATEGORIES, type SettingsSection } from "../types";
import { HintIconButton } from "../ui/primitives";

function Section({ title, children, defaultOpen = true, action }: { title: string; children: ReactNode; defaultOpen?: boolean; action?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-line">
      <div className="flex items-center pr-1">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-(--row) flex-1 items-center gap-1 px-1.5 text-left font-mono text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={cn("size-3.5 transition-transform", !open && "-rotate-90")} aria-hidden />
          {title}
        </button>
        {action}
      </div>
      {open && <div className="pb-2">{children}</div>}
    </section>
  );
}

function Row({
  active,
  onClick,
  children,
  trailing,
  indent = 1,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  trailing?: ReactNode;
  indent?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      style={{ paddingLeft: `${indent * 0.75 + 0.5}rem` } as CSSProperties}
      className={cn(
        "flex h-(--row) w-full items-center gap-2 pr-3 text-left text-micro text-muted-foreground transition-colors hover:bg-hover hover:text-foreground",
        active && "bg-selection text-foreground",
      )}
    >
      {children}
      {trailing !== undefined && <span className="ml-auto font-mono text-[0.625rem] opacity-80">{trailing}</span>}
    </button>
  );
}

function ContextSection() {
  const ws = useWorkspace();
  switch (ws.activeTab) {
    case "feed": {
      const creators = Array.from(new Map(ws.posts.map((p) => [p.creator.handle, p.creator])).values());
      return (
        <>
          <Section title="Feed filters">
            {(["all", "following", "saved"] as const).map((f) => (
              <Row
                key={f}
                active={ws.feedFilter === f}
                onClick={() => ws.setFeedFilter(f)}
                trailing={f === "all" ? ws.posts.length : f === "following" ? ws.posts.filter((p) => p.following).length : ws.posts.filter((p) => p.saved).length}
              >
                <span className="font-mono">{f}</span>
              </Row>
            ))}
          </Section>
          <Section title="Creators (sample)">
            {creators.map((c) => (
              <Row
                key={c.handle}
                active={ws.feedCreator === c.handle}
                onClick={() => ws.setFeedCreator(ws.feedCreator === c.handle ? null : c.handle)}
                trailing={ws.feedCreator === c.handle ? "filter" : undefined}
              >
                <span className="hue-dot size-2 rounded-full" style={{ "--h": c.hue } as CSSProperties} aria-hidden />
                <span className="truncate font-mono">@{c.handle}</span>
              </Row>
            ))}
          </Section>
        </>
      );
    }
    case "inbox":
      return (
        <Section title="Conversations (sample)">
          {ws.conversations.map((c) => (
            <Row
              key={c.id}
              active={ws.selectedConversationId === c.id}
              onClick={() => ws.selectConversation(c.id)}
              trailing={c.unread ? `${c.unread} new` : c.folder === "requests" ? "req" : ""}
            >
              <span className="hue-dot size-2 rounded-full" style={{ "--h": c.creator.hue } as CSSProperties} aria-hidden />
              <span className={cn("truncate font-mono", c.unread && "text-foreground")}>@{c.creator.handle}</span>
            </Row>
          ))}
        </Section>
      );
    case "explore":
      return (
        <Section title="Categories">
          <Row active={ws.exploreCategory === "all"} onClick={() => ws.setExploreCategory("all")} trailing={EXPLORE_ITEMS.length}>
            <span className="font-mono">all</span>
          </Row>
          {EXPLORE_CATEGORIES.map((cat) => (
            <Row
              key={cat}
              active={ws.exploreCategory === cat}
              onClick={() => ws.setExploreCategory(cat)}
              trailing={EXPLORE_ITEMS.filter((i) => i.category === cat).length}
            >
              <span className="font-mono">{cat}</span>
            </Row>
          ))}
        </Section>
      );
    case "profile":
      return (
        <Section title="Account">
          <div className="space-y-1.5 px-3 py-1 text-micro">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-warning" aria-hidden />
              <span className="text-foreground">Not connected</span>
            </div>
            <p className="text-muted-foreground">Showing a sample profile from local fixtures.</p>
          </div>
          <Row onClick={() => { ws.openModule("settings"); ws.setSettingsSection("integrations"); }}>
            <Info className="size-3.5" aria-hidden />
            Integration status
          </Row>
        </Section>
      );
    case "settings": {
      const sections: Array<[SettingsSection, string]> = [
        ["appearance", "Appearance"],
        ["shortcuts", "Keyboard shortcuts"],
        ["integrations", "Integrations"],
      ];
      return (
        <Section title="Settings">
          {sections.map(([id, label]) => (
            <Row key={id} active={ws.settingsSection === id} onClick={() => ws.setSettingsSection(id)}>
              {label}
            </Row>
          ))}
        </Section>
      );
    }
    default:
      return (
        <Section title="Outline">
          <p className="px-3 py-1 text-micro text-muted-foreground">No editor is open. Pick a module above.</p>
        </Section>
      );
  }
}

export function Sidebar({ overlay }: { overlay?: boolean }) {
  const ws = useWorkspace();
  return (
    <aside
      aria-label="Workspace sidebar"
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-border bg-panel",
        overlay && "fixed bottom-6 left-12 top-9 z-40 shadow-2xl",
      )}
    >
      <div className="flex h-9 shrink-0 items-center justify-between pl-3 pr-1">
        <span className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Explorer</span>
        <HintIconButton label="Collapse sidebar" hint="Collapse sidebar · Ctrl/Cmd+B" onClick={() => ws.setSidebarOpen(false)}>
          <ChevronsLeft />
        </HintIconButton>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title="phantom-workspace">
          <div className="flex h-(--row) items-center gap-2 pl-4 text-micro text-muted-foreground">
            <FolderOpen className="size-3.5 text-primary" aria-hidden />
            <span className="font-mono">social</span>
          </div>
          {MODULES.map((m) => (
            <Row
              key={m.id}
              indent={1.5}
              active={ws.activeTab === m.id}
              onClick={() => ws.openModule(m.id)}
              trailing={ws.openTabs.includes(m.id) ? "●" : undefined}
            >
              <m.icon className="size-3.5" aria-hidden />
              <span className="font-mono">{m.file}</span>
            </Row>
          ))}
        </Section>
        <ContextSection />
      </div>
      <div className="shrink-0 border-t border-line p-3 text-micro leading-relaxed text-muted-foreground">
        <span className="font-mono text-violet">// demo mode</span>
        <br />
        All content is local sample data. No accounts are connected.
      </div>
    </aside>
  );
}
