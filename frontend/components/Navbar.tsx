"use client";
import React from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { useWeb3Provider } from "@/context/Web3ModalContext";

const Navbar = () => {
  const { connectWallet, currentAccount, switchNetwork } = useWeb3Provider();

  const handleSwitchNetwork = (networkId: string) => {
    switchNetwork(parseInt(networkId, 10));
  };

  return (
    <div className="flex items-center px-[2vw] py-[1vw] justify-between">
      <div>
        <p className="text-2xl font-semibold">ETH Insure</p>
      </div>
      <div className="flex gap-10 items-center">
        {/* <Select onValueChange={handleSwitchNetwork}>
          <SelectTrigger id="network">
            <SelectValue placeholder="Select Network" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="3">Ropsten</SelectItem>
            <SelectItem value="4">Rinkeby</SelectItem>
            <SelectItem value="5">Goerli</SelectItem>
            <SelectItem value="42">Kovan</SelectItem>
            <SelectItem value="80001">Polygon Mumbai</SelectItem>
            <SelectItem value="2442">Cardano zkEVM</SelectItem>
          </SelectContent>
        </Select> */}

        <p>
          {currentAccount ?  currentAccount : "0x00"}
        </p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    </div>
  );
};

export default Navbar;
