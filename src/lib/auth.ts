import crypto from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SECRET = "mbf-internal-2026";
const AUTH_FILE = join(process.cwd(), "src/data/auth.json");

interface User { username: string; password: string; }
interface AuthData { users: User[]; }

function readAuth(): AuthData {
  try {
    const raw = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
    if (Array.isArray(raw.users)) return raw as AuthData;
    // Migrate old single-password format
    if (raw.password) return { users: [{ username: "admin", password: raw.password }] };
  } catch {}
  return { users: [{ username: "admin", password: process.env.ADMIN_PASSWORD || "mbfadmin2026" }] };
}

function writeAuth(data: AuthData): void {
  writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2));
}

function computeToken(username: string, password: string): string {
  return crypto.createHmac("sha256", SECRET).update(`${username}:${password}`).digest("hex");
}

export function login(username: string, password: string): string | null {
  const { users } = readAuth();
  const user = users.find(u => u.username === username && u.password === password);
  return user ? computeToken(user.username, user.password) : null;
}

export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return readAuth().users.some(u => computeToken(u.username, u.password) === token);
}

export function getUsernameFromToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const user = readAuth().users.find(u => computeToken(u.username, u.password) === token);
  return user?.username ?? null;
}

export function listUsernames(): string[] {
  return readAuth().users.map(u => u.username);
}

export function addUser(username: string, password: string): { error?: string } {
  if (!username.trim() || !password.trim()) return { error: "Username and password are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  const auth = readAuth();
  if (auth.users.find(u => u.username === username.trim())) return { error: "Username already exists." };
  auth.users.push({ username: username.trim(), password });
  writeAuth(auth);
  return {};
}

export function removeUser(username: string): { error?: string } {
  const auth = readAuth();
  if (auth.users.length <= 1) return { error: "Cannot remove the last admin user." };
  auth.users = auth.users.filter(u => u.username !== username);
  writeAuth(auth);
  return {};
}

export function changePassword(token: string, currentPassword: string, newPassword: string): { error?: string } {
  const auth = readAuth();
  const user = auth.users.find(u => computeToken(u.username, u.password) === token);
  if (!user) return { error: "Unauthorized." };
  if (user.password !== currentPassword) return { error: "Current password is incorrect." };
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };
  user.password = newPassword;
  writeAuth(auth);
  return {};
}
