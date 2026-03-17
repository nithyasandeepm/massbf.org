import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readDataFile, writeDataFile } from "../../lib/storage";

const DEFAULT_SETTINGS = { social: { facebook: "", instagram: "", youtube: "" } };

async function readSettings(): Promise<any> {
  return readDataFile("settings", DEFAULT_SETTINGS);
}

export const GET: APIRoute = async () => {
  const data = await readSettings();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });

  const body = await request.json();
  const current = await readSettings();
  const updated = {
    ...current,
    ...body,
    social: { ...current.social, ...(body.social || {}) },
  };
  await writeDataFile("settings", updated);
  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};
