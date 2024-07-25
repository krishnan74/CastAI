import { NextRequest, NextResponse } from "next/server";
import {
  getChatImage,
  getMessageContent,
  isRunFinished,
  getLoadingStateImage,
} from "./utils";
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

    const { searchParams } = new URL(req.url);
    const characterDescription = searchParams.get("characterDescription");
    const characterPersonality1 = searchParams.get("characterPersonality1");
    const characterPersonality2 = searchParams.get("characterPersonality2");
    const characterPersonality3 = searchParams.get("characterPersonality3");
    const characterName = searchParams.get("characterName");
    const imageId = searchParams.get("imageId");
    const id = searchParams.get("characterId");
    const agentId = searchParams.get("agentId");

    console.log("Parsed query parameters:", {
      characterPersonality1,
      characterPersonality2,
      characterDescription,
      characterPersonality3,
      characterName,
      id,
    });

    console.log("From chat getChat: " + imageId);

    const isFinished = await isRunFinished(Number(agentId));

    const parsedState = JSON.parse(framerequest.untrustedData.state);

    console.log("Input text:" + parsedState.inputText);

    if (isFinished) {
      const messageContent = await getMessageContent(Number(agentId));
      console.log("Message content:", messageContent);

      const timestamp = new Date().toLocaleTimeString();
      const messagePairs = [
        {
          userText: parsedState.inputText,
          timestamp,
        },
        {
          userText: messageContent[2],
          timestamp,
        },
      ];

      const image = await getChatImage(messagePairs, [
        "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
        `https://storage.googleapis.com/galadriel-assets/${imageId}.png`,
      ]);

      return new NextResponse(
        getFrameHtmlResponse({
          state: {
            inputText: parsedState.input,
          },
          buttons: [
            {
              label: "Chat",
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
          postUrl: `${process.env.NEXT_PUBLIC_URL}chatLoading?characterName=${characterName}&imageId=${imageId}&characterId=${id}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
        })
      );
    } else {
      const image = await getLoadingStateImage(
        imageId as string,
        characterName as string
      );

      return new NextResponse(
        getFrameHtmlResponse({
          state: {
            inputText: parsedState.input,
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
    }
  } catch (e: any) {
    console.error("Error occurred:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
