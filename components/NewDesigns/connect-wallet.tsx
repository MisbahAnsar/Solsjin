"use client";

import { useMemo, useState, useEffect } from "react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import Modal from "@/components/ui/connect-wallet-modal";
import { X } from "lucide-react";

type WalletCategory = "popular" | "more";

type WalletWithDisplay = Wallet & { display: WalletDisplay };

const infoSections = [
  {
    title: "A Home for your Digital Assets",
    description:
      "Wallets are used to send, receive, store, and display digital assets like SOL and NFTs on the Solana blockchain.",
    gradient: "from-blue-400 to-purple-500",
    reverse: false,
  },
  {
    title: "A New Way to Log In",
    description:
      "Instead of creating new accounts and passwords on every website, just connect your Solana wallet to authenticate and interact with dApps seamlessly.",
    gradient: "from-orange-400 to-pink-500",
    reverse: true,
  },
] as const;

interface WalletDisplay {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: WalletCategory;
}

// Create a map of wallet adapter names to display info
const walletDisplayMap: Record<string, WalletDisplay> = {
  Phantom: {
    id: "phantom",
    name: "Phantom",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        <img
          src="https://phantom.app/img/logo.png"
          alt="Phantom"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.textContent = "P";
            }
          }}
        />
      </div>
    ),
    category: "popular",
  },
  Solflare: {
    id: "solflare",
    name: "Solflare",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        <img
          src="https://solflare.com/favicon.ico"
          alt="Solflare"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.textContent = "S";
            }
          }}
        />
      </div>
    ),
    category: "popular",
  },
  Avana: {
    id: "avane",
    name: "Avana",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        A
      </div>
    ),
    category: "more",
  },
  Alpha: {
    id: "alpha",
    name: "Alpha",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        α
      </div>
    ),
    category: "more",
  },
  "Coinbase Wallet": {
    id: "coinbase",
    name: "Coinbase",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        <img
          src="https://www.coinbase.com/favicon.ico"
          alt="Coinbase"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.textContent = "C";
            }
          }}
        />
      </div>
    ),
    category: "more",
  },
};

