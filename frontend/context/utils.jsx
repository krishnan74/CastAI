import React from "react";
import { ethers } from "ethers";

import contractConfig from "./agentConfig.json";
import ERCconfig from "./ERC.json";

const providerUrl = "https://devnet.galadriel.com";
const privateKey = process.env.NEXT_PUBLIC_AGENT_PR_ADDRESS;

export const getImageContent = async (agentId) => {
  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DALLE_AGENT_CONTRACT_ADDRESS,
      contractConfig.abi,
      wallet
    );

    while (true) {
      var isComplete = await agentContract.isRunFinished(agentId);
      console.log("Is run finished:", isComplete);
      if (isComplete) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    const messages = await agentContract.getMessageHistoryContents(agentId);
    return messages[2];
    console.log("Image link received:", messages[2]);
  } catch (err) {
    console.error("Error getting message content:", err);
    return err;
  }
};

export const runAgent = async (prompt) => {
  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);

    const wallet = new ethers.Wallet(privateKey, provider);

    const galTokenContract = new ethers.Contract(
      "0x0c44cFecaFE4da904Ee24984FD74c91C2bE431B7",
      ERCconfig.abi,
      wallet
    );

    const approveTx = await galTokenContract.approve(
      process.env.NEXT_PUBLIC_DALLE_AGENT_CONTRACT_ADDRESS,
      ethers.parseUnits("0.001", 18)
    );
    await approveTx.wait();

    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DALLE_AGENT_CONTRACT_ADDRESS,
      contractConfig.abi,
      wallet
    );

    const tx = await agentContract.runAgent(prompt, 2);

    const receipt = await tx.wait();

    const agentId = parseInt(receipt.logs[0].topics[2]);
    console.log("Transaction receipt:", receipt);
    return agentId;
  } catch (err) {
    console.error("Error executing Agent contract function:", err);
    return err;
  }
};
