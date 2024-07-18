import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, formatEther, parseGwei, Abi } from "viem";
import { baseSepolia } from "viem/chains";
import type { FrameTransactionResponse } from "@coinbase/onchainkit/frame";

import contractConfig from "../../../config.json";
import { get } from "http";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  try {
    const framerequest: FrameRequest = await req.json();

    const { isValid, message } = await getFrameMessage(framerequest);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
      });
    }

    const data = encodeFunctionData({
      abi: contractConfig.abi,
      functionName: "enablePersonality",
      args: [BigInt(message.button), "d013db48-97e7-4170-b7a9-c1cf920f97a4"],
    });
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${baseSepolia.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: contractConfig.abi as Abi,
        data,
        to: `0x${contractConfig.contractAddress}`,
        value: "0",
      },
    };
    return NextResponse.json(txData);
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
