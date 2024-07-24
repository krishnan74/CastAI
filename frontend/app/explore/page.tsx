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
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("currentAccount", currentAccount);
      const fetchedCharacters = await getUserCharacters(currentAccount);
      setCharacters(fetchedCharacters);
    };

    if (currentAccount) {
      setTimeout(() => {
        fetchData();
      }, 500);
    }
  }, [currentAccount]); 

  const fetchAllCharacters = async () => {
    const allCharacters = await getAllCharacters();
    setCharacters(allCharacters);
  };

  const handleFetchUserCharacters = async () => {
    if (currentAccount) {
      const fetchedCharacters = await getUserCharacters(currentAccount);
      setCharacters(fetchedCharacters);
    }
  };

  return (
    <div className="mt-10">
      {characters != null ? (
        <TabBar myCharacters={characters} allCharacters={characters} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Page;
