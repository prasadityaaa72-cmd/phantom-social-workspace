import { useState } from "react";
import { Bookmark, Grid3x3, Link2, Pencil, PlugZap, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SAMPLE_PROFILE } from "../data/profile";
import { compact, withCommas } from "../lib/format";
import { useWorkspace } from "../state/workspace";
import { Avatar, DisabledAction, EmptyState, MediaTile, PhButton, SampleTag } from "../ui/primitives";

type ProfileTab = "posts" | "saved" | "tagged";

export function ProfileModule() {
  const ws = useWorkspace();
  const [tab, setTab] = useState<ProfileTab>("posts");
  const p = SAMPLE_PROFILE;
  const saved = ws.posts.filter((x) => x.saved);

  const openIntegrations = () => {
    ws.openModule("settings");
    ws.setSettingsSection("integrations");
  };

  const tabs: Array<{ id: ProfileTab; label: string; icon: typeof Grid3x3; count?: number }> = [
    { id: "posts", label: "Posts", icon: Grid3x3, count: p.grid.length },
    { id: "saved", label: "Saved", icon: Bookmark, count: saved.length },
    { id: "tagged", label: "Tagged", icon: Tag },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-5">
        <div className="flex items-center gap-2 rounded-md border border-violet/40 bg-violet/10 px-3 py-2 text-micro text-foreground">
          <SampleTag>sample profile</SampleTag>
          This account data is fictional and loaded from local fixtures.
        </div>

        <section className="flex flex-col gap-5 rounded-md border border-border bg-surface p-4 sm:flex-row sm:items-start">
          <Avatar creator={p.creator} size={84} ring />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-base text-foreground">@{p.creator.handle}</h2>
              <DisabledAction reason="Profile editing needs official API access (later phase)">
                <Pencil /> Edit profile
              </DisabledAction>
              <PhButton onClick={openIntegrations}>
                <PlugZap /> Integration status
              </PhButton>
            </div>
            <dl className="flex gap-6 font-mono text-ui">
              {(
                [
                  ["posts", p.stats.posts],
                  ["followers", p.stats.followers],
                  ["following", p.stats.following],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dd className="text-foreground">{compact(v)}</dd>
                  <dt className="text-micro text-muted-foreground">{k}</dt>
                </div>
              ))}
            </dl>
            <div className="space-y-1 text-ui">
              <p className="font-medium text-foreground">{p.creator.name}</p>
              <p className="text-foreground/85">{p.bio}</p>
              <p className="flex items-center gap-1 font-mono text-micro text-primary">
                <Link2 className="size-3" aria-hidden />
                {p.website}
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-md border border-border bg-panel p-3 sm:w-56">
            <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">Connection</p>
            <dl className="space-y-1.5 font-mono text-micro">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">account</dt>
                <dd className="flex items-center gap-1.5 text-warning">
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  not connected
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">source</dt>
                <dd className="text-foreground">local fixtures</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">last sync</dt>
                <dd className="text-foreground">never</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">api</dt>
                <dd className="text-foreground">not configured</dd>
              </div>
            </dl>
          </div>
        </section>

        <div>
          <div role="tablist" aria-label="Profile content" className="flex border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "-mb-px flex h-8 items-center gap-1.5 border-b px-3 font-mono text-micro uppercase tracking-wider text-muted-foreground hover:text-foreground",
                  tab === t.id ? "border-primary text-foreground" : "border-transparent",
                )}
              >
                <t.icon className="size-3.5" aria-hidden />
                {t.label}
                {t.count !== undefined && <span className="text-[0.625rem] opacity-70">{t.count}</span>}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="pt-3">
            {tab === "posts" && (
              <ul className="grid grid-cols-3 gap-1 sm:gap-2">
                {p.grid.map((g) => (
                  <li key={g.id} className="group relative overflow-hidden rounded-sm">
                    <MediaTile media={g.media} showLabel={false} />
                    <span className="absolute inset-x-0 bottom-0 flex justify-between bg-chrome/75 px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      <span>{g.media.label}</span>
                      <span>♥ {withCommas(g.likes)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {tab === "saved" &&
              (saved.length === 0 ? (
                <EmptyState icon={<Bookmark />} title="No saved posts" action={<PhButton onClick={() => ws.openModule("feed")}>Browse feed</PhButton>}>
                  Bookmark sample posts in the Feed and they’ll appear here (local only).
                </EmptyState>
              ) : (
                <ul className="grid grid-cols-3 gap-1 sm:gap-2">
                  {saved.map((post) => (
                    <li key={post.id}>
                      <button
                        type="button"
                        onClick={() => {
                          ws.setSelectedPostId(post.id);
                          ws.openModule("feed");
                        }}
                        className="group relative block w-full overflow-hidden rounded-sm"
                        aria-label={`Open saved post by @${post.creator.handle} in feed`}
                      >
                        <MediaTile media={{ ...post.media, ratio: "square" }} showLabel={false} />
                        <span className="absolute inset-x-0 bottom-0 truncate bg-chrome/75 px-1.5 py-0.5 text-left font-mono text-[0.625rem] text-muted-foreground">
                          @{post.creator.handle}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            {tab === "tagged" && (
              <EmptyState icon={<Tag />} title="Tagged posts unavailable" action={<PhButton onClick={openIntegrations}>Why?</PhButton>}>
                Tagged content requires official API access, which is planned for a later phase.
              </EmptyState>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
