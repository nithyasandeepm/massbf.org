import { i as isValidToken } from '../../chunks/auth_DoIY59Eb.mjs';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
export { renderers } from '../../renderers.mjs';

const DATA_FILE = join(process.cwd(), "src/data/pages.json");
const RESERVED = /* @__PURE__ */ new Set(["about", "events", "pca", "sponsors", "donate", "api", "uploads"]);
async function readPages() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}
const GET = async () => {
  return new Response(JSON.stringify(await readPages()), {
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
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
  await writeFile(DATA_FILE, JSON.stringify(pages, null, 2));
  return new Response(JSON.stringify(newPage), { status: 201, headers: { "Content-Type": "application/json" } });
};
const PUT = async ({ request }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
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
  await writeFile(DATA_FILE, JSON.stringify(pages, null, 2));
  return new Response(JSON.stringify(pages[idx]), { headers: { "Content-Type": "application/json" } });
};
const DELETE = async ({ request, url }) => {
  if (!isValidToken(request.headers.get("X-Admin-Token") || ""))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers: { "Content-Type": "application/json" } });
  const pages = await readPages();
  await writeFile(DATA_FILE, JSON.stringify(pages.filter((p) => p.id !== id), null, 2));
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
