"use client";

import { useMemo, type ReactNode } from "react";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { AvanaWalletAdapter } from "@solana/wallet-adapter-avana";
import { AlphaWalletAdapter } from "@solana/wallet-adapter-alpha";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-nightly";
import { BitKeepWalletAdapter } from "@solana/wallet-adapter-bitkeep";
import { MathWalletAdapter } from "@solana/wallet-adapter-mathwallet";
import { TorusWalletAdapter } from "@solana/wallet-adapter-torus";
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust";
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new AvanaWalletAdapter(),
      new AlphaWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new NightlyWalletAdapter(),
      new BitKeepWalletAdapter(),
      new MathWalletAdapter(),
      new TorusWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    []
  );

  const endpoint = useMemo(() => "https://api.mainnet-beta.solana.com", []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

