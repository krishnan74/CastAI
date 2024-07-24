"use client";
import { Dispatch, SetStateAction, useState } from "react";
import QRCode from "react-qr-code";
import { Reclaim } from "@reclaimprotocol/js-sdk";
import { Button } from "@/components/ui/button";

export default function ReclaimComponent({
  setIsVerified,
}: {
  setIsVerified: Dispatch<SetStateAction<boolean>>;
}) {
  const [url, setUrl] = useState("");
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
    <div className="flex h-fit flex-col items-center justify-center">
      Verify to earn 2x rewards
      {!url && !error && !verificationMessage && (
        <Button
          onClick={generateVerificationRequest}
          className="px-6 py-2 bg-[#845DCC] text-white rounded-lg hover:bg-[#6344A6] transition-colors"
        >
          Create Claim QR Code
        </Button>
      )}
      {url && (
        <div className="mt-4">
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
  );
}
