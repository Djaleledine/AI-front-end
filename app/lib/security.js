import crypto from "crypto";

const RATE_LIMIT_MAP = global.__anjuciaRateLimitMap || new Map();
if (!global.__anjuciaRateLimitMap) {
  global.__anjuciaRateLimitMap = RATE_LIMIT_MAP;
}

const ACTIVE_ADMIN_SESSIONS = global.__anjuciaAdminSessions || new Map();
if (!global.__anjuciaAdminSessions) {
  global.__anjuciaAdminSessions = ACTIVE_ADMIN_SESSIONS;
}

// Never reuse GEMINI_API_KEY or a static source-code literal.
// If ADMIN_SESSION_SECRET is missing, generate a per-process 32-byte cryptographic random key.
if (!global.__anjuciaSessionSecret) {
  if (
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32 &&
    !process.env.ADMIN_SESSION_SECRET.startsWith("replace_with_")
  ) {
    global.__anjuciaSessionSecret = process.env.ADMIN_SESSION_SECRET;
  } else {
    global.__anjuciaSessionSecret = crypto.randomBytes(32).toString("hex");
  }
}
const SESSION_SECRET = global.__anjuciaSessionSecret;

export const ADMIN_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-anjucia_admin_session"
    : "anjucia_admin_session";

export const DERMOSCAN_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-anjucia_dermoscan_unlocked"
    : "anjucia_dermoscan_unlocked";

const MAX_RATE_LIMIT_ENTRIES = 5000;

function pruneRateLimitMap(now) {
  if (RATE_LIMIT_MAP.size < MAX_RATE_LIMIT_ENTRIES) return;
  for (const [k, v] of RATE_LIMIT_MAP.entries()) {
    if (now > v.resetAt) {
      RATE_LIMIT_MAP.delete(k);
    }
  }
  if (RATE_LIMIT_MAP.size >= MAX_RATE_LIMIT_ENTRIES) {
    const oldestKey = RATE_LIMIT_MAP.keys().next().value;
    if (oldestKey) RATE_LIMIT_MAP.delete(oldestKey);
  }
}

/**
 * Extracts client IP safely. Only trusts proxy headers when TRUST_PROXY=true,
 * taking the right-most hop added by the reverse proxy to prevent XFF spoofing.
 */
export function getClientIp(request) {
  if (process.env.TRUST_PROXY === "true") {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      const hops = forwarded
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (hops.length > 0) {
        return hops[hops.length - 1];
      }
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
  }
  return request.ip || "127.0.0.1";
}

/**
 * Sliding-window rate limiter with bounded memory map and optional global ceiling.
 */
export function checkRateLimit(
  bucket,
  ip,
  maxRequests = 30,
  windowMs = 60_000,
  globalMaxRequests = null
) {
  const now = Date.now();
  pruneRateLimitMap(now);

  // 1. Optional global bucket check (prevents distributed / spoofed-IP brute force)
  if (typeof globalMaxRequests === "number" && globalMaxRequests > 0) {
    const globalKey = `${bucket}:__global__`;
    const globalRec = RATE_LIMIT_MAP.get(globalKey) || {
      count: 0,
      resetAt: now + windowMs
    };
    if (now > globalRec.resetAt) {
      globalRec.count = 1;
      globalRec.resetAt = now + windowMs;
    } else {
      globalRec.count += 1;
    }
    RATE_LIMIT_MAP.set(globalKey, globalRec);

    if (globalRec.count > globalMaxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSec: Math.ceil((globalRec.resetAt - now) / 1000)
      };
    }
  }

  // 2. Per-client bucket check
  const key = `${bucket}:${ip}`;
  const record = RATE_LIMIT_MAP.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    RATE_LIMIT_MAP.set(key, record);
    return { allowed: true, remaining: maxRequests - 1, resetAt: record.resetAt };
  }

  record.count += 1;
  RATE_LIMIT_MAP.set(key, record);

  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((record.resetAt - now) / 1000)
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - record.count),
    resetAt: record.resetAt
  };
}

/**
 * Reads and parses a JSON request body while enforcing a strict byte ceiling.
 */
