import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const celebPersonality1 = searchParams.get("celebPersonality1");

  const celebPersonality2 = searchParams.get("celebPersonality2");

  const celebPersonality3 = searchParams.get("celebPersonality3");

  const celebPersonality4 = searchParams.get("celebPersonality4");

  const celebName = searchParams.get("celebName");
  const id = searchParams.get("celebId");
  const button = searchParams.get("button");

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label:
            button === "1"
              ? `${celebPersonality1}  X`
              : celebPersonality1
              ? celebPersonality1
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/disablePersonality/1?celebId=${id}&button=1&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
          target: `${process.env.NEXT_PUBLIC_URL}/tx/disablePersonality/1?celebId=${id}`,
        },
        {
          label:
            button === "2"
              ? `${celebPersonality2}  X`
              : celebPersonality2
              ? celebPersonality2
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/disablePersonality/2?celebId=${id}&button=2&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
          target: `${process.env.NEXT_PUBLIC_URL}/tx/disablePersonality/2?celebId=${id}`,
        },
        {
          label:
            button === "3"
              ? `${celebPersonality3}  X`
              : celebPersonality3
              ? celebPersonality3
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/disablePersonality/3?celebId=${id}&button=3&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
          target: `${process.env.NEXT_PUBLIC_URL}/tx/disablePersonality/3?celebId=${id}`,
        },
        {
          label:
            button === "4"
              ? `${celebPersonality4}  X`
              : celebPersonality4
              ? celebPersonality4
              : "",
          action: "tx",
          postUrl: `${process.env.NEXT_PUBLIC_URL}/tx-success/disablePersonality/4?celebId=${id}&button=4&celebName=${celebName}&celebPersonality1=${celebPersonality1}&celebPersonality2=${celebPersonality2}&celebPersonality3=${celebPersonality3}&celebPersonality4=${celebPersonality4}`,
          target: `${process.env.NEXT_PUBLIC_URL}/tx/disablePersonality/4?celebId=${id}`,
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/celeb-collage.jpg`,
        aspectRatio: "1:1",
      },
      input: {
        text: `Talk with your celebrity ${celebName}`,
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL}/tx/frame/`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
