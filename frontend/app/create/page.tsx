"use client";
import { useState } from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import { useWeb3Provider } from "@/context/Web3ModalContext";
import type { Metadata } from "next";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

interface CelebDetails {
  name: string;
  celebId: string;
  personality1: string;
  personality2: string;
  personality3: string;
  personality4: string;
}

export default function Page() {
  const { createCelebrity, currentAccount } = useWeb3Provider();

  const [celebDetails, setCelebDetails] = useState({
    name: "",
    celebId: "",
    personality1: "",
    personality2: "",
    personality3: "",
    personality4: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    setCelebDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const celeb = uuidv4();
      setCelebDetails((prevDetails) => ({
        ...prevDetails,
        celebId: celeb,
      }));
      const response = await createCelebrity(celebDetails);
      console.log(
        "Celebrity created with celebId : ",
        celebDetails.celebId,
        response
      );
    } catch (err) {
      console.error("Error creating celebrity:", err);
    }
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
          <p className="text-sm">Powered by Farcaster</p>
          <Image
            className="ml-2 rounded-full"
            src="/farcaster-logo.png"
            alt="Farcaster Logo"
            width={30}
            height={30}
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="name" className="text-lg text-gray-900">
            Name Your AI Celebrity:
          </label>
          <input
            type="text"
            id="name"
            value={celebDetails.name}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC]"
            required
          />
          {/**<label htmlFor="description" className="text-lg text-gray-900">
            Provide a description:
          </label>
          <input
            type="text"
            id="description"
            value={celebDetails.description}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC]"
            required
          />**/}
          <label htmlFor="personality1" className="text-lg text-gray-900">
            Choose Their Personality:
          </label>
          <div className="grid grid-cols-2 gap-5">
            <textarea
              id="personality1"
              rows={2}
              value={celebDetails.personality1}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
            <textarea
              id="personality2"
              rows={2}
              value={celebDetails.personality2}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
            <textarea
              id="personality3"
              rows={2}
              value={celebDetails.personality3}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
            <textarea
              id="personality4"
              rows={2}
              value={celebDetails.personality4}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></textarea>
          </div>
          <div className="flex gap-5 mt-3">
            <Button
              type="submit"
              className="px-8 py-3 bg-[#845DCC] text-white hover:bg-[#6344A6] transition-transform transform hover:scale-105"
            >
              Create AI Celebrity
            </Button>
            <Link
              href={`https://warpcast.com/~/compose?text=Hello%20world!&embeds[]=https://cast-ai-frame.vercel.app/celebs/1?celebId=${celebDetails.celebId}&celebName=${celebDetails.name}&celebPersonality1=${celebDetails.personality1}&celebPersonality2=${celebDetails.personality2}&celebPersonality3=${celebDetails.personality3}&celebPersonality4=${celebDetails.personality4}`}
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
