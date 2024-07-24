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

export const isRunFinished = async (agentId: Number) => {
  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS as string,
      contractConfig.abi,
      wallet
    );
    const isComplete = await agentContract.isRunFinished(agentId);
    return isComplete;
  } catch (err) {
    console.error("Error getting the run finsihed confirmation:", err);
    return err;
  }
};

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
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 5 seconds before checking again
    }

    const messages = await agentContract.getMessageHistoryContents(agentId);
    return messages;
  } catch (err) {
    console.error("Error getting message content:", err);
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
          Give me a sec to ponder your deep, existential question... 🤔 Be
          patient now, I operate on human time, not warp speed. Hit refresh in a
          moment, unless you've got a time machine handy!
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
    .png({ quality: 30 }) // Set the quality level for PNG compression
    .toBuffer();

  // Encode to base64 and return
  return pngBuffer.toString("base64");
};
