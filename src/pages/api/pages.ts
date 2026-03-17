import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readDataFile, writeDataFile } from "../../lib/storage";

const RESERVED = new Set(["about", "events", "pca", "sponsors", "donate", "api", "uploads"]);

async function readPages(): Promise<any[]> {
  return readDataFile("pages", []);
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await readPages()), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!await isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const label = (body.label || "").trim();
  const slug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
  const content = (body.content || "").trim();

  if (!label || !slug)
    return new Response(JSON.stringify({ error: "Label and slug are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (RESERVED.has(slug))
    return new Response(JSON.stringify({ error: `Slug "${slug}" is reserved` }), { status: 400, headers: { "Content-Type": "application/json" } });

  const pages = await readPages();
  if (pages.find((p) => p.slug === slug))
    return new Response(JSON.stringify({ error: `Slug "${slug}" already exists` }), { status: 409, headers: { "Content-Type": "application/json" } });

  const newPage = { id: Date.now().toString(), label, slug, content };
  pages.push(newPage);
  await writeDataFile("pages", pages);
  return new Response(JSON.stringify(newPage), { status: 201, headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ request }) => {
  if (!await isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const pages = await readPages();
  const idx = pages.findIndex((p) => p.id === body.id);
  if (idx === -1)
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

  const slug = (body.slug || pages[idx].slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
  if (RESERVED.has(slug))
    return new Response(JSON.stringify({ error: `Slug "${slug}" is reserved` }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (pages.some((p, i) => p.slug === slug && i !== idx))
    return new Response(JSON.stringify({ error: `Slug "${slug}" already exists` }), { status: 409, headers: { "Content-Type": "application/json" } });

  pages[idx] = { ...pages[idx], label: body.label ?? pages[idx].label, slug, content: body.content ?? pages[idx].content };
  await writeDataFile("pages", pages);
  return new Response(JSON.stringify(pages[idx]), { headers: { "Content-Type": "application/json" } });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!await isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const id = url.searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers: { "Content-Type": "application/json" } });

  const pages = await readPages();
  await writeDataFile("pages", pages.filter((p) => p.id !== id));
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
