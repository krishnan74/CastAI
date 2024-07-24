"use client";
import { use, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWeb3Provider } from "@/context/Web3ModalContext";
import ReactLoading from "react-loading";

const styles = {
  backgroundImage: {
    backgroundImage: `url('/character-collage.jpg')`,
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

    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default function Page() {
  const router = useRouter();
  const {
    createCharacter,
    sendGALTokens,
  } = useWeb3Provider();
  const [enableCasting, setEnableCasting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
  );

  useEffect(() => {}, [enableCasting]);

  const [characterDetails, setCharacterDetails] = useState({
    name: "",
    personality1: "",
    personality2: "",
    personality3: "",
    description: "",
  });

  const [characterId, setCharacterId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    setCharacterDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  function convertToHyphenSeparated(sentence: string) {
    sentence = sentence.trim();
    return sentence.replace(/\s+/g, "-");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Creating...");
    setLoading(true);
    e.preventDefault();
    try {
      const characterId = uuidv4();
      setCharacterId(characterId);
      console.log("Character ID:", characterId);
      console.log("Character Details:", characterDetails);

      // Proceed with creating the character using characterDetails and characterId
      const { response, picURL } = await createCharacter(
        characterDetails,
        characterId
      );

      // Extracting the ID from the picURL
      setImageUrl(picURL);

      const urlParts = picURL.split("/");
      const idWithExtension = urlParts[urlParts.length - 1];
      const id = idWithExtension.split(".")[0]; // Remove the file extension (.png)

      console.log("Character created successfully:", response);

      setImageId(id);

      setLoading(false);
    } catch (err) {
      console.error("Error creating character:", err);
    }
  };

  const handleMetamaskTransaction = async () => {
    await sendGALTokens("0xF19266508b9d6F40955f2968567d8979287A231B");
    setEnableCasting(true);
  };

  return (
    <div
      className="flex justify-center items-center gap-10 relative"
      style={styles.backgroundImage}
    >
      <div style={styles.overlay} className="absolute"></div>
      <div
        className="relative w-[50%] flex flex-col justify-center px-16 py-10 bg-[rgba(255,255,255,0.9)] rounded-md h-fit"
        style={styles.mainCard}
      >
        <div className="absolute top-10">
          <div className="flex  items-center mb-10 text-gray-600">
            <p className="text-sm ">Powered by Farcaster</p>
            <Image
              className="ml-5  rounded-full"
              src="/farcaster-logo.png"
              alt="Farcaster Logo"
              width={30}
              height={30}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-10">
            <div className="flex flex-col gap-4  w-full">
              <label htmlFor="name" className="text-gray-900 ">
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
            </div>

            <div>
              {loading ? (
                <div className="h-[200px] w-[200px] flex justify-center items-center rounded-md border shadow-md ">
                  <ReactLoading
                    type={"spin"}
                    color={"#845DCC"}
                    height={100}
                    width={100}
                  />
                </div>
              ) : (
                <Image
                  src={imageUrl}
                  alt="Character Image"
                  width={200}
                  height={200}
                  className=" rounded-md"
                ></Image>
              )}
            </div>
          </div>

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
            <input
              id="personality1"
              value={characterDetails.personality1}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></input>
            <input
              id="personality2"
              value={characterDetails.personality2}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></input>
            <input
              id="personality3"
              value={characterDetails.personality3}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#845DCC] resize-none"
              required
            ></input>
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

          <div className="flex gap-5 mt-3 justify-center  ">
            <Button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#845DCC] text-white hover:bg-[#6344A6] transition-transform transform hover:scale-105"
            >
              Create AI Character
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

            <Button
              //disabled={!enableCasting}

              className="px-8 py-3 border border-white text-gray-800 bg-white hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              <Link
                href={`https://warpcast.com/~/compose?text=Check%20out%20my%20new%20AI%20character&embeds[]=https%3A%2F%2Fcast-ai-frame.vercel.app%2Fcharacters%2F${characterId}%3FcharacterName=${convertToHyphenSeparated(characterDetails.name)}%26imageId=${imageId}%26characterDescription=${convertToHyphenSeparated(characterDetails.description)}%26characterPersonality1=${convertToHyphenSeparated(characterDetails.personality1)}%26characterPersonality2=${convertToHyphenSeparated(characterDetails.personality2)}%26characterPersonality3=${convertToHyphenSeparated(characterDetails.personality3)}`}
                target="_blank"
              >
                Cast on Warpcast
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
