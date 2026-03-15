import { i as isValidToken } from '../../chunks/auth_DoIY59Eb.mjs';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
export { renderers } from '../../renderers.mjs';

const DATA_FILE = join(process.cwd(), "src/data/sponsors.json");
async function readSponsors() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}
const GET = async () => {
  const data = await readSponsors();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const body = await request.json();
  const sponsors = await readSponsors();
  const newSponsor = {
    id: Date.now().toString(),
    name: body.name || "",
    website: body.website || "",
    logo: body.logo || "",
    event: body.event || ""
  };
  sponsors.push(newSponsor);
  await writeFile(DATA_FILE, JSON.stringify(sponsors, null, 2));
  return new Response(JSON.stringify(newSponsor), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
};
const PUT = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const body = await request.json();
  const sponsors = await readSponsors();
  const idx = sponsors.findIndex((s) => s.id === body.id);
  if (idx === -1) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  sponsors[idx] = {
    ...sponsors[idx],
    name: body.name ?? sponsors[idx].name,
    website: body.website ?? sponsors[idx].website,
    logo: body.logo ?? sponsors[idx].logo,
    event: body.event ?? (sponsors[idx].event || "")
  };
  await writeFile(DATA_FILE, JSON.stringify(sponsors, null, 2));
  return new Response(JSON.stringify(sponsors[idx]), {
    headers: { "Content-Type": "application/json" }
  });
};
const DELETE = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const sponsors = await readSponsors();
  await writeFile(DATA_FILE, JSON.stringify(sponsors.filter((s) => s.id !== id), null, 2));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
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
