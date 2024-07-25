import satori from "satori";
import { join } from "path";
import * as fs from "fs";
import React from "react";
import { ethers } from "ethers";
import sharp from "sharp";
import contractConfig from "./agentConfig.json";
import ERCconfig from "./ERC.json";

type Messages = {
  userText: string;
  timestamp: string;
};

const interMedium = fs.readFileSync(
  join(process.cwd(), "font/Inter-Medium.ttf")
);

const interBold = fs.readFileSync(join(process.cwd(), "font/Inter-Bold.ttf"));

const interLight = fs.readFileSync(join(process.cwd(), "font/Inter-Light.ttf"));

const providerUrl = "https://devnet.galadriel.com";
const privateKey = process.env.NEXT_PUBLIC_AGENT_PR_ADDRESS as string;

export const runAgent = async (prompt: string) => {
  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);

    const wallet = new ethers.Wallet(privateKey, provider);

    const galTokenContract = new ethers.Contract(
      "0x0c44cFecaFE4da904Ee24984FD74c91C2bE431B7",
      ERCconfig.abi,
      wallet
    );

    const approveTx = await galTokenContract.approve(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS,
      ethers.parseUnits("0.001", 18)
    );
    await approveTx.wait();
    console.log("Approved transaction:", approveTx);

    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS as string,
      contractConfig.abi,
      wallet
    );

    const tx = await agentContract.runAgent(prompt, 1);

    const receipt = await tx.wait();

    console.log("Transaction receipt:", receipt);

    const agentId = parseInt(receipt.logs[0].topics[2]);
    console.log("Transaction receipt:", receipt);
    return agentId;
  } catch (err) {
    console.error("Error executing contract function:", err);
    return err;
  }
};

export const getLoadingStateImage = async (
  imageID: string,
  characterName: string
) => {
  const svg = await satori(
    <div
      style={{
        fontFamily: "Inter",
        position: "relative",
        width: 800,
        height: 800,
        backgroundColor: "rgba(255, 255,255, 1)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",

          justifyContent: "center",
          position: "absolute",

          textAlign: "center",
        }}
      >
        <img
          src={`https://storage.googleapis.com/galadriel-assets/${imageID}.png`}
          height={300}
          width={300}
          alt=""
          style={{ borderRadius: "10px" }}
        />
        <h2 style={{ fontFamily: "Inter", fontWeight: 800 }}>
          {characterName}
        </h2>
        <p style={{ fontFamily: "Inter", fontWeight: 800 }}>
          Give me a sec to ponder your deep, existential question... Be patient
          now, I operate on human time, not warp speed. Hit refresh in a moment,
          unless you&apos;ve got a time machine handy!
        </p>
      </div>
    </div>,
    {
      width: 800,
      height: 800,
      fonts: [
        { name: "Inter", data: interBold, weight: 800, style: "normal" },
        { name: "Inter", data: interMedium, weight: 600, style: "normal" },
        { name: "Inter", data: interLight, weight: 300, style: "normal" },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({ quality: 10 }) // Set the quality level for PNG compression
    .toBuffer();

  // Encode to base64 and return
  return pngBuffer.toString("base64");
};
