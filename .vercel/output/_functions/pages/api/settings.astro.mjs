import { i as isValidToken } from '../../chunks/auth_DoIY59Eb.mjs';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
export { renderers } from '../../renderers.mjs';

const DATA_FILE = join(process.cwd(), "src/data/settings.json");
async function readSettings() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return { social: { facebook: "", instagram: "", youtube: "" } };
  }
}
const GET = async () => {
  const data = await readSettings();
  return new Response(JSON.stringify(data), {
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
  const current = await readSettings();
  const updated = {
    ...current,
    ...body,
    social: { ...current.social, ...body.social || {} }
  };
  await writeFile(DATA_FILE, JSON.stringify(updated, null, 2));
  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
