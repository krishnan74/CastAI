import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
const NEXT_PUBLIC_URL = "https://cast-ai.vercel.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: "You enabled",
          action: "tx",
          postUrl: `${NEXT_PUBLIC_URL}/api/frame/`,
          target: `${NEXT_PUBLIC_URL}/api/enablePersonality/4`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/celeb-collage.jpg`,
        aspectRatio: "1:1",
      },
      input: {
        text: `Talk with your celebrity`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame/`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
