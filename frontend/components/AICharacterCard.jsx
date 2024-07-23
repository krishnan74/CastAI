"use client";
import React, { useState } from "react";
import Link from "next/link";
import { shortenAddress } from "@/app/utils";
import { Button } from "./ui/button";
import { ethers } from "ethers";

import { useWeb3Provider } from "@/context/Web3ModalContext";

const AICharacterCard = ({
  name,
  cid,
  description,
  imageURL,
  owner,
  personality1,
  personality2,
  personality3,
  ethEarned,
}) => {
  const { withDrawETH } = useWeb3Provider();

  const [canWithdraw, setCanWithdraw] = useState(ethEarned != 0 ? true : false);

  const handleWithdraw = async () => {
    const response = await withDrawETH(cid);
    window.location.reload();
    console.log(response);
  };
  return (
    <div
      key={cid}
      className="flex flex-col gap-3 p-6 items-center justify-center w-[100px] h-[100px] border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="mb-4">
        <img
          src={imageURL}
          alt={name}
          height={200}
          width={200}
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl font-semibold text-gray-900 ">{name}</h1>
        <p className="text-sm font-light text-gray-600 text-center">
          {description}
        </p>
        <div className="flex flex-row items-center justify-center w-full">
          <p className="text-sm font-light text-gray-600 text-center">{`Personality: ${personality1}, ${personality2}, ${personality3}`}</p>
        </div>
        <div className="flex flex-row items-center justify-center w-full">
          <p className="text-sm font-light text-gray-600 text-center">{`Owner: ${shortenAddress(
            owner
          )}`}</p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center w-full">
        <p className="text-sm font-light text-gray-600 text-center">{`ETH Earned: ${ethers.formatEther(
          ethEarned
        )}`}</p>
      </div>
      <Button onClick={handleWithdraw} disabled={!canWithdraw}>
        Withdraw
      </Button>
    </div>
  );
};

export default AICharacterCard;