export async function readBoundedJsonBody(request, maxBytes = 24 * 1024) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    const err = new Error("Payload Too Large");
    err.status = 413;
    throw err;
  }
  const rawText = await request.text();
  if (Buffer.byteLength(rawText, "utf8") > maxBytes) {
    const err = new Error("Payload Too Large");
    err.status = 413;
    throw err;
  }
  try {
    return JSON.parse(rawText || "{}");
  } catch {
    const err = new Error("Invalid JSON payload");
    err.status = 400;
    throw err;
  }
}

/**
 * Fetch Metadata Resource Isolation Policy (Sec-Fetch-Site check).
 * Rejects cross-site non-navigational requests before auth or DB processing.
 */
export function verifyFetchMetadata(request) {
  const site = request.headers.get("sec-fetch-site");
  const mode = request.headers.get("sec-fetch-mode");
  const dest = request.headers.get("sec-fetch-dest");

  if (!site) {
    return { allowed: true };
  }

  if (["same-origin", "same-site", "none"].includes(site)) {
    return { allowed: true };
  }

  if (
    site === "cross-site" &&
    mode === "navigate" &&
    request.method === "GET" &&
    !["object", "embed"].includes(dest || "")
  ) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: "Cross-site request blocked by Fetch Metadata resource isolation policy."
  };
}

/**
 * Strips HTML tags and control characters, enforcing max length.
 */
export function sanitizeText(value, maxLength = 300) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalizes phone numbers.
 */
export function sanitizePhone(phone) {
  return String(phone || "")
    .replace(/[^\d+\s-]/g, "")
    .trim()
    .slice(0, 24);
}

/**
 * Validates Algerian mobile/landline phone numbers (05/06/07/02/03/04 or +213).
 */
export function isValidAlgerianPhone(phone) {
  const digits = String(phone || "").replace(/[\s.-]/g, "");
  return /^(?:\+?213|0)[2-7]\d{7,8}$/.test(digits);
}

/**
 * Masks credentials in MongoDB connection strings before sending status to UI.
 */
export function maskMongoUri(uri) {
  if (!uri || typeof uri !== "string") return "";
  return uri.replace(/(\/\/[^:]+:)([^@]+)(@)/, "$1********$3");
}

/**
 * Constant-time string comparison to prevent timing side-channel attacks.
 */
