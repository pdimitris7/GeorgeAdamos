// sanity/lib/client.ts
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fyr1ddav";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const rawVersion = process.env.SANITY_API_VERSION || "2023-05-03";
const apiVersion = rawVersion.replace(/^v/i, "");
const token = process.env.SANITY_READ_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // YYYY-MM-DD (χωρίς 'v')
  useCdn: token ? false : process.env.NODE_ENV === "production",
  token: token || undefined, // ΜΟΝΟ σε server code
});

export default client;
