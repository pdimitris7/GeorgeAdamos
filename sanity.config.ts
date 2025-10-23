// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

// σωστά relative imports
import portfolio from "./sanity/schemas/portfolio";
import mediaPost from "./sanity/schemas/mediaPost";
import print from "./sanity/schemas/print";

export default defineConfig({
  name: "default",
  title: "George Adamos Portfolio",
  projectId: "fyr1ddav",
  dataset: "production",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [portfolio, mediaPost, print],
  },
});