export default function ConnectWallet() {
  const { wallets, select, connecting, connected, publicKey } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "retry">("idle");

  // Separate wallets by readyState (following the reference pattern)
  const { installedWallets, popularWallets, moreWallets } = useMemo(() => {
    type WalletWithDisplay = Wallet & { display: WalletDisplay };
    const installed: WalletWithDisplay[] = [];
    const popular: WalletWithDisplay[] = [];
    const more: WalletWithDisplay[] = [];

    for (const wallet of wallets) {
      const display = walletDisplayMap[wallet.adapter.name];
      if (!display) continue;

      const walletWithDisplay: WalletWithDisplay = { ...wallet, display };

      if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(walletWithDisplay);
      }

      if (display.category === "popular") {
        popular.push(walletWithDisplay);
      } else {
        more.push(walletWithDisplay);
      }
    }

    return { installedWallets: installed, popularWallets: popular, moreWallets: more };
  }, [wallets]);

  // Track connection status changes
  useEffect(() => {
    if (!selectedWalletName) return;
    
    // Only handle status for installed wallets
    const isInstalledWallet = installedWallets.some(w => w.adapter.name === selectedWalletName);
    if (!isInstalledWallet) return;

    if (connecting && selectedWalletName) {
      setConnectionStatus("connecting");
    } else if (connected && publicKey && selectedWalletName && connectionStatus === "connecting") {
      setConnectionStatus("connected");
    } else if (!connecting && !connected && selectedWalletName && connectionStatus === "connecting" && !publicKey) {
      // User canceled/left in middle (was connecting but now not connected)
      setConnectionStatus("retry");
    }
  }, [connecting, connected, publicKey, selectedWalletName, connectionStatus, installedWallets]);

  // Reset status when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setConnectionStatus("idle");
      setSelectedWalletName(null);
    }
  }, [isModalOpen]);

  const WalletItem = ({
    wallet,
    isInstalled,
  }: {
    wallet: WalletWithDisplay;
    isInstalled: boolean;
  }) => {
    const display = wallet.display;
    const adapterIcon = wallet.adapter.icon;
    
    // Use adapter icon if available, otherwise fall back to display icon
    const walletIcon = adapterIcon ? (
      <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={adapterIcon}
          alt={wallet.adapter.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to display icon if adapter icon fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>
    ) : (
      display.icon
    );

    return (
      <button
        onClick={() => {
          if (isInstalled) {
            setSelectedWalletName(wallet.adapter.name);
            select(wallet.adapter.name);
            // Don't close modal immediately - wait for connection status
          }
        }}
        className={`w-full flex items-center gap-2.5 rounded-xl py-2 transition-all ${
          isInstalled
            ? "bg-white hover:shadow-sm"
            : "bg-gray-50 hover:bg-white"
        }`}
      >
        {walletIcon}
        <div className="flex-1 text-left min-w-0">
          <span className="font-bold text-sm text-gray-900">
            {display.name}
          </span>
        </div>
      </button>
    );
  };

  const WalletSection = ({
    title,
    wallets,
    emptyMessage,
  }: {
    title: string;
    wallets: WalletWithDisplay[];
    emptyMessage?: string;
  }) => (
    <div>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
        title === "Installed" ? "text-blue-500" : "text-gray-500"
      }`}>
        {title}
      </h4>
      <div className="space-y-1">
        {wallets.length ? (
          wallets.map((wallet) => {
            const isInstalled = wallet.readyState === WalletReadyState.Installed;
            return (
              <WalletItem 
                key={wallet.adapter.name} 
                wallet={wallet} 
                isInstalled={isInstalled}
              />
            );
          })
        ) : (
          emptyMessage && (
            <div className="text-xs text-gray-400 text-center py-4">
              {emptyMessage}
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-black/90 transition-colors"
      >
        Connect Wallet
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col h-full max-h-[70vh] font-sans">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Connect a Wallet
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <aside className="w-64 border-r border-gray-200 bg-gray-50 flex-shrink-0 flex flex-col overflow-hidden">

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <WalletSection
                  title="Installed"
                  wallets={installedWallets}
                  emptyMessage="No Solana wallets detected"
                />
                <WalletSection title="Popular" wallets={popularWallets} />
                <WalletSection title="More" wallets={moreWallets} />
              </div>
            </aside>

            <section className="flex-1 overflow-hidden p-4">
              {selectedWalletName && installedWallets.some(w => w.adapter.name === selectedWalletName) && connectionStatus !== "idle" ? (
                <div className="max-w-md space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                  {connectionStatus === "connecting" && (
                    <>
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#C4F582] rounded-full animate-spin mb-4"></div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Connecting {walletDisplayMap[selectedWalletName]?.name || selectedWalletName} wallet...
                      </h3>
                      <p className="text-gray-600 text-center">
                        Please approve the connection request in your wallet
                      </p>
                    </>
                  )}
                  {connectionStatus === "connected" && (
                    <>
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        You are connected!
                      </h3>
                      <p className="text-gray-600 text-center mb-4">
                        Your wallet is now connected to this application
                      </p>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setConnectionStatus("idle");
                          setSelectedWalletName(null);
                        }}
                        className="px-6 py-2 bg-[#C4F582] text-black rounded-lg font-medium hover:bg-[#b5e673] transition-colors"
                      >
                        Continue
                      </button>
                    </>
                  )}
                  {connectionStatus === "retry" && (
                    <>
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Retry!
                      </h3>
                      <p className="text-gray-600 text-center mb-4">
                        Connection was canceled. Please try again.
                      </p>
                      <button
                        onClick={() => {
                          setConnectionStatus("idle");
                          setSelectedWalletName(null);
                        }}
                        className="px-6 py-2 bg-[#C4F582] text-black rounded-lg font-medium hover:bg-[#b5e673] transition-colors"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="max-w-sm space-y-4 flex flex-col items-center text-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      What is a Wallet?
                    </h3>
                  </div>

                  <div className="space-y-4 w-full flex flex-col items-center">
                    {infoSections.map((section) => (
                      <div
                        key={section.title}
                        className={`flex items-start gap-4 text-left max-w-xs w-full ${
                          section.reverse ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${section.gradient} rounded-lg flex-shrink-0`}
                        ></div>
                        <div className="flex-1">
                          <h4 className="text-md font-bold text-gray-900 mb-1">{section.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{section.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-2 flex flex-col items-center w-full">
                    <button className="bg-blue-500 text-black py-2.5 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm">
                      Get a Wallet
                    </button>
                    <button className="text-blue-500 font-medium hover:text-blue-600 transition-colors text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </Modal>
    </>
  );
}