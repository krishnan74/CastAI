import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest): Promise<Response> {
  return NextResponse.json("disablePersonality");
}
