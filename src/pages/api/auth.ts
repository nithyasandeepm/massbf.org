import type { APIRoute } from "astro";
import { login, isValidToken, getAdminPassword, changeAdminPassword } from "../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const token = login(body.password);
  if (!token) {
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ success: true, token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const GET: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  return new Response(JSON.stringify({ valid: isValidToken(token) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const token = request.headers.get("X-Admin-Token") || "";
  if (!isValidToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const body = await request.json();
  const currentPassword = (body.currentPassword || "").trim();
  const newPassword     = (body.newPassword     || "").trim();

  if (currentPassword !== getAdminPassword())
    return new Response(JSON.stringify({ error: "Current password is incorrect." }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (newPassword.length < 8)
    return new Response(JSON.stringify({ error: "New password must be at least 8 characters." }), { status: 400, headers: { "Content-Type": "application/json" } });

  changeAdminPassword(newPassword);
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
