import { NextResponse } from "next/server";
import { MOCK_PHARMACIES } from "../../../services/mockApi";

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    count: MOCK_PHARMACIES.length,
    data: MOCK_PHARMACIES
  });
}
