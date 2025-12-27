"use client";

import { useAccount, useConnect, useReadContract, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { parseAbi } from "viem";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0xA37E4DFE299489f775a316afc665B90F5B0d2fd0" as const;

const ABI = parseAbi([
  "function click() external",
  "function getClicks(address) external view returns (uint256)",
]);

export default function MainContent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, pendingConnector, isPending } = useConnect();
  const [clicks, setClicks] = useState<bigint>(BigInt(0));
  const [clicking, setClicking] = useState(false);

  const { data: clicksData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getClicks",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    chainId: base.id,
    query: { enabled: isConnected && !!address },
  });

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (clicksData !== undefined) {
      setClicks(clicksData);
    }
  }, [clicksData]);

  const handleClick = () => {
    if (clicking || !isConnected) return;

    setClicking(true);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "click",
      chainId: base.id,
    });

    setClicks((prev) => prev + BigInt(1));
    setTimeout(() => setClicking(false), 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-4">
      <h1 className="text-7xl font-black mb-4">NotBase</h1>
      <p className="text-2xl mb-12 opacity-80">Mainnet Clicker</p>

      {!isConnected ? (
        <div className="flex flex-col gap-6">
          {connectors
            .filter((c) => c.ready) // Показываем только готовые коннекторы
            .filter((c, i, arr) => 
              // Убираем дубли по имени
              arr.findIndex((x) => x.name === c.name) === i
            )
            .map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-3xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isPending && connector.uid === pendingConnector?.uid
                  ? "Connecting…"
                  : connector.name}
              </button>
            ))}
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <p className="text-4xl mb-4">Your clicks</p>
            <p className="text-9xl font-black tabular-nums">
              {clicks.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleClick}
            disabled={clicking}
            className="relative w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-7xl font-bold disabled:opacity-70"
          >
            {clicking ? "⏳" : "Click"}
            <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-30"></span>
          </button>

          <p className="mt-12 text-sm opacity-70">
            Every click is your NotBase token
          </p>
          <p className="text-xs opacity-50">
            Contract: {CONTRACT_ADDRESS.slice(0, 8)}…{CONTRACT_ADDRESS.slice(-6)}
          </p>
        </>
      )}
    </main>
  );
}