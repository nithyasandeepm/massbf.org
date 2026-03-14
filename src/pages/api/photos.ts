import type { APIRoute } from "astro";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get("type") || "gallery";
  if (!["birthday", "gallery"].includes(type)) {
    return new Response("[]", {
      headers: { "Content-Type": "application/json" },
    });
  }

  const uploadDir = join(process.cwd(), "public", "uploads", type);
  let files: string[] = [];

  if (existsSync(uploadDir)) {
    const dirFiles = await readdir(uploadDir);
    files = dirFiles
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .sort()
      .reverse()
      .map((f) => `/uploads/${type}/${f}`);
  }

  return new Response(JSON.stringify(files), {
    headers: { "Content-Type": "application/json" },
  });
};
