import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const characterPersonality1 = searchParams.get("characterPersonality1");

  const characterPersonality2 = searchParams.get("characterPersonality2");

  const characterPersonality3 = searchParams.get("characterPersonality3");

  const characterDescription = searchParams.get("characterDescription");
  const characterPersonality4 = searchParams.get("characterPersonality4");

  const characterName = searchParams.get("characterName");
  const id = searchParams.get("characterId");
  const button = searchParams.get("button");

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label:
            button === "1"
              ? `${characterPersonality1}  X`
              : characterPersonality1
              ? characterPersonality1
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/disablePersonality/1?characterId=${id}&button=1&characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/disablePersonality/1?characterId=${id}`,
        },
        {
          label:
            button === "2"
              ? `${characterPersonality2}  X`
              : characterPersonality2
              ? characterPersonality2
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/disablePersonality/2?characterId=${id}&button=2&characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/disablePersonality/2?characterId=${id}`,
        },
        {
          label:
            button === "3"
              ? `${characterPersonality3}  X`
              : characterPersonality3
              ? characterPersonality3
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/disablePersonality/3?characterId=${id}&button=3&characterName=${characterName}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/disablePersonality/3?characterId=${id}`,
        },
        {
          label: "Chat",
          action: "post",
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}character-collage.jpg`,
        aspectRatio: "1:1",
      },
      input: {
        text: `Talk with ${characterName}`,
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL}tx/frame/`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
