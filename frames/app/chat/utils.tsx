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
const privateKey = process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY as string;

export const getMessageContent = async (agentId: Number) => {
  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS as string,
      contractConfig.abi,
      wallet
    );

    while (true) {
      var isComplete = await agentContract.isRunFinished(agentId);
      console.log("Is run finished:", isComplete);
      if (isComplete) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before checking again
    }

    const messages = await agentContract.getMessageHistoryContents(agentId);
    return messages;
  } catch (err) {
    console.error("Error getting message content:", err);
    return err;
  }
};

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

    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS as string,
      contractConfig.abi,
      wallet
    );

    const tx = await agentContract.runAgent(prompt, 3);

    const receipt = await tx.wait();

    const agentId = parseInt(receipt.logs[0].topics[2]);
    console.log("Transaction receipt:", receipt);
    return agentId;
  } catch (err) {
    console.error("Error executing contract function:", err);
    return err;
  }
};

export const getChatImage = async (messages: Messages[], avatars: string[]) => {
  console.log("Generating image with messages:", messages);
  const svg = await satori(
    <div
      style={{
        fontFamily: "Inter",
        width: 800,
        height: 800,
        border: "1px solid #E0E0E0",
        backgroundColor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
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
                objectFit: "cover",
                marginRight: "15px",
              }}
            />
            <div style={{ display: "flex", gap: "15px" }}>
              {msg.userText.length > 40 ? (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "15px",
                    padding: "10px 15px",
                    display: "flex",
                    maxWidth: "70%",
                    wordWrap: "break-word",
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
              ) : (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "15px",
                    padding: "10px 15px",
                    display: "flex",
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
              )}

              <p
                style={{
                  margin: 0,
                  color: "#969696",
                  fontSize: "12px",
                  fontFamily: "Inter",
                  textAlign: "right",
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
