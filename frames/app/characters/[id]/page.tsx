import { Metadata } from "next";
import { ResolvingMetadata } from "next";
import React from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import { getInitialFrameImage } from "./utils";

type Props = {
  params: { id: string };
  searchParams: {
    characterName: string;
    imageId: string;
    characterPersonality1: string;
    characterPersonality2: string;
    characterPersonality3: string;
    characterDescription: string;
  };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  console.log(searchParams.imageId);
  const image = await getInitialFrameImage(
    searchParams.imageId,
    searchParams.characterName,
    searchParams.characterDescription
  );

  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Create your own AI Character",
        action: "link",
        target: "https://cast-ai.vercel.app/",
      },
      {
        label: "Chat",
        action: "post",
      },
    ],
    image: {
      src: `data:image/png;base64,${image}`,
      aspectRatio: "1:1",
    },

    postUrl: `${process.env.NEXT_PUBLIC_URL}chatInitial?characterName=${searchParams.characterName}&characterId=${id}&imageId=${searchParams.imageId}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
  });

  return {
    title: "cast-ai.vercel.app",
    description: "Cast your own AI character",
    openGraph: {
      title: "cast-ai.vercel.app",
      description: "Cast your own AI character",
      images: [`${process.env.NEXT_PUBLIC_URL}character-collage.jpg`],
    },
    other: {
      ...frameMetadata,
    },
  };
}

const CharacterPage = () => {
  return <div>Character Page</div>;
};

export default CharacterPage;
