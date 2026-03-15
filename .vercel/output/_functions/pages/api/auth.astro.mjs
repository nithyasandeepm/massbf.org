import { i as isValidToken, l as listUsernames, g as getUsernameFromToken, a as addUser, b as login, c as changePassword, r as removeUser } from '../../chunks/auth_DoIY59Eb.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  const valid = isValidToken(token);
  const action = url.searchParams.get("action");
  if (action === "users") {
    if (!valid) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ usernames: listUsernames() }), { headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ valid, username: valid ? getUsernameFromToken(token) : null }), {
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request, url }) => {
  const action = url.searchParams.get("action");
  const body = await request.json();
  if (action === "addUser") {
    const token2 = request.headers.get("X-Admin-Token") || "";
    if (!isValidToken(token2)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    const result = addUser(body.username || "", body.password || "");
    if (result.error) return new Response(JSON.stringify({ error: result.error }), { status: 400, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }
  const token = login(body.username || "", body.password || "");
  if (!token) return new Response(JSON.stringify({ success: false }), { status: 401, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true, token, username: body.username }), { headers: { "Content-Type": "application/json" } });
};
const PUT = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const body = await request.json();
  const result = changePassword(token, (body.currentPassword || "").trim(), (body.newPassword || "").trim());
  if (result.error) return new Response(JSON.stringify({ error: result.error }), { status: 400, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
const DELETE = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const username = url.searchParams.get("username") || "";
  const result = removeUser(username);
  if (result.error) return new Response(JSON.stringify({ error: result.error }), { status: 400, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
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
