import type { APIRoute } from "astro";
import {
  login, isValidToken, getUsernameFromToken,
  listUsernames, addUser, removeUser, changePassword
} from "../../lib/auth";

export const GET: APIRoute = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  const valid = await isValidToken(token);
  const action = url.searchParams.get("action");

  if (action === "users") {
    if (!valid)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ usernames: await listUsernames() }), { headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ valid, username: valid ? await getUsernameFromToken(token) : null }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, url }) => {
  const action = url.searchParams.get("action");
  const body = await request.json();

  if (action === "addUser") {
    const token = request.headers.get("X-Admin-Token") || "";
    if (!await isValidToken(token))
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    const result = await addUser(body.username || "", body.password || "");
    if (result.error)
      return new Response(JSON.stringify({ error: result.error }), { status: 400, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }

  const token = await login(body.username || "", body.password || "");
  if (!token)
    return new Response(JSON.stringify({ success: false }), { status: 401, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true, token, username: body.username }), { headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const body = await request.json();
  const result = await changePassword(token, (body.currentPassword || "").trim(), (body.newPassword || "").trim());
  if (result.error)
    return new Response(JSON.stringify({ error: result.error }), { status: 400, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!await isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const username = url.searchParams.get("username") || "";
  const result = await removeUser(username);
  if (result.error)
    return new Response(JSON.stringify({ error: result.error }), { status: 400, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
