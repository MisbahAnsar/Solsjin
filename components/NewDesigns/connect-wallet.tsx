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
  BitKeep: {
    id: "bitget",
    name: "Bitget",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        <img
          src="https://web3.bitget.com/favicon.ico"
          alt="Bitget"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.textContent = "B";
            }
          }}
        />
      </div>
    ),
    category: "more",
  },
  "Bitget Wallet": {
    id: "bitget",
    name: "Bitget",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
        <img
          src="https://web3.bitget.com/favicon.ico"
          alt="Bitget"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.textContent = "B";
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
  const [selectedWalletForInstall, setSelectedWalletForInstall] = useState<string | null>(null);

  // Separate wallets by readyState (following the reference pattern)
  const { installedWallets, popularWallets, moreWallets } = useMemo(() => {
    type WalletWithDisplay = Wallet & { display: WalletDisplay };
    const installed: WalletWithDisplay[] = [];
    const popular: WalletWithDisplay[] = [];
    const more: WalletWithDisplay[] = [];

    console.log("=== WALLET DETECTION DEBUG ===");
    console.log("Total wallets from adapter:", wallets.length);
    
    for (const wallet of wallets) {
      console.log(`\n📍 Wallet: ${wallet.adapter.name}`);
      console.log(`   ReadyState: ${wallet.readyState} (Installed = ${WalletReadyState.Installed})`);
      console.log(`   Is Installed: ${wallet.readyState === WalletReadyState.Installed}`);
      
      const display = walletDisplayMap[wallet.adapter.name];
      if (!display) {
        console.log(`   ⚠️ No display mapping found`);
        continue;
      }

      const walletWithDisplay: WalletWithDisplay = { ...wallet, display };

      if (wallet.readyState === WalletReadyState.Installed) {
        console.log(`   ✅ Adding to INSTALLED section`);
        installed.push(walletWithDisplay);
      } else {
        console.log(`   ❌ NOT installed (skipping)`);
      }

      if (display.category === "popular") {
        popular.push(walletWithDisplay);
      } else {
        more.push(walletWithDisplay);
      }
    }

    console.log("\n📊 FINAL RESULTS:");
    console.log("Installed wallets:", installed.map(w => w.adapter.name));
    console.log("Popular wallets:", popular.map(w => w.adapter.name));
    console.log("More wallets:", more.map(w => w.adapter.name));

    // Add manual Bitget install option if not already in any list
    const hasBitgetEntry =
      installed.some((wallet) => wallet.display.id === "bitget") ||
      popular.some((wallet) => wallet.display.id === "bitget") ||
      more.some((wallet) => wallet.display.id === "bitget");

    if (!hasBitgetEntry && walletDisplayMap.BitKeep) {
      console.log("⚠️ Bitget not detected, adding manual install option");
      const bitgetDisplay = walletDisplayMap.BitKeep;
      const manualBitget: WalletWithDisplay = {
        adapter: {
          name: "Bitget Install",
          icon: "",
          url: "https://web3.bitget.com/",
        } as any,
        readyState: WalletReadyState.NotDetected,
        display: bitgetDisplay,
      } as WalletWithDisplay;
      more.push(manualBitget);
    } else {
      console.log("✅ Bitget wallet detected in lists");
    }

    console.log("=== END DEBUG ===\n");

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
      setSelectedWalletForInstall(null);
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

    const isBitgetInstallPrompt = display.id === "bitget" && wallet.adapter.name === "Bitget Install";
    
    return (
      <button
        onClick={async () => {
          console.log("\n🖱️ WALLET CLICKED:");
          console.log("   Wallet Name:", wallet.adapter.name);
          console.log("   Display Name:", display.name);
          console.log("   Is Installed:", isInstalled);
          console.log("   Ready State:", wallet.readyState);
          console.log("   Is Bitget Install:", isBitgetInstallPrompt);
          
          if (isBitgetInstallPrompt) {
            console.log("   → Showing Bitget install UI");
            setSelectedWalletForInstall(display.id);
            // Clear any previous connection state
            setConnectionStatus("idle");
            setSelectedWalletName(null);
          } else if (isInstalled) {
            console.log("   → Attempting to connect...");
            // Clear install UI first
            setSelectedWalletForInstall(null);
            
            // Update both wallet name and status in the same render cycle
            const walletName = wallet.adapter.name;
            setSelectedWalletName(walletName);
            
            // Force a small delay to ensure state updates, then set connecting
            requestAnimationFrame(() => {
              setConnectionStatus("connecting");
              
              // Small delay to ensure UI updates before extension popup
              setTimeout(() => {
                select(walletName);
              }, 50);
            });
          } else {
            console.log("   ⚠️ Wallet not installed, ignoring click");
          }
        }}
        className={`w-full flex items-center gap-2.5 rounded-xl py-2 transition-all cursor-pointer px-2 ${
          isInstalled || isBitgetInstallPrompt
            ? "hover:shadow-sm hover:bg-zinc-200"
            : "hover:bg-zinc-200"
        }`}
      >
        {walletIcon}
        <div className="flex-1 text-left min-w-0">
          <span className="font-semibold text-sm text-gray-900 balsamiq-sans-bold">
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
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 balsamiq-sans-bold px-2 ${
        title === "Installed" ? "text-blue-600" : "text-gray-500"
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
            <div className="text-xs text-gray-500 text-center py-4 font-sans">
              {emptyMessage}
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-black/90 transition-colors"
        >
          {connected && publicKey ? "Wallet Connected" : "Connect Wallet"}
        </button>
        {connected && publicKey && (
          <div className="text-xs text-gray-600 font-mono">
            Connected: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col h-full font-sans p-4 box-border">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-black tracking-tight balsamiq-sans-bold px-2">
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

          <div className="flex flex-1 overflow-hidden min-h-0">
            <aside className="w-52 border-r border-gray-200 flex-shrink-0 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4 min-h-0">
                <WalletSection
                  title="Installed"
                  wallets={installedWallets}
                  emptyMessage="No Solana wallets detected"
                />
                <WalletSection title="Popular" wallets={popularWallets} />
                <WalletSection title="More" wallets={moreWallets} />
              </div>
            </aside>

            <section className="flex-1 overflow-hidden flex items-center justify-center p-6">
              {selectedWalletForInstall === "bitget" ? (
                <div className="h-full flex flex-col w-full max-w-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 balsamiq-sans-bold">
                    Connect to Bitget
                  </h3>
                  <div className="flex-1 flex items-center justify-center pb-8">
                    <img 
                      src="https://web3.bitget.com/favicon.ico" 
                      alt="Bitget" 
                      className="w-32 h-32 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-gray-600 balsamiq-sans-regular">
                      Don&apos;t have Bitget?
                    </span>
                    <button
                      onClick={() => window.open("https://web3.bitget.com/", "_blank", "noopener")}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs balsamiq-sans-bold"
                    >
                      Get App!
                    </button>
                  </div>
                </div>
              ) : selectedWalletName && installedWallets.some(w => w.adapter.name === selectedWalletName) && connectionStatus !== "idle" ? (
                <div className="max-w-md space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                  {connectionStatus === "connecting" && (
                    <>
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#C4F582] rounded-full animate-spin mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 balsamiq-sans-bold">
                        Connecting {walletDisplayMap[selectedWalletName]?.name || selectedWalletName} wallet...
                      </h3>
                      <p className="text-sm text-gray-600 text-center balsamiq-sans-regular">
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 balsamiq-sans-bold">
                        You are connected!
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-4 balsamiq-sans-regular">
                        Your wallet is now connected to this application
                      </p>
                      {publicKey && (
                        <div className="text-xs text-gray-500 font-mono break-all text-center px-4">
                          {publicKey.toBase58()}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setConnectionStatus("idle");
                          setSelectedWalletName(null);
                        }}
                        className="px-6 py-2 bg-[#C4F582] text-black rounded-lg font-medium hover:bg-[#b5e673] transition-colors balsamiq-sans-bold"
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 balsamiq-sans-bold">
                        Connection Failed!
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-4 balsamiq-sans-regular">
                        Connection to {walletDisplayMap[selectedWalletName]?.name || selectedWalletName} was canceled. Please try again.
                      </p>
                      <button
                        onClick={() => {
                          if (selectedWalletName) {
                            console.log("🔄 Retrying connection to:", selectedWalletName);
                            // Find the wallet and call select with the actual adapter name
                            const walletToRetry = installedWallets.find(w => w.adapter.name === selectedWalletName);
                            if (walletToRetry) {
                              setConnectionStatus("connecting");
                              select(walletToRetry.adapter.name);
                            }
                          }
                        }}
                        className="px-6 py-2 bg-[#C4F582] text-black rounded-lg font-medium hover:bg-[#b5e673] transition-colors balsamiq-sans-bold"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="max-w-sm space-y-4 flex flex-col items-center text-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 balsamiq-sans-bold">
                      What is a Wallet?
                    </h3>
                  </div>

                  <div className="w-full flex flex-col items-center">
                    <img 
                      src="/logo.png" 
                      alt="Wallet preview" 
                      className="w-40 h-40 rounded-[48px] mb-4 object-cover shadow-sm"
                    />
                    <p className="text-sm text-gray-600 leading-relaxed balsamiq-sans-regular max-w-[280px]">
                      Your secure gateway to store, send, and receive digital assets.
                    </p>
                  </div>

                  <div className="pt-2 space-y-2 flex flex-col items-center w-full">
                    <button className="bg-blue-500 text-black py-2.5 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm balsamiq-sans-bold">
                      Get a Wallet
                    </button>
                    <button className="text-blue-500 font-medium hover:text-blue-600 transition-colors text-sm balsamiq-sans-bold">
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
