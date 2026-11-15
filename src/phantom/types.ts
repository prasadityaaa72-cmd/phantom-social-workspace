export type ModuleId = "feed" | "inbox" | "explore" | "profile" | "settings";
export type TerminalTab = "problems" | "output" | "connections" | "log";
export type ThemeId = "phantom" | "midnight" | "graphite" | "daylight";
export type AccentId = "blue" | "violet" | "cyan" | "amber";
export type Density = "compact" | "comfortable";
export type FontScale = "sm" | "md" | "lg";
export type SettingsSection = "appearance" | "shortcuts" | "integrations";
export type FeedFilter = "all" | "following" | "saved";

export interface WorkspaceSettings {
  theme: ThemeId;
  accent: AccentId;
  density: Density;
  fontScale: FontScale;
  reduceMotion: boolean;
  showStatusBar: boolean;
  monoCaptions: boolean;
}

export interface LogEntry {
  id: string;
  time: string;
  level: "info" | "demo" | "warn";
  source: string;
  message: string;
}

export interface MediaSpec {
  hue: number;
  pattern: 0 | 1 | 2 | 3;
  ratio: "square" | "portrait" | "landscape";
  label: string;
}

export interface Creator {
  handle: string;
  name: string;
  hue: number;
}

export interface PostComment {
  id: string;
  handle: string;
  text: string;
  local?: boolean;
}

export interface Post {
  id: string;
  creator: Creator;
  time: string;
  location?: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: PostComment[];
  media: MediaSpec;
  following: boolean;
  liked: boolean;
  saved: boolean;
}

export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  local?: boolean;
}

export interface Conversation {
  id: string;
  creator: Creator;
  folder: "primary" | "requests";
  unread: number;
  online?: boolean;
  messages: Message[];
}

export const EXPLORE_CATEGORIES = [
  "design",
  "food",
  "travel",
  "tech",
  "outdoors",
  "music",
  "photo",
] as const;
export type ExploreCategory = (typeof EXPLORE_CATEGORIES)[number];

export interface ExploreItem {
  id: string;
  title: string;
  creator: Creator;
  category: ExploreCategory;
  tags: string[];
  likes: number;
  media: MediaSpec;
}
