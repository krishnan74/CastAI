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
  const { getUserCharacters, currentAccount, getAllCharacters } =
    useWeb3Provider();
  const [userCharacters, setUserCharacters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("currentAccount", currentAccount);
      const fetchedCharacters = await getUserCharacters(currentAccount);
      const allCharacters = await getAllCharacters();
      setAllCharacters(allCharacters);
      setUserCharacters(fetchedCharacters);
    };

    if (currentAccount) {
      setTimeout(() => {
        fetchData();
      }, 500);
    }
  }, [currentAccount]);

  return (
    <div className="mt-10">
      <TabBar myCharacters={userCharacters} allCharacters={allCharacters} />
    </div>
  );
};

export default Page;
