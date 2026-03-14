import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_FILE = join(process.cwd(), "src/data/sponsor-events.json");

async function read(): Promise<any[]> {
  try { return JSON.parse(await readFile(DATA_FILE, "utf-8")); }
  catch { return []; }
}
async function save(data: any[]) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await read()), { headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ request }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const data = await read();

  if (body.type === "event") {
    const name  = (body.name  || "").trim();
    const year  = parseInt(body.year)  || new Date().getFullYear();
    const month = parseInt(body.month) || 1;
    if (!name) return new Response(JSON.stringify({ error: "Event name required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    const ev = { id: Date.now().toString(), name, year, month, sponsors: [] };
    data.push(ev);
    await save(data);
    return new Response(JSON.stringify(ev), { status: 201, headers: { "Content-Type": "application/json" } });
  }

  if (body.type === "sponsor") {
    const { eventId, name, website, logo } = body;
    const ev = data.find((e: any) => e.id === eventId);
    if (!ev) return new Response(JSON.stringify({ error: "Event not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    if (!(name || "").trim()) return new Response(JSON.stringify({ error: "Sponsor name required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    const sp = { id: Date.now().toString(), name: (name || "").trim(), website: (website || "").trim(), logo: (logo || "").trim() };
    ev.sponsors.push(sp);
    await save(data);
    return new Response(JSON.stringify(sp), { status: 201, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ request }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const data = await read();

  if (body.type === "event") {
    const idx = data.findIndex((e: any) => e.id === body.id);
    if (idx === -1) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    data[idx] = { ...data[idx], name: body.name ?? data[idx].name, year: parseInt(body.year) || data[idx].year, month: parseInt(body.month) || data[idx].month };
    await save(data);
    return new Response(JSON.stringify(data[idx]), { headers: { "Content-Type": "application/json" } });
  }

  if (body.type === "sponsor") {
    const ev = data.find((e: any) => e.id === body.eventId);
    if (!ev) return new Response(JSON.stringify({ error: "Event not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    const si = ev.sponsors.findIndex((s: any) => s.id === body.id);
    if (si === -1) return new Response(JSON.stringify({ error: "Sponsor not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    ev.sponsors[si] = { ...ev.sponsors[si], name: body.name ?? ev.sponsors[si].name, website: body.website ?? ev.sponsors[si].website, logo: body.logo ?? ev.sponsors[si].logo };
    await save(data);
    return new Response(JSON.stringify(ev.sponsors[si]), { headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: { "Content-Type": "application/json" } });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const type = url.searchParams.get("type");
  let data = await read();

  if (type === "event") {
    const id = url.searchParams.get("id");
    await save(data.filter((e: any) => e.id !== id));
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }

  if (type === "sponsor") {
    const eventId = url.searchParams.get("eventId");
    const sponsorId = url.searchParams.get("sponsorId");
    const ev = data.find((e: any) => e.id === eventId);
    if (!ev) return new Response(JSON.stringify({ error: "Event not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    ev.sponsors = ev.sponsors.filter((s: any) => s.id !== sponsorId);
    await save(data);
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: { "Content-Type": "application/json" } });
};
