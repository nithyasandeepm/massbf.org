import crypto from "node:crypto";
import { readDataFile, writeDataFile } from "./storage";

const SECRET = "mbf-internal-2026";

interface User { username: string; password: string; }
interface AuthData { users: User[]; }

const DEFAULT_AUTH: AuthData = {
  users: [{ username: "admin", password: process.env.ADMIN_PASSWORD || "mbfadmin2026" }],
};

async function readAuth(): Promise<AuthData> {
  const data = await readDataFile("auth", DEFAULT_AUTH);
  if (Array.isArray(data?.users)) return data as AuthData;
  if (data?.password) return { users: [{ username: "admin", password: data.password }] };
  return DEFAULT_AUTH;
}

async function writeAuth(data: AuthData): Promise<void> {
  await writeDataFile("auth", data);
}

function computeToken(username: string, password: string): string {
  return crypto.createHmac("sha256", SECRET).update(`${username}:${password}`).digest("hex");
}

export async function login(username: string, password: string): Promise<string | null> {
  const { users } = await readAuth();
  const user = users.find(u => u.username === username && u.password === password);
  return user ? computeToken(user.username, user.password) : null;
}

export async function isValidToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const { users } = await readAuth();
  return users.some(u => computeToken(u.username, u.password) === token);
}

export async function getUsernameFromToken(token: string | null | undefined): Promise<string | null> {
  if (!token) return null;
  const { users } = await readAuth();
  return users.find(u => computeToken(u.username, u.password) === token)?.username ?? null;
}

export async function listUsernames(): Promise<string[]> {
  return (await readAuth()).users.map(u => u.username);
}

export async function addUser(username: string, password: string): Promise<{ error?: string }> {
  if (!username.trim() || !password.trim()) return { error: "Username and password are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  const auth = await readAuth();
  if (auth.users.find(u => u.username === username.trim())) return { error: "Username already exists." };
  auth.users.push({ username: username.trim(), password });
  await writeAuth(auth);
  return {};
}

export async function removeUser(username: string): Promise<{ error?: string }> {
  const auth = await readAuth();
  if (auth.users.length <= 1) return { error: "Cannot remove the last admin user." };
  auth.users = auth.users.filter(u => u.username !== username);
  await writeAuth(auth);
  return {};
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ error?: string }> {
  const auth = await readAuth();
  const user = auth.users.find(u => computeToken(u.username, u.password) === token);
  if (!user) return { error: "Unauthorized." };
  if (user.password !== currentPassword) return { error: "Current password is incorrect." };
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };
  user.password = newPassword;
  await writeAuth(auth);
  return {};
}
