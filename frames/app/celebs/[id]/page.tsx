import { Metadata } from "next";
import { ResolvingMetadata } from "next";
import React from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/core";

type Props = {
  params: { id: string };
  searchParams: {
    celebName: string;
    celebPersonality1: string;
    celebPersonality2: string;
    celebPersonality3: string;
    celebPersonality4: string;
    description: string;
  };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const frameMetadata = getFrameMetadata({
    state: {
      celebId: id,
    },
    buttons: [
      {
        label: searchParams.celebPersonality1,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/1?celebId=${id}&button=1&celebName=${searchParams.celebName}&celebPersonality1=${searchParams.celebPersonality1}&celebPersonality2=${searchParams.celebPersonality2}&celebPersonality3=${searchParams.celebPersonality3}&celebPersonality4=${searchParams.celebPersonality4}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/1?celebId=${id}`,
      },
      {
        label: searchParams.celebPersonality2,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/2?celebId=${id}&button=2&celebName=${searchParams.celebName}&celebPersonality1=${searchParams.celebPersonality1}&celebPersonality2=${searchParams.celebPersonality2}&celebPersonality3=${searchParams.celebPersonality3}&celebPersonality4=${searchParams.celebPersonality4}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/2?celebId=${id}`,
      },
      {
        label: searchParams.celebPersonality3,
        action: "tx",
        postUrl: `${process.env.NEXT_PUBLIC_URL}tx-success/enablePersonality/3?celebId=${id}&button=3&celebName=${searchParams.celebName}&celebPersonality1=${searchParams.celebPersonality1}&celebPersonality2=${searchParams.celebPersonality2}&celebPersonality3=${searchParams.celebPersonality3}&celebPersonality4=${searchParams.celebPersonality4}`,
        target: `${process.env.NEXT_PUBLIC_URL}tx/enablePersonality/3?celebId=${id}`,
      },
      {
        label: "Chat",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_URL}chat?celebName=${searchParams.celebName}&celebPersonality1=${searchParams.celebPersonality1}&celebPersonality2=${searchParams.celebPersonality2}&celebPersonality3=${searchParams.celebPersonality3}&celebPersonality4=${searchParams.celebPersonality4}`,
      },
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}celeb-collage.jpg`,
      aspectRatio: "1:1",
    },
    input: {
      text: `Talk with ${searchParams.celebName}`,
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}tx/frame/`,
  });

  return {
    title: "cast-ai.vercel.app",
    description: "Cast your own AI celebrity",
    openGraph: {
      title: "cast-ai.vercel.app",
      description: "Cast your own AI celebrity",
      images: [`${process.env.NEXT_PUBLIC_URL}/celeb-collage.jpg`],
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
