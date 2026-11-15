import { MODULES } from "../lib/modules";
import { useWorkspace } from "../state/workspace";
import { Kbd, PhantomLogo } from "../ui/primitives";

export function Welcome() {
  const ws = useWorkspace();
  return (
    <div className="dot-grid flex h-full items-center justify-center overflow-y-auto p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <PhantomLogo className="size-10" />
          <div>
            <h1 className="font-mono text-base font-semibold tracking-[0.18em] text-foreground">PROJECT PHANTOM</h1>
            <p className="text-micro text-muted-foreground">IDE-style social workspace · interface prototype</p>
          </div>
        </div>
        <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">No editors open — start</p>
        <ul className="divide-y divide-line overflow-hidden rounded-md border border-border bg-surface">
          {MODULES.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => ws.openModule(m.id)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-ui transition-colors hover:bg-hover"
              >
                <m.icon className="size-4 text-primary" aria-hidden />
                <span className="font-mono text-foreground">{m.file}</span>
                <span className="hidden truncate text-micro text-muted-foreground sm:inline">{m.description}</span>
                <Kbd className="ml-auto">{m.shortcut}</Kbd>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => ws.setPaletteOpen(true)}
          className="mt-4 flex w-full items-center justify-between rounded-md border border-dashed border-border px-3 py-2 text-micro text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          Show all commands
          <Kbd>Ctrl K</Kbd>
        </button>
      </div>
    </div>
  );
}
