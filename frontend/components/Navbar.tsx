"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { useWeb3Provider } from "@/context/Web3ModalContext";
import { shortenAddress } from "@/app/utils";
import { MetaMaskAvatar } from "react-metamask-avatar";
import Image from "next/image";

const Navbar = () => {
  const {
    connectWallet,
    currentAccount,
    switchNetwork,
    getProvider,
    checkIfWalletConnected,
  } = useWeb3Provider();
  const [showDetails, setShowDetails] = useState(false);
  const [balance, setBalance] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/placeholder-profile.png");

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  // useEffect(() => {
  //   if (currentAccount) {
  //     fetchBalance();
  //   }
  // }, [currentAccount]);

  // const fetchBalance = async () => {
  //   const provider = await getProvider();
  //   console.log(provider);
  //   if (provider && currentAccount) {
  //     // const balance = await provider.getBalance("ethers.eth");
  //     // setBalance(ethers.formatEther(balance));
  //     // console.log("Balance: ", balance);
  //   }
  // };

  const handleSwitchNetwork = (networkId: string) => {
    switchNetwork(parseInt(networkId, 10));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentAccount);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="flex items-center px-8 py-4 justify-between border-b bg-white bg-opacity-90 ">
      <Link className="" href={"/"}>
        <p className="text-2xl font-semibold text-gray-900">CastAI</p>
      </Link>
      <div className="flex gap-10">
        <Link href={"/create"}>Cast AI</Link>
        <Link href={"/explore"}>Explore</Link>
      </div>
      <div className="flex gap-8 items-center">
        <Select onValueChange={handleSwitchNetwork}>
          <SelectTrigger
            id="network"
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#845DCC] focus:border-transparent"
          >
            <SelectValue placeholder="Select Network" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="84532">
              <div className="flex w-fit gap-2 items-center">
                <img src="/base-icon.png" height={25} width={25} alt="" />
                <p>Base Sepolia</p>
              </div>
            </SelectItem>

            <SelectItem value="696969">
              <div className="flex w-fit gap-2 items-center">
                <img
                  src="/galadriel-icon.jpg"
                  className="rounded-full"
                  height={25}
                  width={25}
                  alt=""
                />
                <p>Galadriel Devnet</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          {currentAccount ? (
            <div>
              <span
                className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
                onClick={() => setShowDetails(!showDetails)}
              >
                {shortenAddress(currentAccount)}
              </span>
              {showDetails && (
                <div className="absolute right-0 mt-2 w-64 p-4 bg-white border rounded-lg shadow-lg">
                  <div className="flex items-center mb-2">
                    <MetaMaskAvatar address={currentAccount} size={24} />
                    <div className="ml-4">
                      <p className="text-sm font-semibold">
                        {" "}
                        {shortenAddress(currentAccount)}
                      </p>
                      <p className="text-sm text-gray-500">{balance} ETH</p>
                    </div>
                  </div>
                  <Button onClick={copyToClipboard} className="w-full text-sm">
                    Copy Address
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              className="px-6 py-2 bg-[#845DCC] text-white rounded-lg hover:bg-[#6344A6] transition-colors"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
