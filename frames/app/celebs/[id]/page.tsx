import { Metadata } from "next";
import { ResolvingMetadata } from "next";
import React from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/core";

const NEXT_PUBLIC_URL = "https://cast-ai-frame.vercel.app";

type Props = {
  params: { id: string };
  searchParams: {
    celebName: string;
    celebPersonality1: string;
    celebPersonality2: string;
    celebPersonality3: string;
    celebPersonality4: string;
    celebPersonality5: string;
  };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // Example of using searchParams to modify frameMetadata
  const frameMetadata = getFrameMetadata({
    state: {
      celebId: id,
    },
    buttons: [
      {
        label: searchParams.celebPersonality1,
        action: "tx",
        postUrl: `${NEXT_PUBLIC_URL}/tx-success/enablePersonality/1`,
        target: `${NEXT_PUBLIC_URL}/tx/enablePersonality/1`,
      },
      {
        label: searchParams.celebPersonality2,
        action: "tx",
        postUrl: `${NEXT_PUBLIC_URL}/tx-success/enablePersonality/2 `,
        target: `${NEXT_PUBLIC_URL}/tx/enablePersonality/2`,
      },
      {
        label: searchParams.celebPersonality3,
        action: "tx",
        postUrl: `${NEXT_PUBLIC_URL}/tx-success/enablePersonality/3`,
        target: `${NEXT_PUBLIC_URL}/tx/enablePersonality/3`,
      },
      {
        label: searchParams.celebPersonality4,
        action: "tx",
        postUrl: `${NEXT_PUBLIC_URL}/tx-success/enablePersonality/4`,
        target: `${NEXT_PUBLIC_URL}/tx/enablePersonality/4`,
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/celeb-collage.jpg`,
      aspectRatio: "1:1",
    },
    input: {
      text: `Talk with your celebrity ${searchParams.celebName}`,
    },
    postUrl: `${NEXT_PUBLIC_URL}/tx/frame/`,
  });

  return {
    title: "cast-ai.vercel.app",
    description: "Cast your own AI celebrity",
    openGraph: {
      title: "cast-ai.vercel.app",
      description: "Cast your own AI celebrity",
      images: [`${NEXT_PUBLIC_URL}/celeb-collage.jpg`],
    },
    other: {
      ...frameMetadata,
    },
  };
}

const CelebPage = () => {
  return <div>Celebrity Page</div>;
};

export default CelebPage;
