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

    const message = await agentContract.getMessageHistoryContents(agentId);
    return message;
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
      ethers.parseUnits("0.001", 18) // Amount to approve (in this case, 1000 GAL tokens)
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
  useEffect(() => {
    // Code that runs on component mount (similar to componentDidMount in class components)
    // You can put async code directly inside useEffect using IIFE (Immediately Invoked Function Expression)
  }, []);

  const [prompt, setPrompt] = useState("");

  const handleClick = async () => {
    const receipt = (await executeContractFunction(prompt)) as Number;
    const message = await getMessageContent(receipt);
    console.log("Message content:", message);
    // Handle receipt as needed
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default Page;
