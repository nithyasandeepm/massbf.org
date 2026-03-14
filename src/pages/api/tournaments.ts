import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_FILE = join(process.cwd(), "src/data/tournaments.json");

export const GET: APIRoute = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response("[]", {
      headers: { "Content-Type": "application/json" },
    });
  }
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
  let tournaments: any[] = [];
  try {
    tournaments = JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {}

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
