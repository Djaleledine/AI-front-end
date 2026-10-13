import { NextResponse } from "next/server";
import { MOCK_REVIEWS } from "../../../services/mockApi";

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    count: MOCK_REVIEWS.length,
    data: MOCK_REVIEWS
  });
}
