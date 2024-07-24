import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { getInitialFrameImage } from "./utils";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const characterPersonality1 = searchParams.get("characterPersonality1");
  const characterPersonality2 = searchParams.get("characterPersonality2");
  const characterPersonality3 = searchParams.get("characterPersonality3");
  const characterDescription = searchParams.get("characterDescription");
  const characterName = searchParams.get("characterName");
  const imageId = searchParams.get("imageId");
  const id = searchParams.get("characterId");

  console.log("From chat initial: " + imageId);

  const image = await getInitialFrameImage(
    imageId as string,
    characterName as string,
    characterDescription as string
  );

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: characterPersonality1 ? ` ${characterPersonality1}` : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/1?characterId=${id}&button=1&characterName=${characterName}&imageId=${imageId}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/1?characterId=${id}`,
        },
        {
          label: characterPersonality2 ? `${characterPersonality2}` : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/2?characterId=${id}&button=2&characterName=${characterName}&imageId=${imageId}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/2?characterId=${id}`,
        },
        {
          label: characterPersonality3 ? `${characterPersonality3}` : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/3?characterId=${id}&button=3&characterName=${characterName}&imageId=${imageId}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
          target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/3?characterId=${id}`,
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
      postUrl: `${process.env.NEXT_PUBLIC_URL}chatLoading?characterName=${characterName}&imageId=${imageId}&characterId=${id}&characterDescription=${characterDescription}&characterPersonality1=${characterPersonality1}&characterPersonality2=${characterPersonality2}&characterPersonality3=${characterPersonality3}`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
