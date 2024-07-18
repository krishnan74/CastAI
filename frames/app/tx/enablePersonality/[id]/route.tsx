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
    const body: FrameRequest = await req.json();

    const data = encodeFunctionData({
      abi: contractConfig.abi,
      functionName: "enablePersonality",
      args: [BigInt(1), "ae1370af-2f88-4e51-81ab-8d1378403325"],
    });
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${baseSepolia.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: contractConfig.abi as Abi,
        data,
        to: `0x${contractConfig.contractAddress}`,
        value: parseGwei("10000").toString(),
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
