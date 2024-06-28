import { useNetworkStore, useWalletStore } from "@/app/core";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import DataLiquidityPool from "@/app/contracts/DataLiquidityPool.json";

export const useFileStatus = (fileId: number) => {
  const [isFinalized, setIsFinalized] = useState(false);
  const [reward, setReward] = useState(0);
  const [isClaimable, setIsClaimable] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const contractAddress = useNetworkStore((state) => state.contract);
  const walletAddress = useWalletStore((state) => state.walletAddress);

  useEffect(() => {
    const checkFileStatus = async () => {
      if (!contractAddress || !walletAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DataLiquidityPool.abi, signer);

      try {
        const fileInfo = await contract.files(fileId);
        setIsFinalized(fileInfo.finalized);
        setReward(parseInt(ethers.formatEther(fileInfo.reward)));
        setIsClaimable(fileInfo.finalized && fileInfo.rewardWithdrawn === 0);
      } catch (error) {
        console.error("Error checking file status:", error);
      }
    };

    checkFileStatus();
    // Set up an interval to check the status periodically
    const interval = setInterval(checkFileStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [fileId, contractAddress, walletAddress]);

  const claimReward = async () => {
    if (!contractAddress || !walletAddress) return;

    setIsClaiming(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DataLiquidityPool.abi, signer);

    try {
      const tx = await contract.claimContributionReward(fileId);
      await tx.wait();
      setIsClaimable(false);
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return { isFinalized, reward, isClaimable, isClaiming, claimReward };
};