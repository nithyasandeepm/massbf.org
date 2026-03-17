import type { APIRoute } from "astro";
import { isValidToken } from "../../lib/auth";
import { saveUploadedFile } from "../../lib/storage";

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });

  const formData = await request.formData();
  const type = formData.get("type") as string;
  const file = formData.get("file") as File;

  if (!file || !["birthday", "gallery", "sponsors"].includes(type))
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await saveUploadedFile(type, filename, buffer);

  return new Response(JSON.stringify({ success: true, url }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
};
