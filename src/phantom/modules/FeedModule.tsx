import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bookmark, Braces, Heart, MessageCircle, Rows3, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "../state/workspace";
import type { Post } from "../types";
import { withCommas } from "../lib/format";
import { Avatar, EmptyState, HintIconButton, JsonView, MediaTile, PhButton, SampleTag, Segmented } from "../ui/primitives";

type Sort = "latest" | "top";

function PostCard({ post, selected }: { post: Post; selected: boolean }) {
  const ws = useWorkspace();
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const mono = ws.settings.monoCaptions;

  const share = async () => {
    const ref = `phantom://demo/post/${post.id}`;
    try {
      await navigator.clipboard.writeText(ref);
      toast("Demo reference copied", { description: `${ref} — nothing was shared externally.` });
    } catch {
      toast("Share is demo-only", { description: `Reference: ${ref}` });
    }
    ws.log("feed", `Copied demo reference for ${post.id} (no external share)`);
  };

  return (
    <article
      aria-label={`Sample post by @${post.creator.handle}`}
      onClick={() => ws.setSelectedPostId(post.id)}
      className={cn(
        "overflow-hidden rounded-md border bg-surface transition-colors",
        selected ? "border-primary/60" : "border-border hover:border-input",
      )}
    >
      <header className="flex items-center gap-2.5 p-(--pad)">
        <Avatar creator={post.creator} size={30} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-mono text-ui font-medium text-foreground">@{post.creator.handle}</span>
            <SampleTag />
          </div>
          <p className="truncate text-micro text-muted-foreground">
            {post.time} ago{post.location ? ` · ${post.location}` : ""}
            {post.following ? " · following" : ""}
          </p>
        </div>
        <HintIconButton
          label="Inspect post data"
          active={selected}
          onClick={(e) => {
            e.stopPropagation();
            ws.setSelectedPostId(post.id);
          }}
        >
          <Braces />
        </HintIconButton>
      </header>

      <div onDoubleClick={() => ws.likePost(post.id)} className="cursor-pointer select-none" title="Double-click to like (local only)">
        <MediaTile media={post.media} />
      </div>

      <div className="space-y-2 p-(--pad)">
        <div className="-ml-1.5 flex items-center gap-0.5">
          <HintIconButton
            label={post.liked ? "Unlike (local)" : "Like (local)"}
            active={post.liked}
            onClick={(e) => {
              e.stopPropagation();
              ws.togglePostFlag(post.id, "liked");
            }}
            className={cn(post.liked && "bg-transparent text-heart hover:text-heart")}
          >
            <Heart fill={post.liked ? "currentColor" : "none"} />
          </HintIconButton>
          <HintIconButton
            label={showComments ? "Hide comments" : "Show comments"}
            active={showComments}
            onClick={(e) => {
              e.stopPropagation();
              setShowComments((v) => !v);
            }}
          >
            <MessageCircle />
          </HintIconButton>
          <HintIconButton
            label="Copy demo reference"
            hint="Share (copies a demo reference only)"
            onClick={(e) => {
              e.stopPropagation();
              void share();
            }}
          >
            <Send />
          </HintIconButton>
          <HintIconButton
            label={post.saved ? "Unsave (local)" : "Save (local)"}
            active={post.saved}
            onClick={(e) => {
              e.stopPropagation();
              ws.togglePostFlag(post.id, "saved");
            }}
            className={cn("ml-auto", post.saved && "bg-transparent text-primary hover:text-primary")}
          >
            <Bookmark fill={post.saved ? "currentColor" : "none"} />
          </HintIconButton>
        </div>

        <p className="font-mono text-micro text-foreground">{withCommas(post.likes)} likes</p>
        <p className={cn("text-ui leading-relaxed text-foreground/90", mono && "font-mono text-micro")}>
          <span className="mr-1.5 font-mono font-medium text-foreground">{post.creator.handle}</span>
          {post.caption}{" "}
          {post.tags.map((t) => (
            <span key={t} className="text-primary">
              #{t}{" "}
            </span>
          ))}
        </p>

        {post.comments.length > 0 && !showComments && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="text-micro text-muted-foreground hover:text-foreground"
          >
            View {post.comments.length} comment{post.comments.length === 1 ? "" : "s"}
          </button>
        )}

        {showComments && (
          <div className="space-y-1.5 border-t border-line pt-2" onClick={(e) => e.stopPropagation()}>
            {post.comments.length === 0 && <p className="text-micro text-muted-foreground">No comments yet.</p>}
            {post.comments.map((c) => (
              <p key={c.id} className="text-micro text-foreground/90">
                <span className="mr-1.5 font-mono font-medium text-foreground">{c.handle}</span>
                {c.text}
                {c.local && <span className="ml-1.5 font-mono text-[0.625rem] text-violet">local · not published</span>}
              </p>
            ))}
            <form
              className="flex items-center gap-2 pt-1"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                ws.addComment(post.id, draft.trim());
                setDraft("");
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a local demo comment…"
                aria-label="Add a local demo comment"
                className="h-7 flex-1 rounded-sm border border-border bg-background px-2 text-micro text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <PhButton type="submit" variant="primary" disabled={!draft.trim()}>
                Post
              </PhButton>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

function Inspector({ post }: { post: Post | undefined }) {
  return (
    <aside aria-label="Post inspector" className="hidden w-80 shrink-0 flex-col border-l border-border bg-panel xl:flex">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-line px-3 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
        <Braces className="size-3.5" aria-hidden />
        Inspector — post.json
      </div>
      {post ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <pre className="p-3 font-mono text-micro leading-5">
            <span className="text-syn-comment">{"// local sample fixture · read-only\n"}</span>
            <JsonView
              value={{
                id: post.id,
                source: "sample-fixture",
                handle: post.creator.handle,
                posted: `${post.time} ago`,
                media: { file: `${post.media.label}.jpg`, ratio: post.media.ratio },
                tags: post.tags,
                metrics: { likes: post.likes, comments: post.comments.length },
                viewer: { liked: post.liked, saved: post.saved, following: post.following },
                synced: false,
              }}
            />
          </pre>
          <p className="border-t border-line px-3 py-2 text-micro text-muted-foreground">
            Changes made here stay in this browser tab and reset on reload.
          </p>
        </div>
      ) : (
        <p className="p-3 text-micro text-muted-foreground">Select a post to inspect its sample data.</p>
      )}
    </aside>
  );
}

export function FeedModule() {
  const ws = useWorkspace();
  const [sort, setSort] = useState<Sort>("latest");

  const visible = useMemo(() => {
    let list = ws.posts;
    if (ws.feedFilter === "following") list = list.filter((p) => p.following);
    if (ws.feedFilter === "saved") list = list.filter((p) => p.saved);
    if (ws.feedCreator) list = list.filter((p) => p.creator.handle === ws.feedCreator);
    if (sort === "top") list = [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [ws.posts, ws.feedFilter, ws.feedCreator, sort]);

  const selected = ws.posts.find((p) => p.id === ws.selectedPostId);

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-1.5">
          <Segmented
            label="Feed filter"
            value={ws.feedFilter}
            onChange={ws.setFeedFilter}
            options={[
              { value: "all", label: "All" },
              { value: "following", label: "Following" },
              { value: "saved", label: "Saved", count: ws.posts.filter((p) => p.saved).length },
            ]}
          />
          <Segmented
            label="Sort"
            value={sort}
            onChange={setSort}
            options={[
              { value: "latest", label: "Latest" },
              { value: "top", label: "Most liked" },
            ]}
          />
          {ws.feedCreator && (
            <button
              type="button"
              onClick={() => ws.setFeedCreator(null)}
              className="inline-flex h-6 items-center gap-1 rounded-sm border border-primary/50 bg-primary/10 px-2 font-mono text-micro text-primary hover:bg-primary/20"
            >
              @{ws.feedCreator}
              <X className="size-3" aria-label="Clear creator filter" />
            </button>
          )}
          <span className="ml-auto font-mono text-micro text-muted-foreground">
            {visible.length} post{visible.length === 1 ? "" : "s"} · sample fixtures
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[34rem] flex-col gap-(--gap) px-3 py-4">
            {visible.length === 0 ? (
              <EmptyState
                icon={<Rows3 />}
                title={ws.feedFilter === "saved" ? "No saved sample posts" : "Nothing matches this filter"}
                action={
                  <PhButton
                    onClick={() => {
                      ws.setFeedFilter("all");
                      ws.setFeedCreator(null);
                    }}
                  >
                    Show all posts
                  </PhButton>
                }
              >
                {ws.feedFilter === "saved" ? "Use the bookmark on any post to save it locally." : "Try clearing the creator filter."}
              </EmptyState>
            ) : (
              visible.map((p) => <PostCard key={p.id} post={p} selected={p.id === ws.selectedPostId} />)
            )}
            {visible.length > 0 && (
              <p className="py-4 text-center font-mono text-micro text-muted-foreground">— end of sample feed —</p>
            )}
          </div>
        </div>
      </div>
      <Inspector post={selected} />
    </div>
  );
}
