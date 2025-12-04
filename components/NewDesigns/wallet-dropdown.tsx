// WalletDropdown component - A dropdown that expands from a profile picture to show wallet address and balance

"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { TokenIcon } from "@/components/sol/token-icon";
import { gsap } from "gsap";

function WalletDropdown() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch SOL balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connection) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setSolBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh balance every 5 seconds
    const interval = setInterval(fetchBalance, 5000);
    
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  // GSAP animation - Profile stays, dropdown box animates separately
  useEffect(() => {
    if (!containerRef.current || !profileRef.current) return;

    const container = containerRef.current;
    const profile = profileRef.current;

    // Kill any existing animations
    gsap.killTweensOf([container, profile, contentRef.current]);

    if (isExpanded) {
      // Show content immediately but keep it invisible
      setShowContent(true);
      
      // Wait for content to be rendered, then animate
      const animate = () => {
        const content = contentRef.current;
        if (!content) {
          requestAnimationFrame(animate);
          return;
        }

        gsap.killTweensOf(content);

        // Measure the content height accurately BEFORE animation
        // Set container to expanded width temporarily to get accurate measurement
        gsap.set(container, { width: 320, height: "auto" });
        const measuredHeight = container.offsetHeight;
        
        // Reset container to starting state
        gsap.set(container, { width: 56, height: 56 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
        });

        // Step 1: Container expands and profile moves to left - SMOOTH and COMPLETE
        tl.to(
          container,
          {
            width: 320,
            height: measuredHeight,
            borderRadius: 12,
            duration: 0.5,
            ease: "power2.inOut",
          }
        );

        tl.to(
          profile,
          {
            x: -120,
            y: -38,
            scale: 0.857,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<" // Start at same time as container
        );

        // Step 2: Dropdown box appears from below with blur - AFTER container is fully expanded
        tl.fromTo(
          content,
          {
            opacity: 0,
            y: 10,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.15" // Start when container is almost done
        );
      };

      requestAnimationFrame(animate);
    } else {
      // Collapse animation - EXACT REVERSE of opening
      const content = contentRef.current;
      
      if (content) {
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            setShowContent(false);
            // Reset container and profile to initial state
            gsap.set(profile, {
              x: 0,
              y: 0,
              scale: 1,
            });
            gsap.set(container, {
              width: 56,
              height: 56,
              borderRadius: "9999px",
            });
          },
        });

        // Step 1: Dropdown box fades out downward with blur
        tl.to(
          content,
          {
            opacity: 0,
            y: 10,
            filter: "blur(6px)",
            duration: 0.3,
            ease: "power2.in",
          }
        );

        // Step 2: Profile moves back to center and container shrinks
        tl.to(
          profile,
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "-=0.1"
        );

        tl.to(
          container,
          {
            width: 56,
            height: 56,
            borderRadius: "9999px",
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<" // Start at same time as profile
        );
      } else {
        // If no content, just reset immediately
        gsap.set(profile, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
        });
        gsap.set(container, {
          width: 56,
          height: 56,
          borderRadius: "9999px",
        });
        setShowContent(false);
      }
    }
  }, [isExpanded]);

  // Handle copy address
  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Truncate address helper
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Format SOL balance
  const formatBalance = (balance: number | null) => {
    if (balance === null) return "0.00";
    return balance.toFixed(4);
  };

  if (!connected || !publicKey) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-gray-500 text-sm">
          {!connected ? "Connect a wallet to view dropdown" : "No wallet connected"}
        </div>
        <div className="text-xs text-gray-400">
          Go to "Connect Wallet" tab to connect your wallet first
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        ref={containerRef}
        className="bg-black text-white rounded-full shadow-2xl overflow-hidden cursor-pointer relative"
        style={{
          width: 56,
          height: 56,
          borderRadius: "9999px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Clicking when expanded should close it
          if (isExpanded) {
            setIsExpanded(false);
          } else {
            setIsExpanded(true);
          }
        }}
      >
        {/* Profile picture - morphs smoothly from center to left */}
        <div
          ref={profileRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{
            transform: "translateX(0) scale(1)",
          }}
        >
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-white/10">
            <img
              src="/pfp.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Expanded content - dropdown box that appears from below */}
        {showContent && (
          <div
            ref={contentRef}
            className="relative z-10"
            style={{
              pointerEvents: isExpanded ? "auto" : "none",
              opacity: 0,
              transform: "translateY(10px)",
              filter: "blur(6px)",
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 min-h-[56px]">
              {/* Spacer for profile picture position */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full pointer-events-none" aria-hidden="true" />
              
              <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
                <span className="font-mono text-sm text-white truncate">
                  {truncateAddress(publicKey.toBase58())}
                </span>
                
                <motion.button
                  onClick={handleCopyAddress}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Balance section */}
            <div className="px-4 bg-gray-900/50">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold pt-3 pb-1.5">
                Balance
              </div>
              <div className="flex items-center justify-between pb-2">
                <TokenIcon symbol="SOL" size={36} />
                <div className="flex items-baseline gap-1.5">
                  {loading ? (
                    <div className="w-20 h-5 bg-gray-800 rounded animate-pulse" />
                  ) : (
                    <>
                      <span className="text-base font-semibold text-white">
                        {formatBalance(solBalance)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">SOL</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletDropdown;
export { WalletDropdown };
