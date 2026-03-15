import { i as isValidToken } from '../../chunks/auth_DoIY59Eb.mjs';
import { readdir, unlink } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { existsSync } from 'node:fs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  const type = url.searchParams.get("type") || "gallery";
  if (!["birthday", "gallery"].includes(type)) {
    return new Response("[]", {
      headers: { "Content-Type": "application/json" }
    });
  }
  const uploadDir = join(process.cwd(), "public", "uploads", type);
  let files = [];
  if (existsSync(uploadDir)) {
    const dirFiles = await readdir(uploadDir);
    files = dirFiles.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).sort().reverse().map((f) => `/uploads/${type}/${f}`);
  }
  return new Response(JSON.stringify(files), {
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
  const type = url.searchParams.get("type") || "";
  const filename = url.searchParams.get("file") || "";
  if (!["birthday", "gallery"].includes(type) || !filename) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const safeFilename = basename(filename);
  const filePath = join(process.cwd(), "public", "uploads", type, safeFilename);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
