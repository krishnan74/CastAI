"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import contractConfig from "./AICharacterPlatform.json";
import transferTokenContract from "./TransferToken.json";
import ERCconfig from "./ERC.json";

export const Web3ModalContext = createContext();

const baseContractAddress = process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS;
const polygonContractAddress = process.env.NEXT_PUBLIC_POLYGON_CONTRACT_ADDRESS;
const tokenTransferContractAddress =
  "0xd6Fc72dE61938b21C75f8c1d86a3F89B8B5C0240";

export const Web3ModalProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const fetchContract = async (signerOrProvider) =>
    new ethers.Contract(contractAddress, contractConfig.abi, signerOrProvider);

  const getProvider = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  };

  const sendGALTokens = async (_recipientAddress) => {
    // try {
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   const signer = provider.getSigner();

    //   const galTokenContract = new ethers.Contract(
    //     "0x0c44cFecaFE4da904Ee24984FD74c91C2bE431B7",
    //     ERCconfig.abi,
    //     signer
    //   );

    //   console.log(galTokenContract);

    //   // const approveTx = await galTokenContract.approve(
    //   //   tokenTransferContractAddress,
    //   //   ethers.parseUnits("0.01", 18)
    //   // );
    //   // await approveTx.wait();

    //   // console.log(approveTx);

    //   const transferContract = new ethers.Contract(
    //     tokenTransferContractAddress,
    //     transferTokenContract.abi,
    //     signer
    //   );

    //   const depositTx = await transferContract.deposit(
    //     ethers.parseUnits("0.01", 18)
    //   );
    //   const depositReceipt = await tx.wait();
    //   const sendTx = await transferContract.transfer(
    //     recipientAddress,
    //     ethers.parseUnits("0.01", 18)
    //   );

    //   const sendReceipt = await sendTx.wait();
    //   console.log("Transaction receipt:", sendReceipt);
    //   return agentId;
    // } catch (err) {
    //   console.error("Error executing contract function:", err);
    //   return err;
    // }

    const galTokenAddress = "0x0c44cFecaFE4da904Ee24984FD74c91C2bE431B7";

    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();
    const token = new ethers.Contract(galTokenAddress, ERCconfig.abi, signer);
    const amount = ethers.parseUnits("0.01", 18);

    await token
      .transfer(_recipientAddress, amount)
      .then((transferResult) => {
        console.log("transferResult", transferResult);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const createCharacter = async (characterDetails) => {
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
      const response = await contract.createCharacter(
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

  const getCharacterDetails = async (_characterId) => {
    try {
      const provider = await getProvider();
      const contract = await fetchContract(provider);
      const characterDetails = await contract.getCharacterDetails(_characterId);
      return characterDetails;
    } catch (err) {
      console.log(err);
    }
  };

  const getUserCharacters = async (userAddress) => {
    try {
      const provider = await getProvider();
      const contract = await fetchContract(provider);
      console.log(userAddress);
      const userCharacters = await contract.getUserCharacters(userAddress);
      return userCharacters;
    } catch (err) {
      console.log(err);
    }
  };

  const withDrawETH = async (_characterId) => {
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);
      const response = await contract.withdraw(_characterId);
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
      console.log(networkId);
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

  const checkCurrentNetwork = async () => {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    console.log(chainId);
    setCurrentNetwork(chainId);

    if (chainId === "0x14a34") {
      console.log("Connected to Sepolia Testnet");

      setContractAddress(baseContractAddress);
      console.log(contractAddress);
    } else if (chainId === "0x98a") {
      console.log("Connected to Polygon Testnet");
      setContractAddress(polygonContractAddress);
      console.log(contractAddress);
    }
  };

  return (
    <Web3ModalContext.Provider
      value={{
        connectWallet,
        checkIfWalletConnected,
        switchNetwork,
        currentAccount,
        currentNetwork,
        getProvider,
        checkCurrentNetwork,
        createCharacter,
        getCharacterDetails,
        getUserCharacters,
        sendGALTokens,
      }}
    >
      {children}
    </Web3ModalContext.Provider>
  );
};

export const useWeb3Provider = () => useContext(Web3ModalContext);
