"use client"
import { useState } from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const styles = {
  backgroundImage: {
    backgroundImage: `url('/celeb-collage.jpg')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "91vh",
  },
  overlay: {
    position: "absolute",
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
  const [celebName, setCelebName] = useState("");
  const [celebPersonality, setCelebPersonality] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here, like sending data to an API
    console.log("Submitted:", celebName, celebPersonality);
    // Example: Send data to an API endpoint
    // fetch('/api/create-celeb', {
    //   method: 'POST',
    //   body: JSON.stringify({ name: celebName, personality: celebPersonality }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error:', error));
  };

  return (
    <div
      className="flex mt-1 justify-center items-center gap-10 relative"
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
          <label htmlFor="celebName" className="text-lg text-gray-900">
            Name Your AI Celebrity:
          </label>
          <input
            type="text"
            id="celebName"
            value={celebName}
            onChange={(e) => setCelebName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC]"
            required
          />
          <label htmlFor="celebPersonality" className="text-lg text-gray-900">
            Choose Their Personality:
          </label>
          <textarea
            id="celebPersonality"
            value={celebPersonality}
            onChange={(e) => setCelebPersonality(e.target.value)}
            rows={4}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
            required
          ></textarea>
          <div className="flex gap-5 mt-3">
            <Button
              type="submit"
              className="px-8 py-3 bg-[#845DCC] text-white hover:bg-[#6344A6] transition-transform transform hover:scale-105"
            >
              Create AI Celebrity
            </Button>
            <Button
              type="button"
              className="px-8 py-3 border border-white text-gray-800 bg-white hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              Share
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
