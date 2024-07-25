import { NextRequest, NextResponse } from "next/server";
import { runAgent, getLoadingStateImage } from "./utils";
import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit/frame";

var messageObject = {
  userText: [] as string[],
  characterText: [] as string[],
};

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  try {
    const framerequest: FrameRequest = await req.json();
    console.log("Frame request received:", framerequest);
    const { searchParams } = new URL(req.url);
    const characterDescription = searchParams.get("characterDescription");
    const characterPersonality1 = searchParams.get("characterPersonality1");
    const characterPersonality2 = searchParams.get("characterPersonality2");
    const characterPersonality3 = searchParams.get("characterPersonality3");
    const characterName = searchParams.get("characterName");
    const imageId = searchParams.get("imageId");
    const id = searchParams.get("characterId");

    console.log("Parsed query parameters:", {
      characterPersonality1,
      characterPersonality2,
      characterDescription,
      characterPersonality3,
      characterName,
      id,
    });

    console.log("From chat loading: " + imageId);

    const inputText = framerequest.untrustedData.inputText;

    const messageData = `as humane and brief and more accurate to the character as possible characterName: ${characterName} characterDescription: ${characterDescription} characterPersonality1: ${characterPersonality1} characterPersonality2: ${characterPersonality2} characterPersonality3: ${characterPersonality3}   Query: ${inputText}`;

    const agentId = (await runAgent(messageData)) as Number;
    console.log("Agent ID:", agentId);

    const image = await getLoadingStateImage(
      imageId as string,
      characterName as string
    );

    return new NextResponse(
      getFrameHtmlResponse({
        state: {
          inputText: inputText,
        },
        buttons: [
          {
            label: "Refresh",
            action: "post",
          },
        ],
        image: {
          src: `data:image/png;base64,${image}`,
          aspectRatio: "1:1",
        },
        input: {
          text: `Talk with ${characterName}`,
        },
        postUrl: `${process.env.NEXT_PUBLIC_URL}getChat?characterName=${characterName}&agentId=${agentId}&characterDescription=${characterDescription}&imageId=${imageId}&characterId=${id}characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
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
