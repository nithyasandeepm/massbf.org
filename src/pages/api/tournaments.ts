import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_FILE = join(process.cwd(), "src/data/tournaments.json");

async function readTournaments(): Promise<any[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export const GET: APIRoute = async () => {
  const data = await readTournaments();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const tournaments = await readTournaments();

  const newTournament = {
    id: Date.now().toString(),
    name: body.name,
    dates: body.dates,
    link: body.link || "",
    status: body.status || "upcoming",
  };

  tournaments.unshift(newTournament);
  await writeFile(DATA_FILE, JSON.stringify(tournaments, null, 2));

  return new Response(JSON.stringify(newTournament), {
    status: 201,
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
  const tournaments = await readTournaments();
  const idx = tournaments.findIndex((t) => t.id === body.id);

  if (idx === -1) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  tournaments[idx] = {
    ...tournaments[idx],
    name: body.name,
    dates: body.dates,
    link: body.link || "",
    status: body.status || tournaments[idx].status,
  };

  await writeFile(DATA_FILE, JSON.stringify(tournaments, null, 2));
  return new Response(JSON.stringify(tournaments[idx]), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tournaments = await readTournaments();
  const filtered = tournaments.filter((t) => t.id !== id);
  await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
