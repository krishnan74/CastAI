"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import contractABI from "./AICelebrityPlatform.json";

const contractDetails = {
  address: "0x4Eb90968c5F9c06EF7196dbAf7259d5cb6f07142",
  abi: contractABI.abi,
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

  const createCelebrity = async (celebDetails) => {
    const {
      name,
      celebId,
      personality1,
      personality2,
      personality3,
      personality4,
      description,
    } = celebDetails;
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);
      const response = await contract.createCeleb(
        name,
        celebId,
        personality1,
        personality2,
        personality3,
        personality4,
        "Ai Celeb"
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const getCelebDetails = async (_celebId) => {
    try {
      const provider = await getProvider();
      const contract = await fetchContract(provider);
      const celebDetails = await contract.getCelebDetails(_celebId);
      return celebDetails;
    } catch (err) {
      console.log(err);
    }
  };

  const enablePersonality = async (_personalityIndex, _celebId) => {
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);
      const response = await contract.enablePersonality(
        _personalityIndex,
        _celebId
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
      3: {
        chainId: "0x3",
        chainName: "Ropsten Testnet",
        nativeCurrency: {
          name: "Ropsten Ether",
          symbol: "rETH",
          decimals: 18,
        },
        rpcUrls: ["https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
        blockExplorerUrls: ["https://ropsten.etherscan.io"],
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
      }}
    >
      {children}
    </Web3ModalContext.Provider>
  );
};

export const useWeb3Provider = () => useContext(Web3ModalContext);
