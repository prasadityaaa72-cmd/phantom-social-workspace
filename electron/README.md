# Electron desktop shell

This is the first desktop-wrapper milestone. It opens the current Lovable preview URL in a hardened Electron window so the existing UI can be evaluated as a desktop window.

## Run locally

1. Install dependencies with `bun install`.
2. Start the Lovable/Vite app separately if you want to test a local server.
3. Set `PHANTOM_APP_URL` to the local app URL (for example `http://localhost:3000`) before running `bun run desktop:dev`. If it is not set, the shell opens the current hosted preview.

## Important limitation

This milestone loads a web URL; it is not yet an offline, self-contained installer. The next milestone must package the TanStack Start app output with Electron and verify the production server/runtime before distributing a Windows build. No Instagram credentials or unofficial APIs are used.
