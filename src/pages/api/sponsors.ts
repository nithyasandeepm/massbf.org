import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readDataFile, writeDataFile } from "../../lib/storage";

async function readSponsors(): Promise<any[]> {
  return readDataFile("sponsors", []);
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await readSponsors()), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });

  const body = await request.json();
  const sponsors = await readSponsors();
  const newSponsor = {
    id: Date.now().toString(),
    name: body.name || "",
    website: body.website || "",
    logo: body.logo || "",
    event: body.event || "",
  };
  sponsors.push(newSponsor);
  await writeDataFile("sponsors", sponsors);
  return new Response(JSON.stringify(newSponsor), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });

  const body = await request.json();
  const sponsors = await readSponsors();
  const idx = sponsors.findIndex((s) => s.id === body.id);
  if (idx === -1)
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: { "Content-Type": "application/json" },
    });

  sponsors[idx] = {
    ...sponsors[idx],
    name: body.name ?? sponsors[idx].name,
    website: body.website ?? sponsors[idx].website,
    logo: body.logo ?? sponsors[idx].logo,
    event: body.event ?? (sponsors[idx].event || ""),
  };
  await writeDataFile("sponsors", sponsors);
  return new Response(JSON.stringify(sponsors[idx]), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });

  const id = url.searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });

  const sponsors = await readSponsors();
  await writeDataFile("sponsors", sponsors.filter((s) => s.id !== id));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
