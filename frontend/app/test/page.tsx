"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractConfig from "./agentConfig.json";
import ERCconfig from "./ERC.json";

const providerUrl = "https://devnet.galadriel.com";
const privateKey = process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY as string;

const getMessageContent = async (agentId: Number) => {
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

const executeContractFunction = async (prompt: string) => {
  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // GAL token contract
    const galTokenContract = new ethers.Contract(
      "0x0c44cFecaFE4da904Ee24984FD74c91C2bE431B7",
      ERCconfig.abi,
      wallet
    );

    // Approve GAL token transfer to the contract
    const approveTx = await galTokenContract.approve(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS,
      ethers.parseUnits("0.001", 18) // Amount to approve (in this case, 0.001 GAL tokens)
    );
    await approveTx.wait();

    // Your agent contract
    const agentContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS as string,
      contractConfig.abi,
      wallet
    );

    // Execute your contract function along with sending GAL tokens
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

const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleClick = async () => {
    console.log("clicked");
    const agentId = (await executeContractFunction(prompt)) as Number;
    const messageContents = await getMessageContent(agentId);
    console.log("Message contents:", messageContents);
    setMessages(messageContents);
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleClick}>Click</button>
      <div>
        <h3>Messages:</h3>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default Page;
