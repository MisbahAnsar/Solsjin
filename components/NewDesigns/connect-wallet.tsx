"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import Modal from "@/components/ui/connect-wallet-modal";
import { X, Copy, LogOut, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type WalletCategory = "popular" | "more";

type WalletWithDisplay = Wallet & { display: WalletDisplay };


interface WalletDisplay {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: WalletCategory;
}

const createWalletIcon = (imgSrc: string, alt: string, gradient: string, fallback: string) => (
  <div className={`w-7 h-7 rounded-lg ${gradient} flex items-center justify-center text-white font-semibold text-xs shadow-inner`}>
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-contain rounded-lg"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        if (target.parentElement) target.parentElement.textContent = fallback;
      }}
    />
  </div>
);

const walletDisplayMap: Record<string, WalletDisplay> = {
  Phantom: {
    id: "phantom",
    name: "Phantom",
    icon: createWalletIcon("https://phantom.app/img/logo.png", "Phantom", "bg-gradient-to-br from-purple-500 to-purple-600", "P"),
    category: "popular",
  },
  Solflare: {
    id: "solflare",
    name: "Solflare",
    icon: createWalletIcon("https://solflare.com/favicon.ico", "Solflare", "bg-gradient-to-br from-orange-400 to-red-500", "S"),
    category: "popular",
  },
  Avana: {
    id: "avane",
    name: "Avana",
    icon: <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-inner">A</div>,
    category: "more",
  },
  Alpha: {
    id: "alpha",
    name: "Alpha",
    icon: <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">α</div>,
    category: "more",
  },
  "Coinbase Wallet": {
    id: "coinbase",
    name: "Coinbase",
    icon: createWalletIcon("https://www.coinbase.com/favicon.ico", "Coinbase", "bg-gradient-to-br from-blue-600 to-blue-700", "C"),
    category: "more",
  },
  BitKeep: {
    id: "bitget",
    name: "Bitget",
    icon: createWalletIcon("https://web3.bitget.com/favicon.ico", "Bitget", "bg-gradient-to-br from-blue-500 to-blue-600", "B"),
    category: "more",
  },
  "Bitget Wallet": {
    id: "bitget",
    name: "Bitget",
    icon: createWalletIcon("https://web3.bitget.com/favicon.ico", "Bitget", "bg-gradient-to-br from-blue-500 to-blue-600", "B"),
    category: "more",
  },
};

