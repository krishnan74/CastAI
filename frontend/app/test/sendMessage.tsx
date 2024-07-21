import React from "react";
import { ethers } from "ethers";
import contractConfig from "./agentConfig.json";

const ExecuteContract = () => {
  const providerUrl = "https://devnet.galadriel.com";
  const privateKey = process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY as string;

  const functionName = "runAgent";
  const functionArgs = ["Hello", 3];

  const executeContractFunction = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const wallet = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS as string,
        contractConfig.abi,
        wallet
      );

      const tx = await contract[functionName](...functionArgs);

      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      return err;
    }
  };
};

export default ExecuteContract;
