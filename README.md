# PROJECT PHANTOM

An IDE-inspired browser workspace for social-media activity. Feed, Inbox, Explore,
Profile and Settings open as editor tabs inside a VS Code–style workbench with an activity
rail, explorer sidebar, bottom output panel, status bar and a Ctrl/Cmd+K command palette.

> **Demo-only prototype.** Every post, message, profile and metric is fictional sample data
> stored in `src/phantom/data`. Likes, saves, comments, demo messages and appearance settings are saved in this browser's local storage. They are not synced across devices or sent to a server. Clearing this site's browser data removes them. There is **no** Instagram login, scraping, unofficial API use, credential collection, backend or analytics.
> Any future account integration would require official, approved APIs and eligibility.

## Run locally

```bash
bun install
bun run dev        # http://localhost:8080
bun run test       # unit tests (vitest)
bun run build      # production build
```

Designed desktop-first at 1440×900 and responsive down to tablet and phone widths. The app runs as a web app; no desktop installer is required.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| Ctrl/Cmd + K | Command palette |
| Ctrl/Cmd + B | Toggle sidebar |
| Ctrl + \` | Toggle bottom panel |
| Alt + 1…5 | Feed / Inbox / Explore / Profile / Settings |
| Alt + W | Close active tab |
| Enter | Send demo message in Inbox |
| Double-click media | Like a sample post |

## Structure

```text
src/
  routes/index.tsx            Single page; renders <PhantomApp />
  styles.css                  Design tokens: themes, accents, density, scale (oklch)
  phantom/
    types.ts                  Shared types
    data/                     Local sample fixtures (creators, feed, inbox, explore, profile, logs)
    lib/                      Module registry + shortcuts, explore filter, formatters
    state/workspace.tsx       WorkspaceProvider: tabs, panels, settings, logs, module state
    ui/primitives.tsx         Hint, IconButton, DisabledAction, Avatar, MediaTile, Segmented, JsonView…
    shell/                    Shell, TitleBar, ActivityRail, Sidebar, EditorTabs, TerminalPanel,
                              StatusBar, CommandPalette, Welcome
    modules/                  FeedModule, InboxModule, ExploreModule, ProfileModule, SettingsModule
```

- Appearance settings are applied as `data-*` attributes on `<html>` so dialogs and the
  palette pick up the active theme.
- Unavailable features (calls, profile editing, connecting accounts) render as visibly
  disabled controls with a tooltip explaining why.
- The bottom panel shows read-only demo output; it never executes commands.
