import crypto from "node:crypto";

const SECRET = "mbf-internal-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mbfadmin2026";

function generateToken(): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(ADMIN_PASSWORD)
    .digest("hex");
}

export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return token === generateToken();
}

export function login(password: string): string | null {
  if (password !== ADMIN_PASSWORD) return null;
  return generateToken();
}