export default function ConnectWallet() {
  const { wallets, select, connecting, connected, publicKey, wallet, disconnect } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "retry">("idle");
  const [selectedWalletForInstall, setSelectedWalletForInstall] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

      display.category === "popular" ? popular.push(walletWithDisplay) : more.push(walletWithDisplay);
    }

    // Add manual Bitget install option if not detected
    const hasBitget = [...installed, ...popular, ...more].some(w => w.display.id === "bitget");
    
    if (!hasBitget && walletDisplayMap.BitKeep) {
      more.push({
        adapter: { name: "Bitget Install", icon: "", url: "https://web3.bitget.com/" } as any,
        readyState: WalletReadyState.NotDetected,
        display: walletDisplayMap.BitKeep,
      } as WalletWithDisplay);
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
      setSelectedWalletForInstall(null);
    }
  }, [isModalOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Handle copy address
  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    await disconnect();
    setIsDropdownOpen(false);
  };

  // Truncate address helper
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 12)}...`;
  };

  const getCurrentWalletIcon = () => {
    if (!wallet) return null;
    
    if (wallet.adapter.icon) {
      return <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-5 h-5 object-contain rounded" />;
    }
    
    const iconMap: Record<string, string> = {
      "Phantom": "https://phantom.app/img/logo.png",
      "Solflare": "https://solflare.com/favicon.ico",
      "Coinbase Wallet": "https://www.coinbase.com/favicon.ico",
      "BitKeep": "https://web3.bitget.com/favicon.ico",
      "Bitget Wallet": "https://web3.bitget.com/favicon.ico",
    };
    
    const iconUrl = iconMap[wallet.adapter.name];
    return iconUrl 
      ? <img src={iconUrl} alt={wallet.adapter.name} className="w-5 h-5 object-contain rounded" />
      : <span className="text-xs font-semibold">{wallet.adapter.name.charAt(0)}</span>;
  };

  const WalletItem = ({ wallet, isInstalled }: { wallet: WalletWithDisplay; isInstalled: boolean }) => {
    const { display } = wallet;
    const isBitgetInstallPrompt = display.id === "bitget" && wallet.adapter.name === "Bitget Install";
    
    const walletIcon = wallet.adapter.icon ? (
      <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
          className="w-full h-full object-contain"
          onError={(e) => (e.target as HTMLImageElement).style.display = "none"}
        />
      </div>
    ) : display.icon;

    const handleClick = () => {
      if (isBitgetInstallPrompt) {
        setSelectedWalletForInstall(display.id);
        setConnectionStatus("idle");
        setSelectedWalletName(null);
      } else if (isInstalled) {
        setSelectedWalletForInstall(null);
        setSelectedWalletName(wallet.adapter.name);
        requestAnimationFrame(() => {
          setConnectionStatus("connecting");
          setTimeout(() => select(wallet.adapter.name), 50);
        });
      }
    };
    
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-2.5 rounded-xl py-2 px-2 transition-all cursor-pointer ${
          (isInstalled || isBitgetInstallPrompt) ? "hover:shadow-sm hover:bg-zinc-200" : "hover:bg-zinc-200"
        }`}
      >
        {walletIcon}
        <span className="flex-1 text-left font-semibold text-sm text-gray-900 balsamiq-sans-bold">
          {display.name}
        </span>
      </button>
    );
  };

  const WalletSection = ({ title, wallets, emptyMessage }: { title: string; wallets: WalletWithDisplay[]; emptyMessage?: string }) => (
    <div>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 balsamiq-sans-bold px-2 ${title === "Installed" ? "text-blue-600" : "text-gray-500"}`}>
        {title}
      </h4>
      <div className="space-y-1">
        {wallets.length ? (
          wallets.map((wallet) => (
            <WalletItem key={wallet.adapter.name} wallet={wallet} isInstalled={wallet.readyState === WalletReadyState.Installed} />
          ))
        ) : (
          emptyMessage && <div className="text-xs text-gray-500 text-center py-4 font-sans">{emptyMessage}</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {connected && publicKey ? (
          <div className="relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-black text-white px-4 py-2.5 font-medium hover:bg-black/90 flex items-center gap-2.5 shadow-lg"
              style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              animate={{
                borderBottomLeftRadius: isDropdownOpen ? 0 : 8,
                borderBottomRightRadius: isDropdownOpen ? 0 : 8,
              }}
              transition={{ 
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
                delay: isDropdownOpen ? 0 : 0.05
              }}
            >
              <div className="flex items-center justify-center w-5 h-5">
                {getCurrentWalletIcon()}
              </div>
              <span className="font-mono text-sm tracking-tight">
                {truncateAddress(publicKey.toBase58())}
              </span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>
            
            <AnimatePresence mode="wait">
              {isDropdownOpen && (
                <motion.div
                  initial={{ 
                    opacity: 0,
                    height: 0,
                    y: -10,
                  }}
                  animate={{ 
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  exit={{ 
                    opacity: 0,
                    height: 0,
                    y: -10,
                  }}
                  transition={{ 
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute top-[calc(100%-4px)] left-0 right-0 bg-black text-white rounded-b-lg shadow-xl overflow-hidden z-50 origin-top"
                >
                  <div className="border-t border-gray-700"></div>
                  <motion.button
                    onClick={handleCopyAddress}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-2.5 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ 
                      duration: 0.15,
                      delay: 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-100">Copy Address</span>
                      </>
                    )}
                  </motion.button>
                  <div className="border-t border-gray-700"></div>
                  <motion.button
                    onClick={handleDisconnect}
                    className="w-full px-4 py-3 text-left hover:bg-red-900/20 transition-colors flex items-center gap-2.5 text-sm text-red-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ 
                      duration: 0.15,
                      delay: 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-black/90 transition-colors"
          >
            Connect Wallet
          </button>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 balsamiq-sans-bold">Connect to Bitget</h3>
                  <div className="flex-1 flex items-center justify-center pb-8">
                    <img src="https://web3.bitget.com/favicon.ico" alt="Bitget" className="w-32 h-32 object-contain" onError={(e) => (e.target as HTMLImageElement).style.display = "none"} />
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-gray-600 balsamiq-sans-regular">Don&apos;t have Bitget?</span>
                    <button onClick={() => window.open("https://web3.bitget.com/", "_blank", "noopener")} className="px-4 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs balsamiq-sans-bold">
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
                      <p className="text-sm text-gray-600 text-center balsamiq-sans-regular">Please approve the connection request in your wallet</p>
                    </>
                  )}
                  {connectionStatus === "connected" && (
                    <>
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 balsamiq-sans-bold">You are connected!</h3>
                      <p className="text-sm text-gray-600 text-center mb-4 balsamiq-sans-regular">Your wallet is now connected to this application</p>
                      {publicKey && <div className="text-xs text-gray-500 font-mono break-all text-center px-4">{publicKey.toBase58()}</div>}
                      <button
                        onClick={() => { setIsModalOpen(false); setConnectionStatus("idle"); setSelectedWalletName(null); }}
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 balsamiq-sans-bold">Connection Failed!</h3>
                      <p className="text-sm text-gray-600 text-center mb-4 balsamiq-sans-regular">
                        Connection to {walletDisplayMap[selectedWalletName]?.name || selectedWalletName} was canceled. Please try again.
                      </p>
                      <button
                        onClick={() => {
                          const walletToRetry = installedWallets.find(w => w.adapter.name === selectedWalletName);
                          if (walletToRetry) { setConnectionStatus("connecting"); select(walletToRetry.adapter.name); }
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3 balsamiq-sans-bold">What is a Wallet?</h3>
                  <img src="/logo.png" alt="Wallet preview" className="w-40 h-40 rounded-[48px] mb-4 object-cover shadow-sm" />
                  <p className="text-sm text-gray-600 leading-relaxed balsamiq-sans-regular max-w-[280px]">
                    Your secure gateway to store, send, and receive digital assets.
                  </p>
                  <div className="pt-2 space-y-2 flex flex-col items-center w-full">
                    <button className="bg-blue-500 text-black py-2.5 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm balsamiq-sans-bold">Get a Wallet</button>
                    <button className="text-blue-500 font-medium hover:text-blue-600 transition-colors text-sm balsamiq-sans-bold">Learn More</button>
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
