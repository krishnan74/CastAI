import { Metadata } from "next";
import { ResolvingMetadata } from "next";
import React from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/core";
import satori from "satori";

type Props = {
  params: { id: string };
  searchParams: {
    characterName: string;
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

  const frameMetadata = getFrameMetadata({
    state: {
      characterId: id,
      characterName: searchParams.characterName,
    },
    buttons: [
      {
        label: searchParams.characterPersonality1,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/1?characterId=${id}&button=1&characterName=${searchParams.characterName}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/1?characterId=${id}&`,
      },
      {
        label: searchParams.characterPersonality2,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/2?characterId=${id}&button=2&characterName=${searchParams.characterName}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/2?characterId=${id}`,
      },
      {
        label: searchParams.characterPersonality3,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/3?characterId=${id}&button=3&characterName=${searchParams.characterName}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/3?characterId=${id}`,
      },
      {
        label: "Chat",
        action: "post",
      },
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}character-collage.jpg`,
      aspectRatio: "1:1",
    },
    input: {
      text: `Talk with ${searchParams.characterName}`,
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}chat?characterName=${searchParams.characterName}&characterDescription=${searchParams.characterDescription}&characterPersonality1=${searchParams.characterPersonality1}&characterPersonality2=${searchParams.characterPersonality2}&characterPersonality3=${searchParams.characterPersonality3}`,
  });

  return {
    title: "cast-ai.vercel.app",
    description: "Cast your own AI characterrity",
    openGraph: {
      title: "cast-ai.vercel.app",
      description: "Cast your own AI characterrity",
      images: [`${process.env.NEXT_PUBLIC_URL}/character-collage.jpg`],
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