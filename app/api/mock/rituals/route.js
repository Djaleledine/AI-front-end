import { NextResponse } from "next/server";
import { MOCK_RITUALS } from "../../../services/mockApi";

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    count: MOCK_RITUALS.length,
    data: MOCK_RITUALS
  });
}
