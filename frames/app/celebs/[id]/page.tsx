import { Metadata } from "next";
const NEXT_PUBLIC_URL = "https://zizzamia.xyz";
import { getFrameMetadata } from "@coinbase/onchainkit/core";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Story time",
    },
    {
      action: "tx",
      label: "Send Base Sepolia",
      target: `${NEXT_PUBLIC_URL}/api/tx`,
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/celeb-collage.jpg`,
    aspectRatio: "1:1",
  },
  input: {
    text: "Talk with your AI celeb",
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "zizzamia.xyz",
  description: "LFG",
  openGraph: {
    title: "zizzamia.xyz",
    description: "LFG",
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};
