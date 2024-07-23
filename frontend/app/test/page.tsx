"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWeb3Provider } from "@/context/Web3ModalContext";

const Page = () => {
  const { getCharacterDetails } = useWeb3Provider();

  const fetchData = async () => {
    const characterDetails = await getCharacterDetails(
      "7c683c99-4b84-4dc6-93e5-524e85bdeef6"
    );
    console.log(characterDetails);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <button onClick={fetchData}>Click</button>
    </div>
  );
};

export default Page;
