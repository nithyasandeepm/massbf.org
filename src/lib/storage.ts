import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const IS_VERCEL = !!process.env.VERCEL;
const DATA_PREFIX = "mbf-data/";
const UPLOADS_PREFIX = "mbf-uploads/";

async function blobGet(pathname: string): Promise<string | null> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: pathname, limit: 5 });
  const exact = blobs.find((b) => b.pathname === pathname);
  if (!exact) return null;
  const res = await fetch(exact.url + `?t=${Date.now()}`);
  return res.ok ? res.text() : null;
}

async function blobPut(
  pathname: string,
  content: string | Buffer,
  contentType: string
): Promise<string> {
  const { put } = await import("@vercel/blob");
  const blob = await put(pathname, content, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function readDataFile(name: string, fallback: any = null): Promise<any> {
  if (IS_VERCEL) {
    try {
      const raw = await blobGet(DATA_PREFIX + name + ".json");
      if (raw !== null) return JSON.parse(raw);
    } catch {}
  }
  try {
    const raw = await readFile(
      join(process.cwd(), "src/data", name + ".json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeDataFile(name: string, data: any): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  if (IS_VERCEL) {
    await blobPut(DATA_PREFIX + name + ".json", content, "application/json");
    return;
  }
  const filePath = join(process.cwd(), "src/data", name + ".json");
  await writeFile(filePath, content, "utf-8");
}

export async function saveUploadedFile(
  type: string,
  filename: string,
  buffer: Buffer
): Promise<string> {
  if (IS_VERCEL) {
    const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
    const ctMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    return blobPut(
      UPLOADS_PREFIX + type + "/" + filename,
      buffer,
      ctMap[ext] || "application/octet-stream"
    );
  }
  const uploadDir = join(process.cwd(), "public", "uploads", type);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);
  return `/uploads/${type}/${filename}`;
}

export async function listUploadedFiles(type: string): Promise<string[]> {
  if (IS_VERCEL) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: UPLOADS_PREFIX + type + "/" });
    return blobs
      .filter((b) => /\.(jpg|jpeg|png|gif|webp)$/i.test(b.pathname))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
      .map((b) => b.url);
  }
  const uploadDir = join(process.cwd(), "public", "uploads", type);
  if (!existsSync(uploadDir)) return [];
  const files = await readdir(uploadDir);
  return files
    .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .sort()
    .reverse()
    .map((f) => `/uploads/${type}/${f}`);
}

export async function deleteUploadedFile(
  type: string,
  filename: string
): Promise<void> {
  if (IS_VERCEL) {
    const { list, del } = await import("@vercel/blob");
    const target = UPLOADS_PREFIX + type + "/" + filename;
    const { blobs } = await list({ prefix: target, limit: 5 });
    const exact = blobs.find((b) => b.pathname === target);
    if (exact) await del(exact.url);
    return;
  }
  const filePath = join(process.cwd(), "public", "uploads", type, filename);
  if (existsSync(filePath)) await unlink(filePath);
}
