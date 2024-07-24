"use client";
import React, { useEffect, useState } from "react";
import TabBar from "@/components/TabBar";
import { useWeb3Provider } from "@/context/Web3ModalContext";
import ReclaimComponent from "./ReclaimComponent";

const Page = () => {
  const { getUserCharacters, currentAccount, getAllCharacters } =
    useWeb3Provider();
  const [userCharacters, setUserCharacters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [isVerified, setIsVerified] = useState(false);

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
      <ReclaimComponent setIsVerified={setIsVerified} />
      <TabBar
        myCharacters={userCharacters}
        allCharacters={allCharacters}
        isVerified={isVerified}
      />
    </div>
  );
};

export default Page;
