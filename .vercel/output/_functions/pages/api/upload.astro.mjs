import { i as isValidToken } from '../../chunks/auth_DoIY59Eb.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const formData = await request.formData();
  const type = formData.get("type");
  const file = formData.get("file");
  if (!file || !["birthday", "gallery", "sponsors"].includes(type)) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const uploadDir = join(process.cwd(), "public", "uploads", type);
  await mkdir(uploadDir, { recursive: true });
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);
  return new Response(
    JSON.stringify({ success: true, url: `/uploads/${type}/${filename}` }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
