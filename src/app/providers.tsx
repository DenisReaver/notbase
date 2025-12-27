"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, coinbaseWallet } from "wagmi/connectors";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  connectors: [
    injected({ target: "metaMask" }), // Специально для MetaMask
    injected({ target: "all" }), // Для других injected
    coinbaseWallet({
      appName: "NotBase Clicker",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}