import { Metadata } from "next";
import { ResolvingMetadata } from "next";
import React from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/core";
import { getInitialFrameImage } from "./utils";

type Props = {
  params: { id: string };
  searchParams: {
    characterName: string;
    imageID: string;
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
  const image = await getInitialFrameImage(
    searchParams.imageID,
    searchParams.characterName,
    searchParams.characterDescription
  );

  const frameMetadata = getFrameMetadata({
    state: {
      characterId: id,
      characterName: searchParams.characterName,
    },
    buttons: [
      {
        label: searchParams.characterPersonality1,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/1?characterId=${id}&button=1&characterName=${searchParams.characterName}&imageID=${searchParams.imageID}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/1?characterId=${id}&`,
      },
      {
        label: searchParams.characterPersonality2,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/2?characterId=${id}&button=2&characterName=${searchParams.characterName}&imageID=${searchParams.imageID}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/2?characterId=${id}`,
      },
      {
        label: searchParams.characterPersonality3,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/3?characterId=${id}&button=3&characterName=${searchParams.characterName}&imageID=${searchParams.imageID}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/3?characterId=${id}`,
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
    input: {
      text: `Talk with ${searchParams.characterName}`,
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}chat?characterName=${searchParams.characterName}&imageID=${searchParams.imageID}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
  });

  return {
    title: "cast-ai.vercel.app",
    description: "Cast your own AI character",
    openGraph: {
      title: "cast-ai.vercel.app",
      description: "Cast your own AI character",
      images: [`data:image/png;base64,${image}`],
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
