import { NextResponse } from "next/server";
import { MOCK_BUNDLES } from "../../../services/mockApi";

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    count: MOCK_BUNDLES.length,
    data: MOCK_BUNDLES
  });
}
