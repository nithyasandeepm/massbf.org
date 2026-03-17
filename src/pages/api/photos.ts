import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { listUploadedFiles, deleteUploadedFile } from "../../lib/storage";
import { basename } from "node:path";

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get("type") || "gallery";
  if (!["birthday", "gallery"].includes(type))
    return new Response("[]", { headers: { "Content-Type": "application/json" } });

  const files = await listUploadedFiles(type);
  return new Response(JSON.stringify(files), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });

  const type = url.searchParams.get("type") || "";
  const filename = url.searchParams.get("file") || "";

  if (!["birthday", "gallery"].includes(type) || !filename)
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });

  await deleteUploadedFile(type, basename(filename));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
