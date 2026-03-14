import type { APIRoute } from "astro";
import { login, isValidToken } from "../../lib/auth";

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
