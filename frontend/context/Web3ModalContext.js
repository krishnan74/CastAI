"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import contractConfig from "./AICelebrityPlatform.json";

const contractDetails = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  abi: contractConfig.abi,
};

export const Web3ModalContext = createContext();

export const Web3ModalProvider = ({ children }) => {
  const DAPP_NAME = "AICelebrityPlatform";
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const fetchContract = async (signerOrProvider) =>
    new ethers.Contract(
      contractDetails.address,
      contractDetails.abi,
      signerOrProvider
    );

  const getProvider = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  };

  const createCelebrity = async (characterDetails) => {
    console.log(contractDetails.address);
    const {
      name,
      characterId,
      personality1,
      personality2,
      personality3,
      description,
    } = characterDetails;
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);
      const response = await contract.createCeleb(
        name,
        characterId,
        personality1,
        personality2,
        personality3,
        description
      );
      provider.waitForTransaction(response.hash);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const getCelebDetails = async (_characterId) => {
    try {
      const provider = await getProvider();
      const contract = await fetchContract(provider);
      const characterDetails = await contract.getCelebDetails(_characterId);
      return characterDetails;
    } catch (err) {
      console.log(err);
    }
  };

  const getUserCharacters = async (userAddress) => {
    try {
      const provider = await getProvider();
      const contract = await fetchContract(provider);
      const userCharacters = await contract.getUserCelebs(
        "0x18c00eeA07888Bcf369C9e954c74872b0C868DE4"
      );
      return userCharacters;
    } catch (err) {
      console.log(err);
    }
  };

  const enablePersonality = async (_personalityIndex, _characterId) => {
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);
      const response = await contract.enablePersonality(
        _personalityIndex,
        _characterId
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        return "No account";
      }
    } catch (err) {
      return "Not connected";
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const addNetwork = async (networkId) => {
    const networks = {
      696969: {
        chainId: "0xaa289",
        chainName: "Galadriel Devnet",
        nativeCurrency: {
          name: "Galadriel",
          symbol: "GAL",
          decimals: 18,
        },
        rpcUrls: ["https://devnet.galadriel.com"],
        blockExplorerUrls: ["https://explorer.galadriel.com/"],
      },
      84532: {
        chainId: "0x14a34",
        chainName: "Base Sepolia Testnet",
        nativeCurrency: {
          name: "Sepolia",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://sepolia.base.org"],
        blockExplorerUrls: ["https://sepolia-explorer.base.org"],
      },

      2442: {
        chainId: "0x98a",
        chainName: "Polygon zkEVM Cardona Testnet",
        nativeCurrency: {
          name: "Cardano",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.cardona.zkevm-rpc.com"],
        blockExplorerUrls: ["https://cardona-zkevm.polygonscan.com/"],
      },
    };

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networks[networkId]],
      });
    } catch (error) {
      console.error("Failed to add network:", error);
    }
  };
  const switchNetwork = async (networkId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${networkId}` }],
      });
    } catch (err) {
      if (err.code === 4902) {
        await addNetwork(networkId);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <Web3ModalContext.Provider
      value={{
        connectWallet,
        checkIfWalletConnected,
        switchNetwork,
        DAPP_NAME,
        currentAccount,
        getProvider,
        createCelebrity,
        getCelebDetails,
        getUserCharacters,
      }}
    >
      {children}
    </Web3ModalContext.Provider>
  );
};

export const useWeb3Provider = () => useContext(Web3ModalContext);
