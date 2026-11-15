import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CONVERSATIONS } from "../data/inbox";
import { FEED_POSTS } from "../data/feed";
import { INITIAL_LOGS } from "../data/logs";
import { clockTime } from "../lib/format";
import { MODULE_BY_ID } from "../lib/modules";
import type {
  Conversation,
  ExploreCategory,
  FeedFilter,
  LogEntry,
  ModuleId,
  Post,
  SettingsSection,
  TerminalTab,
  WorkspaceSettings,
} from "../types";

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  theme: "phantom",
  accent: "blue",
  density: "compact",
  fontScale: "md",
  reduceMotion: false,
  showStatusBar: true,
  monoCaptions: false,
};

function useWorkspaceState() {
  // Layout
  const [openTabs, setOpenTabs] = useState<ModuleId[]>(["feed", "inbox", "explore"]);
  const [activeTab, setActiveTab] = useState<ModuleId | null>("feed");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalTab, setTerminalTab] = useState<TerminalTab>("output");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const logId = useRef(INITIAL_LOGS.length);

  // Module state (all local, in-memory)
  const [posts, setPosts] = useState<Post[]>(FEED_POSTS);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");
  const [feedCreator, setFeedCreator] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>(FEED_POSTS[0]!.id);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(CONVERSATIONS[0]!.id);
  const [exploreQuery, setExploreQuery] = useState("");
  const [exploreCategory, setExploreCategory] = useState<ExploreCategory | "all">("all");
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("appearance");

  const log = useCallback((source: string, message: string, level: LogEntry["level"] = "demo") => {
    logId.current += 1;
    const entry: LogEntry = { id: `l${logId.current}`, time: clockTime(), level, source, message };
    setLogs((prev) => [...prev.slice(-199), entry]);
  }, []);

  // Reflect appearance settings on <html> so portals (palette, dialogs) are themed too.
  useEffect(() => {
    const el = document.documentElement;
    el.dataset["theme"] = settings.theme;
    el.dataset["accent"] = settings.accent;
    el.dataset["density"] = settings.density;
    el.dataset["scale"] = settings.fontScale;
    el.dataset["motion"] = settings.reduceMotion ? "reduced" : "full";
  }, [settings]);

  const openModule = useCallback(
    (id: ModuleId) => {
      setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
      setActiveTab(id);
      log("editor", `Focused ${MODULE_BY_ID[id].file}`, "info");
    },
    [log],
  );

  const closeTab = useCallback(
    (id: ModuleId) => {
      setOpenTabs((tabs) => {
        const idx = tabs.indexOf(id);
        if (idx === -1) return tabs;
        const next = tabs.filter((t) => t !== id);
        setActiveTab((current) => (current === id ? (next[Math.max(0, idx - 1)] ?? null) : current));
        return next;
      });
      log("editor", `Closed ${MODULE_BY_ID[id].file}`, "info");
    },
    [log],
  );

  const closeAllTabs = useCallback(() => {
    setOpenTabs([]);
    setActiveTab(null);
    log("editor", "Closed all editors", "info");
  }, [log]);

  const updateSettings = useCallback(
    (patch: Partial<WorkspaceSettings>) => {
      setSettings((s) => ({ ...s, ...patch }));
      const desc = Object.entries(patch)
        .map(([k, v]) => `${k}=${String(v)}`)
        .join(", ");
      log("settings", `Updated ${desc}`, "info");
    },
    [log],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    log("settings", "Restored default appearance", "info");
  }, [log]);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const toggleTerminal = useCallback(() => setTerminalOpen((v) => !v), []);
  const showTerminalTab = useCallback((tab: TerminalTab) => {
    setTerminalTab(tab);
    setTerminalOpen(true);
  }, []);

  // ---- Feed actions (local only) ----
  const togglePostFlag = useCallback(
    (postId: string, flag: "liked" | "saved") => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      const value = !post[flag];
      const verb = flag === "liked" ? (value ? "Liked" : "Unliked") : value ? "Saved" : "Unsaved";
      log("feed", `${verb} ${postId} (local state only)`);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, [flag]: value, likes: flag === "liked" ? p.likes + (value ? 1 : -1) : p.likes }
            : p,
        ),
      );
    },
    [log, posts],
  );

  const likePost = useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post || post.liked) return;
      log("feed", `Liked ${postId} via double-click (local state only)`);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, liked: true, likes: p.likes + 1 } : p)));
    },
    [log, posts],
  );

  const addComment = useCallback(
    (postId: string, text: string) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [...p.comments, { id: `lc_${Date.now()}`, handle: "phantom.sample", text, local: true }],
              }
            : p,
        ),
      );
      log("feed", `Added local comment to ${postId} (not published)`);
    },
    [log],
  );

  // ---- Inbox actions (local only) ----
  const selectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, { id: `lm_${now.getTime()}`, from: "me", text, time, local: true }] }
            : c,
        ),
      );
      log("inbox", `Appended local demo message to ${conversationId} (not sent)`);
    },
    [log],
  );

  const clearLogs = useCallback(() => setLogs([]), []);

  return {
    openTabs,
    activeTab,
    setActiveTab,
    openModule,
    closeTab,
    closeAllTabs,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    terminalOpen,
    setTerminalOpen,
    toggleTerminal,
    terminalTab,
    setTerminalTab,
    showTerminalTab,
    paletteOpen,
    setPaletteOpen,
    settings,
    updateSettings,
    resetSettings,
    logs,
    log,
    clearLogs,
    posts,
    togglePostFlag,
    likePost,
    addComment,
    feedFilter,
    setFeedFilter,
    feedCreator,
    setFeedCreator,
    selectedPostId,
    setSelectedPostId,
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    selectConversation,
    sendMessage,
    exploreQuery,
    setExploreQuery,
    exploreCategory,
    setExploreCategory,
    settingsSection,
    setSettingsSection,
  };
}

export type Workspace = ReturnType<typeof useWorkspaceState>;

const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const state = useWorkspaceState();
  return <WorkspaceContext.Provider value={state}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): Workspace {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}