export function safeCompare(a, b) {
  const strA = String(a || "");
  const strB = String(b || "");
  const bufA = Buffer.from(strA, "utf8");
  const bufB = Buffer.from(strB, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Hashes an admin PIN using PBKDF2-HMAC-SHA256 with a random 16-byte salt.
 */
export function hashAdminPin(pin) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto
    .pbkdf2Sync(String(pin), salt, 100_000, 32, "sha256")
    .toString("hex");
  return `pbkdf2$${salt}$${derived}`;
}

/**
 * Verifies a candidate PIN against either a PBKDF2 hash or process.env.ADMIN_PIN.
 */
export function verifyAdminPin(candidatePin, storedPinHash = null) {
  if (!candidatePin || typeof candidatePin !== "string") return false;

  if (storedPinHash && storedPinHash.startsWith("pbkdf2$")) {
    const parts = storedPinHash.split("$");
    if (parts.length === 3) {
      const [, salt, expectedHex] = parts;
      const derived = crypto
        .pbkdf2Sync(candidatePin, salt, 100_000, 32, "sha256")
        .toString("hex");
      if (safeCompare(derived, expectedHex)) return true;
    }
  }

  const envPin = process.env.ADMIN_PIN;
  if (envPin && safeCompare(candidatePin, envPin)) {
    return true;
  }

  return false;
}

/**
 * Creates a signed server-side admin session token (zero PIN material inside token)
 * and registers it in ACTIVE_ADMIN_SESSIONS for server-side revocation.
 */
export function createAdminSessionToken() {
  const sessionId = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8; // 8 hours
  ACTIVE_ADMIN_SESSIONS.set(sessionId, { expiresAt });

  // Prune expired sessions
  for (const [id, meta] of ACTIVE_ADMIN_SESSIONS.entries()) {
    if (Date.now() > meta.expiresAt) {
      ACTIVE_ADMIN_SESSIONS.delete(id);
    }
  }

  const payload = `${sessionId}.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Revokes a session token on logout or PIN rotation.
 */
export function revokeAdminSessionToken(token) {
  if (!token || typeof token !== "string") return;
  const sessionId = token.split(".")[0];
  if (sessionId) {
    ACTIVE_ADMIN_SESSIONS.delete(sessionId);
  }
}

/**
 * Revokes all active admin sessions (e.g. when the admin PIN is changed).
 */
export function revokeAllAdminSessions() {
  ACTIVE_ADMIN_SESSIONS.clear();
}

/**
 * Verifies the signed HMAC-SHA256 admin session token against ACTIVE_ADMIN_SESSIONS.
 */
export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [sessionId, expiresAtStr, providedSig] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!expiresAt || Date.now() > expiresAt) {
    ACTIVE_ADMIN_SESSIONS.delete(sessionId);
    return false;
  }

  const payload = `${sessionId}.${expiresAtStr}`;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");

  if (!safeCompare(providedSig, expectedSig)) return false;

  const activeSession = ACTIVE_ADMIN_SESSIONS.get(sessionId);
  if (!activeSession || Date.now() > activeSession.expiresAt) {
    ACTIVE_ADMIN_SESSIONS.delete(sessionId);
    return false;
  }

  return true;
}

/**
 * Checks whether an incoming request to /api/admin is authenticated via
 * HttpOnly session cookie or x-admin-pin header.
 */
export function isAuthorizedAdminRequest(request, storedPinHash = null) {
  // 1. Check HttpOnly cookie (support both prod __Host- and dev cookie names)
  const prodCookie = request.cookies?.get?.("__Host-anjucia_admin_session")?.value;
  const devCookie = request.cookies?.get?.("anjucia_admin_session")?.value;
  const cookieToken = prodCookie || devCookie;
  if (cookieToken && verifyAdminSessionToken(cookieToken)) {
    return true;
  }

  // 2. Check x-admin-pin header (for server-to-server CLI automation)
  const headerPin = request.headers.get("x-admin-pin");
  if (headerPin && verifyAdminPin(headerPin, storedPinHash)) {
    return true;
  }

  return false;
}

/**
 * Creates a signed token granting access to DermoScan AI™ when unlocked.
 * Lasts 24 hours.
 */
export function createDermoScanAccessToken() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const salt = crypto.randomBytes(12).toString("hex");
  const payload = `dermoscan.${expiresAt}.${salt}`;
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Verifies a DermoScan AI™ access token.
 */
export function verifyDermoScanAccessToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [prefix, expiresAtStr, salt, providedSig] = parts;
  if (prefix !== "dermoscan") return false;

  const expiresAt = Number(expiresAtStr);
  if (!expiresAt || Date.now() > expiresAt) return false;

  const payload = `${prefix}.${expiresAtStr}.${salt}`;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");

  return safeCompare(providedSig, expectedSig);
}

/**
 * Validates the DermoScan access password against process.env.DERMOSCAN_ACCESS_PASSWORD
 * using constant-time comparison.
 */
export function verifyDermoScanPassword(candidate) {
  const envPassword = process.env.DERMOSCAN_ACCESS_PASSWORD;
  if (!envPassword || typeof candidate !== "string") return false;
  return safeCompare(candidate.trim(), envPassword.trim());
}

/**
 * Checks whether an incoming request to /api/dermoscan has verified access.
 * Returns true if:
 * 1. An authorized Admin session exists, OR
 * 2. A valid signed DermoScan unlock cookie is present, OR
 * 3. A valid Authorization Bearer / x-dermoscan-key matches DERMOSCAN_ACCESS_PASSWORD.
 */
export function isAuthorizedDermoScanRequest(request) {
  // 1. Authorized Admin session
  if (isAuthorizedAdminRequest(request)) {
    return true;
  }

  // 2. Check signed DermoScan unlock cookie (supports both prod __Host- and dev names)
  const prodCookie = request.cookies?.get?.("__Host-anjucia_dermoscan_unlocked")?.value;
  const devCookie = request.cookies?.get?.("anjucia_dermoscan_unlocked")?.value;
  const cookieToken = prodCookie || devCookie;
  if (cookieToken && verifyDermoScanAccessToken(cookieToken)) {
    return true;
  }

  // 3. Direct header verification (for programmatic tests / API keys)
  const headerKey = request.headers.get("x-dermoscan-key");
  if (headerKey && verifyDermoScanPassword(headerKey)) {
    return true;
  }

  return false;
}
