/**
 * SigMotion Supabase setup helper
 * - Verifies API connection
 * - Creates storage buckets if missing
 * Run: node scripts/setup-supabase.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnv() {
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=");
  }
  return env;
}

const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

async function api(path, options = {}) {
  const res = await fetch(`${URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { ok: res.ok, status: res.status, body };
}

async function createBucket(name, isPublic) {
  const existing = await api("/storage/v1/bucket");
  if (existing.ok && Array.isArray(existing.body)) {
    if (existing.body.some((b) => b.name === name || b.id === name)) {
      console.log(`✓ Bucket "${name}" already exists`);
      return;
    }
  }

  const result = await api("/storage/v1/bucket", {
    method: "POST",
    body: JSON.stringify({
      name,
      public: isPublic,
      file_size_limit: 5242880,
      allowed_mime_types: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    }),
  });

  if (result.ok || result.status === 409) {
    console.log(`✓ Bucket "${name}" ready (${isPublic ? "public" : "private"})`);
  } else {
    console.error(`✗ Failed to create bucket "${name}":`, result.body);
  }
}

async function checkTable(table) {
  const res = await fetch(`${URL}/rest/v1/${table}?select=*&limit=1`, {
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
  });
  return res.status !== 404 && res.status !== 406;
}

async function main() {
  console.log("SigMotion Supabase Setup\n");
  console.log(`Project: ${URL}\n`);

  // Test auth endpoint
  const health = await fetch(`${URL}/auth/v1/health`, {
    headers: { apikey: ANON_KEY },
  });
  console.log(health.ok ? "✓ Supabase API reachable" : "✗ Supabase API unreachable");

  // Check tables
  const tables = ["profiles", "signatures", "organizations"];
  let schemaReady = true;
  for (const table of tables) {
    const exists = await checkTable(table);
    console.log(exists ? `✓ Table "${table}" exists` : `✗ Table "${table}" missing — run migration SQL`);
    if (!exists) schemaReady = false;
  }

  // Storage buckets
  await createBucket("signatures-public", true);
  await createBucket("uploads-private", false);

  console.log("\n--- Next steps ---");
  if (!schemaReady) {
    console.log("1. Open Supabase Dashboard → SQL Editor");
    console.log("2. Paste and run: supabase/migrations/001_initial_schema.sql");
    console.log("3. Re-run: node scripts/setup-supabase.mjs");
  } else {
    console.log("Schema looks good! Run: npm run dev");
  }
  console.log("4. Enable Email auth in Supabase Dashboard → Authentication → Providers");
  console.log("5. Add redirect URL: http://localhost:3000/auth/callback");
}

main().catch(console.error);
