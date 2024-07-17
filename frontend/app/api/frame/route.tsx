import { NextRequest, NextResponse } from "next/server";
import { PinataFDK } from "pinata-fdk";
import { getConnectedAddressForUser } from "@/app/utils";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const fid = body.untrustedData.fid;
  const address = await getConnectedAddressForUser(fid);
  console.log(body);
  console.log(address);
}
