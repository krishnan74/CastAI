"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useWeb3Provider } from "@/context/Web3ModalContext";

const styles = {
  backgroundImage: {
    backgroundImage: `url('/celeb-collage.jpg')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "91.2vh",
  },
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.4)",
  },
  mainCard: {
    backdropFilter: "blur(20px) brightness(0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    padding: "70px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default function Page() {
  const { createCelebrity, currentAccount } = useWeb3Provider();

  const [characterDetails, setCelebDetails] = useState({
    name: "",
    characterId: "",
    personality1: "",
    personality2: "",
    personality3: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCelebDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const characterId = uuidv4();
      setCelebDetails((prevDetails) => ({
        ...prevDetails,
        characterId,
      }));
      const response = await createCelebrity(characterDetails);
      console.log(
        "Character created with characterId : ",
        characterDetails.characterId,
        response
      );
    } catch (err) {
      console.error("Error creating characterrity:", err);
    }
  };

  // Function to handle Metamask transaction initiation
  const handleMetamaskTransaction = async () => {
    // Implement your Metamask integration here
    // Example: Initiate token transfer using Metamask
  };

  return (
    <div
      className="flex justify-center items-center gap-10 relative"
      style={styles.backgroundImage}
    >
      <div style={styles.overlay} className="absolute"></div>
      <div
        className="relative w-[50%] flex flex-col justify-center p-[70px] bg-[rgba(255,255,255,0.9)] rounded-md h-fit"
        style={styles.mainCard}
      >
        <div className="flex items-center mb-10 text-gray-600">
          <p className="text-sm ">Powered by Farcaster</p>
          <Image
            className="ml-5  rounded-full"
            src="/farcaster-logo.png"
            alt="Farcaster Logo"
            width={30}
            height={30}
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="name" className="text-gray-900">
            Name Your AI Character: *
          </label>
          <input
            type="text"
            id="name"
            value={characterDetails.name}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC]"
            required
          />

          <label htmlFor="description" className="text-gray-900">
            Provide a description: *
          </label>
          <input
            type="text"
            id="description"
            value={characterDetails.description}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC]"
            required
          />

          <label htmlFor="personality1" className="text-gray-900">
            Choose Their Personality:
          </label>
          <div className="grid grid-cols-3 gap-5">
            <textarea
              id="personality1"
              rows={2}
              value={characterDetails.personality1}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
            <textarea
              id="personality2"
              rows={2}
              value={characterDetails.personality2}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
            <textarea
              id="personality3"
              rows={2}
              value={characterDetails.personality3}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
          </div>
          <p className="text-[15px]">
            Join the{" "}
            <Link
              href={"https://discord.com/invite/bHnFgSTKrP"}
              target="_blank"
              className="text-[#845DCC] underline"
            >
              Galadriel Discord Server
            </Link>{" "}
            to get GAL tokens for your AI Character.
          </p>

          <div className="flex gap-5 mt-3 justify-between  ">
            <Button
              type="submit"
              className="px-8 py-3 bg-[#845DCC] text-white hover:bg-[#6344A6] transition-transform transform hover:scale-105"
            >
              Create AI Celebrity
            </Button>
            <Button
              onClick={handleMetamaskTransaction}
              className="px-8 py-3 border  border-white text-gray-800 bg-white hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <p> Send GAL Tokens</p>
                <img
                  src="/galadriel-icon.jpg"
                  height={20}
                  width={20}
                  className="rounded-full"
                  alt=""
                />
              </div>
            </Button>
            <Link
              href={`https://warpcast.com/~/compose?text=Check%20out%20my%20new%20AI%20character&embeds[]=https%3A%2F%2Fcast-ai-frame.vercel.app%2Fcharacters%2F${
                characterDetails.characterId
              }%3FcharacterName%3D${encodeURIComponent(characterDetails.name)}
              %26characterDescription%3D${encodeURIComponent(
                characterDetails.description
              )}
              %26characterPersonality1%3D${encodeURIComponent(
                characterDetails.personality1
              )}%26characterPersonality2%3D${encodeURIComponent(
                characterDetails.personality2
              )}%26characterPersonality3%3D${encodeURIComponent(
                characterDetails.personality3
              )}`}
              type="button"
            >
              <Button className="px-8 py-3 border border-white text-gray-800 bg-white hover:bg-gray-100 transition-transform transform hover:scale-105">
                Cast on Warpcast
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
