import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { forwardRef } from "react";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { initials } from "../lib/format";
import type { Creator, MediaSpec } from "../types";

export function Hint({
  label,
  side = "bottom",
  children,
}: {
  label: ReactNode;
  side?: "top" | "bottom" | "left" | "right" | undefined;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className="rounded-sm border border-border bg-popover px-2 py-1 font-mono text-micro text-popover-foreground shadow-md"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, active, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        active && "bg-hover text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";

export function HintIconButton({ hint, side, ...props }: IconButtonProps & { hint?: string; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <Hint label={hint ?? props.label} side={side}>
      <IconButton {...props} />
    </Hint>
  );
}

/** A visibly disabled control that explains why it is unavailable. */
export function DisabledAction({
  reason,
  children,
  className,
}: {
  reason: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Hint label={reason}>
      <span tabIndex={0} className={cn("inline-flex cursor-not-allowed rounded-sm", className)} aria-label={reason}>
        <span
          aria-disabled="true"
          className="pointer-events-none inline-flex h-7 items-center gap-1.5 rounded-sm border border-dashed border-border px-2.5 text-micro text-muted-foreground opacity-70 [&_svg]:size-3.5"
        >
          <Lock aria-hidden />
          {children}
        </span>
      </span>
    </Hint>
  );
}

export function Avatar({ creator, size = 32, ring }: { creator: Creator; size?: number; ring?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "avatar-tile inline-flex shrink-0 items-center justify-center rounded-full font-mono font-semibold",
        ring && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      style={{ "--h": creator.hue, width: size, height: size, fontSize: Math.max(9, size * 0.34) } as CSSProperties}
    >
      {initials(creator.name)}
    </span>
  );
}

const RATIO_CLASS: Record<MediaSpec["ratio"], string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
};

export function MediaTile({
  media,
  className,
  showLabel = true,
  fill,
  children,
}: {
  media: MediaSpec;
  className?: string;
  showLabel?: boolean;
  fill?: boolean;
  children?: ReactNode;
}) {
  const dims = media.ratio === "portrait" ? "1080×1350" : media.ratio === "landscape" ? "1600×1000" : "1080×1080";
  return (
    <div
      role="img"
      aria-label={`Sample media placeholder ${media.label}`}
      data-pattern={media.pattern}
      className={cn("media-tile w-full", fill ? "h-full" : RATIO_CLASS[media.ratio], className)}
      style={{ "--h": media.hue } as CSSProperties}
    >
      {showLabel && (
        <span className="absolute bottom-2 left-2 rounded-sm bg-chrome/80 px-1.5 py-0.5 font-mono text-micro text-muted-foreground backdrop-blur-sm">
          {media.label}.jpg · {dims} · sample
        </span>
      )}
      {children}
    </div>
  );
}

export function SampleTag({ children = "sample", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-violet/40 bg-violet/10 px-1 font-mono text-[0.625rem] uppercase leading-4 tracking-wider text-violet",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 items-center rounded-sm border border-border bg-surface-2 px-1.5 font-mono text-[0.625rem] text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: Array<{ value: T; label: ReactNode; count?: number }>;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-sm border border-border bg-panel p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-[3px] px-2.5 text-micro font-medium text-muted-foreground transition-colors hover:text-foreground",
            value === o.value && "bg-surface-2 text-foreground shadow-sm",
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="font-mono text-[0.625rem] opacity-70">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="mb-1 flex size-10 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground [&_svg]:size-5">
        {icon}
      </div>
      <p className="font-mono text-ui text-foreground">{title}</p>
      {children && <p className="max-w-sm text-micro text-muted-foreground">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function PhButton({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded-sm px-3 text-micro font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/85",
        variant === "secondary" && "border border-border bg-surface-2 text-foreground hover:bg-hover",
        variant === "ghost" && "text-muted-foreground hover:bg-hover hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PhantomLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("text-primary", className)} aria-hidden>
      <path
        d="M12 2.75a7.25 7.25 0 0 0-7.25 7.25v10.6l2.42-1.7 2.41 1.7L12 18.9l2.42 1.7 2.41-1.7 2.42 1.7V10A7.25 7.25 0 0 0 12 2.75Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.75 10.5h2M13.25 10.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 14l1.25-1 1.25 1 1.25-1 1.25 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity=".6" />
    </svg>
  );
}

/** Renders a value as syntax-highlighted pseudo-JSON for the IDE inspector. */
export function JsonView({ value, indent = 0 }: { value: unknown; indent?: number }): ReactNode {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);
  if (value === null) return <span className="text-syn-keyword">null</span>;
  if (typeof value === "boolean") return <span className="text-syn-keyword">{String(value)}</span>;
  if (typeof value === "number") return <span className="text-syn-number">{value}</span>;
  if (typeof value === "string") return <span className="text-syn-string">"{value}"</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground">[]</span>;
    return (
      <>
        <span className="text-muted-foreground">[</span>
        {"\n"}
        {value.map((v, i) => (
          <span key={i}>
            {padInner}
            <JsonView value={v} indent={indent + 1} />
            {i < value.length - 1 && <span className="text-muted-foreground">,</span>}
            {"\n"}
          </span>
        ))}
        {pad}
        <span className="text-muted-foreground">]</span>
      </>
    );
  }
  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <>
      <span className="text-muted-foreground">{"{"}</span>
      {"\n"}
      {entries.map(([k, v], i) => (
        <span key={k}>
          {padInner}
          <span className="text-syn-key">"{k}"</span>
          <span className="text-muted-foreground">: </span>
          <JsonView value={v} indent={indent + 1} />
          {i < entries.length - 1 && <span className="text-muted-foreground">,</span>}
          {"\n"}
        </span>
      ))}
      {pad}
      <span className="text-muted-foreground">{"}"}</span>
    </>
  );
}
