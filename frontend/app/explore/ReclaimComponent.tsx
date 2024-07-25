"use client";
import { Dispatch, SetStateAction, useState } from "react";
import QRCode from "react-qr-code";

import { Reclaim } from "@reclaimprotocol/js-sdk";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";

export default function ReclaimComponent({
  setIsVerified,
}: {
  setIsVerified: Dispatch<SetStateAction<boolean>>;
}) {
  const [url, setUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const APP_ID = "0x2a38469C94810Ec851028d6BB186bBf239E6760B"; // application ID
  const APP_SECRET =
    "0xa6f3567ebd6a9ec63b7d2343c0e3bafd43245244f9f99ca694bff2dce04e2b02"; // APP_SECRET
  const reclaimClient = new Reclaim.ProofRequest(APP_ID);

  async function generateVerificationRequest() {
    try {
      const providerId = "39c31ffd-0be0-4e45-9a18-1eb3cb8099e1"; //provider ID

      //context to the proof request
      reclaimClient.addContext(
        `user's address`,
        "for acmecorp.com on 1st January"
      );

      // Build the proof request
      await reclaimClient.buildProofRequest(providerId);

      // Generate the signature
      const signature = await reclaimClient.generateSignature(APP_SECRET);
      reclaimClient.setSignature(signature);

      // Create the verification request
      const { requestUrl, statusUrl } =
        await reclaimClient.createVerificationRequest();
      setUrl(requestUrl);

      // Start the session with retry logic
      const startSession = async () => {
        try {
          await reclaimClient.startSession({
            onSuccessCallback: (proofs) => {
              console.log("Verification success", proofs);
              setIsVerified(true);
              setVerificationMessage("Verification succeeded.");
            },
            onFailureCallback: (error) => {
              console.error("Verification failed", error);
              setIsVerified(false);
              setVerificationMessage("Verification failed. Please try again.");
              setError("Verification failed. Please try again.");
            },
          });
        } catch (err) {
          console.error("Error starting session", err);
          setVerificationMessage("An error occurred. Please try again.");
          setError("An error occurred. Please try again.");
        }
      };

      startSession();
    } catch (err) {
      console.error("Error generating verification request", err);
      setVerificationMessage("An error occurred. Please try again.");
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div>Verify your Identity with Reclaim Protocol to earn 2x rewards</div>

      <Dialog onOpenChange={() => setUrl("")}>
        <DialogTrigger>
          {!url && !error && !verificationMessage && (
            <Button
              onClick={generateVerificationRequest}
              className="px-6 py-2 bg-[#0101EE] text-white rounded-lg hover:bg-[#0101EE] transition-colors mt-5"
            >
              Create Claim QR Code
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col justify-center items-center gap-5">
              {url ? (
                <DialogTitle>
                  <div className="flex justify-center items-center mb-5 ">
                    <p className="text-md ">Private ZK Proofs made easier </p>
                    <Image
                      className="ml-5  rounded-md"
                      src="/reclaim-logo.jpeg"
                      alt="Farcaster Logo"
                      width={80}
                      height={80}
                    />
                  </div>
                  <p className="text-center">
                    Scan the QR code with your Reclaim APP <br /> to verify your
                    identity ( Twitter Auth ).
                  </p>
                </DialogTitle>
              ) : (
                <p>QR is getting generated ....</p>
              )}

              <DialogDescription>
                <div className="flex flex-col items-center mb-5">
                  {url && (
                    <div className="">
                      <QRCode value={url} />
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 text-lg font-semibold text-red-600 bg-red-200 rounded-lg p-4 shadow">
                      {error}
                    </div>
                  )}
                  {verificationMessage && (
                    <div className="mt-4 text-lg font-semibold text-green-600 bg-green-200 rounded-lg p-4 shadow">
                      {verificationMessage}
                    </div>
                  )}
                </div>

                {url && (
                  <div className="flex gap-5">
                    <Link
                      target="_blank"
                      className="bg-black py-3 px-5 rounded-md"
                      href={
                        "https://apps.apple.com/in/app/reclaim-protocol/id6475267895"
                      }
                    >
                      <div className="flex gap-2 justify-center items-center">
                        <div>
                          <Image
                            src={"/apple-icon.png"}
                            height={40}
                            width={40}
                            alt="Icon of App Store"
                          ></Image>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-white">Download on the</p>
                          <p className="text-lg text-white font-semibold">
                            App Store
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      target="_blank"
                      className="bg-black py-3 px-5 rounded-md"
                      href={
                        "https://play.google.com/store/apps/details?id=com.reclaim.protocol&hl=en_IN"
                      }
                    >
                      <div className="flex gap-2 justify-center items-center">
                        <div>
                          <Image
                            src={"/google-play-icon.png"}
                            height={40}
                            width={40}
                            alt="Icon of Google Play Store"
                          ></Image>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-white">Get it on</p>
                          <p className="text-lg text-white font-semibold">
                            Google Play
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
