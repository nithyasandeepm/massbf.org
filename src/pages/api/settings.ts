import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_FILE = join(process.cwd(), "src/data/settings.json");

async function readSettings(): Promise<any> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return { social: { facebook: "", instagram: "", youtube: "" } };
  }
}

export const GET: APIRoute = async () => {
  const data = await readSettings();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const body = await request.json();
  const current = await readSettings();
  const updated = {
    ...current,
    ...body,
    social: { ...current.social, ...(body.social || {}) },
  };
  await writeFile(DATA_FILE, JSON.stringify(updated, null, 2));
  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};
