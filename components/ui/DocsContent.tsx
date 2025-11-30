// Rendering the Connect Wallet component in the docs page.(this includes modal as well)


"use client";

import ConnectWallet from "@/components/NewDesigns/connect-wallet";

interface DocsContentProps {
  activeItem: string;
}

export default function DocsContent({ activeItem }: DocsContentProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ConnectWallet />
    </div>
  );
}

