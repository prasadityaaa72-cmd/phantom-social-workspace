import { createFileRoute } from "@tanstack/react-router";
import { PhantomApp } from "@/phantom/shell/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PROJECT PHANTOM — IDE-style social workspace (prototype)" },
      {
        name: "description",
        content: "An IDE-inspired desktop workspace for social activity. Interface prototype with sample data only.",
      },
      { property: "og:title", content: "PROJECT PHANTOM — IDE-style social workspace" },
      {
        property: "og:description",
        content: "Feed, inbox, explore and profile modules inside a code-editor style workspace. Demo data only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhantomApp,
});
