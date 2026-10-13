import { NextResponse } from "next/server";
import { MOCK_WILAYAS_DATA } from "../../../services/mockApi";

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    count: MOCK_WILAYAS_DATA.length,
    data: MOCK_WILAYAS_DATA
  });
}
