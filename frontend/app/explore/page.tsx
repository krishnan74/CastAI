"use client";
import React, { useEffect, useState } from "react";
import TabBar from "@/components/TabBar";
import { useWeb3Provider } from "@/context/Web3ModalContext";

interface AICharacter {
  name: string;
  characterId: string;
  personality1: string;
  personality2: string;
  personality3: string;
  personality4: string;
  description: string;
  enabledPersonality1: boolean;
  enabledPersonality2: boolean;
  enabledPersonality3: boolean;
  enabledPersonality4: boolean;
}

const Page = () => {
  const {
    getUserCharacters,
    currentAccount,
    checkIfWalletConnected,
    checkCurrentNetwork,
  } = useWeb3Provider();
  const [characters, setCharacters] = useState<AICharacter[]>([]);

  const fetchCharacters = async () => {
    console.log("currentAccount", currentAccount);
    const characters = await getUserCharacters(currentAccount);
    setCharacters(characters);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <TabBar myCharacters={characters} allCharacters={characters} />
    </div>
  );
};

export default Page;