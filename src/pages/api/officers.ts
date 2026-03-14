import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_FILE = join(process.cwd(), "src/data/officers.json");

async function readOfficers(): Promise<any[]> {
  try { return JSON.parse(await readFile(DATA_FILE, "utf-8")); }
  catch { return []; }
}

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await readOfficers()), {
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const name  = (body.name  || "").trim();
  const title = (body.title || "").trim();
  if (!name || !title)
    return new Response(JSON.stringify({ error: "Name and title are required" }), { status: 400, headers: { "Content-Type": "application/json" } });

  const officers = await readOfficers();
  const newOfficer = {
    id: Date.now().toString(),
    name,
    title,
    email:     (body.email     || "").trim(),
    instagram: (body.instagram || "").trim(),
    website:   (body.website   || "").trim(),
  };
  officers.push(newOfficer);
  await writeFile(DATA_FILE, JSON.stringify(officers, null, 2));
  return new Response(JSON.stringify(newOfficer), { status: 201, headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ request }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const officers = await readOfficers();
  const idx = officers.findIndex((o) => o.id === body.id);
  if (idx === -1)
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

  officers[idx] = {
    ...officers[idx],
    name:      (body.name      ?? officers[idx].name).trim(),
    title:     (body.title     ?? officers[idx].title).trim(),
    email:     (body.email     ?? (officers[idx].email     || "")).trim(),
    instagram: (body.instagram ?? (officers[idx].instagram || "")).trim(),
    website:   (body.website   ?? (officers[idx].website   || "")).trim(),
  };
  await writeFile(DATA_FILE, JSON.stringify(officers, null, 2));
  return new Response(JSON.stringify(officers[idx]), { headers: { "Content-Type": "application/json" } });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers: { "Content-Type": "application/json" } });

  const officers = await readOfficers();
  await writeFile(DATA_FILE, JSON.stringify(officers.filter((o) => o.id !== id), null, 2));
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
