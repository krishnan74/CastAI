import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";
import sharp from "sharp";

import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
  getFrameMetadata,
} from "@coinbase/onchainkit/frame";

import { get } from "http";

type Messages = {
  userText: string;
  timestamp: string;
};

const interMedium = fs.readFileSync(
  join(process.cwd(), "/fonts/static/Inter-Medium.ttf")
);

const interBold = fs.readFileSync(
  join(process.cwd(), "/fonts/static/Inter-Bold.ttf")
);

const interLight = fs.readFileSync(
  join(process.cwd(), "/fonts/static/Inter-Light.ttf")
);

const getImage = async (messages: Messages[], avatars: string[]) => {
  const svg = await satori(
    <div
      style={{
        fontFamily: "Inter",
        width: 600,
        height: 800,
        backgroundColor: "#F5F5F5",
      }}
    >
      {messages.map((msg, index) => {
        const avatar = avatars[index % avatars.length];
        return (
          <div key={index} style={{ display: "flex", padding: "15px" }}>
            <img
              src={avatar}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                marginRight: "15px",
              }}
            />
            <div>
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "15px",
                  padding: "10px",
                  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#000000",
                    fontFamily: "Inter",
                    fontWeight: 600,
                  }}
                >
                  {msg.userText}
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#969696",
                  fontSize: "12px",
                  fontFamily: "Inter",
                }}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        );
      })}
    </div>,
    {
      width: 600,
      height: 800,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "Inter",
          data: interMedium,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: interLight,
          weight: 300,
          style: "normal",
        },
      ],
    }
  );

  return (await sharp(Buffer.from(svg)).toFormat("png").toBuffer()).toString(
    "base64"
  );
};

// Example usage
const exampleMessages = [
  { userText: "Hello, how are you?", timestamp: "10:00 AM" },
  { userText: "I am good, thanks!", timestamp: "10:02 AM" },
];

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  try {
    const framerequest: FrameRequest = await req.json();
    const { searchParams } = new URL(req.url);
    const celebPersonality1 = searchParams.get("celebPersonality1");

    const celebPersonality2 = searchParams.get("celebPersonality2");

    const celebPersonality3 = searchParams.get("celebPersonality3");

    const celebPersonality4 = searchParams.get("celebPersonality4");

    const celebName = searchParams.get("celebName");
    const id = searchParams.get("celebId");
    const button = searchParams.get("button");

    const { isValid, message } = await getFrameMessage(framerequest);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
      });
    }

    const messageData = message.input;

    const image = await getImage(
      [
        {
          userText: messageData,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          userText: "Hello, how are you?",
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
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
