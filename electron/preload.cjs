const { contextBridge } = require("electron");

// Expose only non-sensitive desktop metadata. Do not expose Node.js or raw IPC.
contextBridge.exposeInMainWorld("phantomDesktop", Object.freeze({
  isDesktop: true,
  platform: process.platform,
  appName: "PROJECT PHANTOM"
}));
