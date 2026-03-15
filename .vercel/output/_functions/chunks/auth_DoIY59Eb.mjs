import crypto from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SECRET = "mbf-internal-2026";
const AUTH_FILE = join(process.cwd(), "src/data/auth.json");
function readAuth() {
  try {
    const raw = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
    if (Array.isArray(raw.users)) return raw;
    if (raw.password) return { users: [{ username: "admin", password: raw.password }] };
  } catch {
  }
  return { users: [{ username: "admin", password: process.env.ADMIN_PASSWORD || "mbfadmin2026" }] };
}
function writeAuth(data) {
  writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2));
}
function computeToken(username, password) {
  return crypto.createHmac("sha256", SECRET).update(`${username}:${password}`).digest("hex");
}
function login(username, password) {
  const { users } = readAuth();
  const user = users.find((u) => u.username === username && u.password === password);
  return user ? computeToken(user.username, user.password) : null;
}
function isValidToken(token) {
  if (!token) return false;
  return readAuth().users.some((u) => computeToken(u.username, u.password) === token);
}
function getUsernameFromToken(token) {
  if (!token) return null;
  const user = readAuth().users.find((u) => computeToken(u.username, u.password) === token);
  return user?.username ?? null;
}
function listUsernames() {
  return readAuth().users.map((u) => u.username);
}
function addUser(username, password) {
  if (!username.trim() || !password.trim()) return { error: "Username and password are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  const auth = readAuth();
  if (auth.users.find((u) => u.username === username.trim())) return { error: "Username already exists." };
  auth.users.push({ username: username.trim(), password });
  writeAuth(auth);
  return {};
}
function removeUser(username) {
  const auth = readAuth();
  if (auth.users.length <= 1) return { error: "Cannot remove the last admin user." };
  auth.users = auth.users.filter((u) => u.username !== username);
  writeAuth(auth);
  return {};
}
function changePassword(token, currentPassword, newPassword) {
  const auth = readAuth();
  const user = auth.users.find((u) => computeToken(u.username, u.password) === token);
  if (!user) return { error: "Unauthorized." };
  if (user.password !== currentPassword) return { error: "Current password is incorrect." };
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };
  user.password = newPassword;
  writeAuth(auth);
  return {};
}

export { addUser as a, login as b, changePassword as c, getUsernameFromToken as g, isValidToken as i, listUsernames as l, removeUser as r };
