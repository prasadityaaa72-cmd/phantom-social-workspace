import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Inbox, Phone, SendHorizontal, Search, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "../state/workspace";
import { Avatar, DisabledAction, EmptyState, IconButton, SampleTag, Segmented } from "../ui/primitives";

export function InboxModule() {
  const ws = useWorkspace();
  const [folder, setFolder] = useState<"primary" | "requests">("primary");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ws.conversations.filter(
      (c) =>
        c.folder === folder &&
        (!q || c.creator.handle.includes(q) || c.creator.name.toLowerCase().includes(q) || c.messages.some((m) => m.text.toLowerCase().includes(q))),
    );
  }, [ws.conversations, folder, query]);

  const active = ws.conversations.find((c) => c.id === ws.selectedConversationId);

  // Keep the folder tab in sync when a conversation is chosen from the sidebar.
  useEffect(() => {
    if (active && active.folder !== folder) setFolder(active.folder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  // Opening a thread marks it read.
  useEffect(() => {
    if (active && active.unread > 0) ws.selectConversation(active.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active?.id, active?.messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    ws.sendMessage(active.id, text);
    setDraft("");
    inputRef.current?.focus();
  };

  const counts = {
    primary: ws.conversations.filter((c) => c.folder === "primary").length,
    requests: ws.conversations.filter((c) => c.folder === "requests").length,
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Conversation list */}
      <div className={cn("flex w-full shrink-0 flex-col border-r border-border bg-panel md:w-72", mobileThreadOpen && "hidden md:flex")}>
        <div className="space-y-2 border-b border-line p-2">
          <label className="flex h-7 items-center gap-2 rounded-sm border border-border bg-background px-2 focus-within:border-primary">
            <Search className="size-3.5 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sample threads"
              aria-label="Search conversations"
              className="h-full flex-1 bg-transparent text-micro text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <Segmented
            label="Folder"
            value={folder}
            onChange={setFolder}
            className="w-full [&>button]:flex-1 [&>button]:justify-center"
            options={[
              { value: "primary", label: "Primary", count: counts.primary },
              { value: "requests", label: "Requests", count: counts.requests },
            ]}
          />
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto" aria-label="Conversations">
          {list.length === 0 && (
            <li>
              <EmptyState icon={<Search />} title="No threads found">
                Nothing in {folder} matches “{query}”.
              </EmptyState>
            </li>
          )}
          {list.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const selected = c.id === ws.selectedConversationId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => {
                    ws.selectConversation(c.id);
                    setMobileThreadOpen(true);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 border-b border-line px-3 py-(--pad) text-left transition-colors hover:bg-hover",
                    selected && "bg-selection",
                  )}
                >
                  <span className="relative">
                    <Avatar creator={c.creator} size={32} />
                    {c.online && <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-panel bg-success" aria-label="online (sample)" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate font-mono text-micro", c.unread ? "font-semibold text-foreground" : "text-foreground/90")}>
                        @{c.creator.handle}
                      </span>
                      <span className="ml-auto shrink-0 font-mono text-[0.625rem] text-muted-foreground">{last?.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className={cn("truncate text-micro", c.unread ? "text-foreground" : "text-muted-foreground")}>
                        {last?.from === "me" ? "You: " : ""}
                        {last?.text}
                      </span>
                      {c.unread > 0 && (
                        <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[0.5625rem] text-primary-foreground">
                          {c.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Thread */}
      <div className={cn("min-w-0 flex-1 flex-col", mobileThreadOpen ? "flex" : "hidden md:flex")}>
        {!active ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState icon={<Inbox />} title="Select a conversation">
              Pick a sample thread from the list to view messages.
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-line px-3">
              <IconButton label="Back to conversations" className="md:hidden" onClick={() => setMobileThreadOpen(false)}>
                <ArrowLeft />
              </IconButton>
              <Avatar creator={active.creator} size={28} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-mono text-ui text-foreground">@{active.creator.handle}</span>
                  <SampleTag>sample thread</SampleTag>
                </div>
                <p className="text-micro text-muted-foreground">{active.online ? "Active now (sample)" : active.creator.name}</p>
              </div>
              <div className="ml-auto hidden items-center gap-1.5 sm:flex">
                <DisabledAction reason="Calls are not available in this prototype">
                  <Phone /> Call
                </DisabledAction>
                <DisabledAction reason="Video is not available in this prototype">
                  <Video /> Video
                </DisabledAction>
              </div>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">
              <p className="pb-2 text-center font-mono text-[0.625rem] text-muted-foreground">
                — sample conversation · messages never leave this browser tab —
              </p>
              {active.messages.map((m) => (
                <div key={m.id} className={cn("flex flex-col", m.from === "me" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-md px-3 py-1.5 text-ui leading-relaxed",
                      m.from === "me" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="mt-0.5 font-mono text-[0.625rem] text-muted-foreground">
                    {m.time}
                    {m.local && <span className="ml-1.5 text-violet">local · not sent</span>}
                  </span>
                </div>
              ))}
            </div>

            <form
              className="flex shrink-0 items-end gap-2 border-t border-line p-2"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Write a demo message…"
                aria-label="Demo message"
                className="max-h-28 min-h-8 flex-1 resize-none rounded-sm border border-border bg-background px-2.5 py-1.5 text-ui text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Append demo message"
                className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-primary px-3 text-micro font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-40"
              >
                <SendHorizontal className="size-3.5" aria-hidden />
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
