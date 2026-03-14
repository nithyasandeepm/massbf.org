import crypto from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SECRET = "mbf-internal-2026";
const AUTH_FILE = join(process.cwd(), "src/data/auth.json");

export function getAdminPassword(): string {
  try {
    const data = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
    if (data.password) return data.password;
  } catch {}
  return process.env.ADMIN_PASSWORD || "mbfadmin2026";
}

export function changeAdminPassword(newPassword: string): void {
  writeFileSync(AUTH_FILE, JSON.stringify({ password: newPassword }, null, 2));
}

function generateToken(): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(getAdminPassword())
    .digest("hex");
}

export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return token === generateToken();
}

export function login(password: string): string | null {
  if (password !== getAdminPassword()) return null;
  return generateToken();
}
