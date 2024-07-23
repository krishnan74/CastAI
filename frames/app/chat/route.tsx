import { NextRequest, NextResponse } from "next/server";
import { getChatImage, runAgent, getMessageContent } from "./utils";
import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
  getFrameMetadata,
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
    const id = searchParams.get("characterId");

    console.log("Parsed query parameters:", {
      characterPersonality1,
      characterPersonality2,
      characterDescription,
      characterPersonality3,
      characterName,
      id,
    });

    const inputText = framerequest.untrustedData.inputText;

    const messageData = `as humane and brief and more accurate to the character as possible characterName: ${characterName} characterDescription: ${characterDescription} characterPersonality1: ${characterPersonality1} characterPersonality2: ${characterPersonality2} characterPersonality3: ${characterPersonality3}   Query: ${inputText}`;

    const agentId = (await runAgent(messageData)) as Number;
    console.log("Agent ID:", agentId);

    const messageContent = await getMessageContent(agentId);
    console.log("Message content:", messageContent);

    messageObject.userText.push(inputText);
    messageObject.characterText.push(messageContent[2]);

    const messagePairs = [];
    const timestamp = new Date().toLocaleTimeString();

    for (let i = 0; i < messageObject.userText.length; i++) {
      messagePairs.push(
        {
          userText: messageObject.userText[i],
          timestamp,
        },
        {
          userText: messageObject.characterText[i],
          timestamp,
        }
      );
    }

    const image = await getChatImage(messagePairs, [
      "https://static.animecorner.me/2023/12/1703513395-4981.jpg",
      "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/B2aUYFC0qUAkNnjbTHRyhrg3.png",
    ]);

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: characterPersonality1 ? ` ${characterPersonality1}` : "",
            action: "tx",
            postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/enablePersonality/1?characterId=${id}&button=1&characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
            target: `${process.env.NEXT_PUBLIC_URL}/tx/enablePersonality/1?characterId=${id}`,
          },
          {
            label: characterPersonality2 ? `${characterPersonality2}` : "",
            action: "tx",
            postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/enablePersonality/2?characterId=${id}&button=2&characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
            target: `${process.env.NEXT_PUBLIC_URL}/tx/enablePersonality/2?characterId=${id}`,
          },
          {
            label: characterPersonality3 ? `${characterPersonality3}` : "",
            action: "tx",
            postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/enablePersonality/3?characterId=${id}&button=3&characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
            target: `${process.env.NEXT_PUBLIC_URL}/tx/enablePersonality/3?characterId=${id}`,
          },
          {
            label: "Chat",
            action: "post",

            target: `${process.env.NEXT_PUBLIC_URL}chat?characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          },
        ],
        image: {
          src: `data:image/png;base64,${image}`,
          aspectRatio: "1:1",
        },
        input: {
          text: `Talk with ${characterName}`,
        },
        postUrl: `${process.env.NEXT_PUBLIC_URL}chat?characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
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
