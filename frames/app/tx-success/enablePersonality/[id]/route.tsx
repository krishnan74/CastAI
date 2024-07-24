import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { getInitialFrameImage } from "./utils";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const characterPersonality1 = searchParams.get("characterPersonality1");

  const characterPersonality2 = searchParams.get("characterPersonality2");

  const characterPersonality3 = searchParams.get("characterPersonality3");

  const characterDescription = searchParams.get("characterDescription");
  const characterPersonality4 = searchParams.get("characterPersonality4");

  const imageID = searchParams.get("imageID");

  const characterName = searchParams.get("characterName");
  const id = searchParams.get("characterId");
  const button = searchParams.get("button");

  const image = await getInitialFrameImage(
    imageID as string,
    characterName as string,
    characterDescription as string
  );

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
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/disablePersonality/1?characterId=${id}&button=1&characterName=${characterName}&imageID=${imageID}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
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
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/disablePersonality/2?characterId=${id}&button=2&characterName=${characterName}&imageID=${imageID}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
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
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/disablePersonality/3?characterId=${id}&button=3&characterName=${characterName}&imageID=${imageID}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/disablePersonality/3?characterId=${id}`,
        },
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
      postUrl: `${process.env.NEXT_PUBLIC_URL}chat?characterName=${characterName}&imageID=${imageID}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
