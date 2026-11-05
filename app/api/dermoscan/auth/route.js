import { NextResponse } from "next/server";
import {
  checkRateLimit,
  createDermoScanAccessToken,
  DERMOSCAN_COOKIE_NAME,
  getClientIp,
  isAuthorizedDermoScanRequest,
  readBoundedJsonBody,
  verifyDermoScanPassword,
  verifyFetchMetadata
} from "../../../lib/security";

export async function GET(request) {
  try {
    const fetchMeta = verifyFetchMetadata(request);
    if (!fetchMeta.allowed) {
      return NextResponse.json(
        { ok: false, error: fetchMeta.reason },
        { status: 403, headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
      );
    }

    const unlocked = isAuthorizedDermoScanRequest(request);
    return NextResponse.json(
      { ok: true, unlocked },
      { headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, unlocked: false, error: "Erreur lors de la vérification d'accès." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const fetchMeta = verifyFetchMetadata(request);
    if (!fetchMeta.allowed) {
      return NextResponse.json(
        { ok: false, error: fetchMeta.reason },
        { status: 403, headers: { Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site" } }
      );
    }

    const ip = getClientIp(request);
    // Rate limit unlock attempts to prevent brute force (5 attempts per 10 minutes)
    const rate = checkRateLimit("dermoscan-unlock", ip, 5, 10 * 60 * 1000, 20);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Trop de tentatives. Veuillez patienter ${rate.retryAfterSec} secondes avant de réessayer.`
        },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await readBoundedJsonBody(request, 10 * 1024);
    } catch (parseErr) {
      return NextResponse.json(
        { ok: false, error: parseErr.status === 413 ? "Payload trop volumineux." : "JSON invalide." },
        { status: parseErr.status || 400 }
      );
    }

    const { password } = body || {};
    const candidate = String(password || "").trim();

    if (!candidate || !verifyDermoScanPassword(candidate)) {
      return NextResponse.json(
        { ok: false, error: "Mot de passe d'accès incorrect." },
        { status: 401 }
      );
    }

    const token = createDermoScanAccessToken();
    const response = NextResponse.json({
      ok: true,
      unlocked: true,
      message: "Accès DermoScan AI™ déverrouillé avec succès."
    });

    response.cookies.set(DERMOSCAN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (err) {
    console.error("[DermoScan Auth Error]:", err?.message);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur lors de la validation." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const response = NextResponse.json({
      ok: true,
      unlocked: false,
      message: "Accès DermoScan AI™ verrouillé."
    });

    response.cookies.set(DERMOSCAN_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Impossible de reverrouiller." },
      { status: 500 }
    );
  }
}

