import { NextRequest, NextResponse } from "next/server";
import { getImage, runAgent, getMessageContent } from "./utils";

import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
  getFrameMetadata,
} from "@coinbase/onchainkit/frame";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  try {
    const framerequest: FrameRequest = await req.json();
    console.log("Frame request received:", framerequest);
    const { searchParams } = new URL(req.url);
    const description = searchParams.get("description");
    const celebPersonality1 = searchParams.get("celebPersonality1");
    const celebPersonality2 = searchParams.get("celebPersonality2");
    const celebPersonality3 = searchParams.get("celebPersonality3");
    const celebPersonality4 = searchParams.get("celebPersonality4");
    const celebName = searchParams.get("celebName");
    const id = searchParams.get("celebId");

    console.log("Parsed query parameters:", {
      celebPersonality1,
      celebPersonality2,
      celebPersonality3,
      celebPersonality4,
      celebName,
      id,
    });

    const { isValid, message } = await getFrameMessage(framerequest);

    if (!isValid) {
      console.error("Invalid message:", message);
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
      });
    }

    console.log("Valid message received:", message);

    const messageData = `characterName: ${celebName} description: ${description} characterPersonality1: ${celebPersonality1} characterPersonality2: ${celebPersonality2}  Query: ${message.input}`;

    const agentId = (await runAgent(messageData)) as Number;
    console.log("Agent ID:", agentId);

    const messageContent = await getMessageContent(agentId);
    console.log("Message content:", messageContent);

    const image = await getImage(
      [
        {
          userText: messageContent[1],
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          userText: messageContent[2],
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      [
        "https://static.animecorner.me/2023/12/1703513395-4981.jpg",
        "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/B2aUYFC0qUAkNnjbTHRyhrg3.png",
      ]
    );

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: celebPersonality1 ? ` ${celebPersonality1}` : "",
            action: "tx",
            postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/enablePersonality/1?celebId=${id}&button=1&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
            target: `${process.env.NEXT_PUBLIC_URL}/tx/enablePersonality/1?celebId=${id}`,
          },
          {
            label: celebPersonality2 ? `${celebPersonality2}` : "",
            action: "tx",
            postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/enablePersonality/2?celebId=${id}&button=2&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
            target: `${process.env.NEXT_PUBLIC_URL}/tx/enablePersonality/2?celebId=${id}`,
          },
          {
            label: celebPersonality3 ? `${celebPersonality3}` : "",
            action: "tx",
            postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/enablePersonality/3?celebId=${id}&button=3&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
            target: `${process.env.NEXT_PUBLIC_URL}/tx/enablePersonality/3?celebId=${id}`,
          },
          {
            label: "Chat",
            action: "post",
            target: `${process.env.NEXT_PUBLIC_URL}/chat?celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
          },
        ],
        image: {
          src: `data:image/png;base64,${image}`,
          aspectRatio: "1:1",
        },
        input: {
          text: `Talk with your celebrity ${celebName}`,
        },
        postUrl: `${process.env.NEXT_PUBLIC_URL}/tx/frame/`,
      })
    );
  } catch (e: any) {
    console.error("Error occurred:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
