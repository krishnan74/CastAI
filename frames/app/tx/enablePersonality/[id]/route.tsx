import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, formatEther, parseGwei } from "viem";
import { baseSepolia } from "viem/chains";
import type { FrameTransactionResponse } from "@coinbase/onchainkit/frame";

import contractConfig from "../../../config.json";
import { get } from "http";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  try {
    const body: FrameRequest = await req.json();
    console.log(body);
    const data = encodeFunctionData({
      abi: contractConfig.abi,
      functionName: "enablePersonality",
      args: [],
    });
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${baseSepolia.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: [],
        data,
        to: `0x${contractConfig.contractAddress}`,
        value: parseGwei("10000").toString(), // 0.00001 ETH
      },
    };
    return NextResponse.json(txData);
  } catch (e) {
    console.log(e);
    return new Response("error");
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
