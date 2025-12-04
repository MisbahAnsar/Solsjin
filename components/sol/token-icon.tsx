"use client";

import React, { useState } from "react";

type TokenIconProps = {
  symbol?: string;
  image?: string;
  size?: number;
  className?: string;
};

export const TokenIcon = ({ symbol, image, size = 24, className = "" }: TokenIconProps) => {
  const [imgError, setImgError] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // SOL icon URLs with fallbacks
  const SOL_ICONS = [
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    "https://cryptologos.cc/logos/solana-sol-logo.png",
  ];

  // Determine which icon to use
  const getIconUrl = () => {
    if (image) return image;
    if (symbol === "SOL" && SOL_ICONS[currentIconIndex]) {
      return SOL_ICONS[currentIconIndex];
    }
    return "/logo.png";
  };

  const handleImageError = () => {
    // Try next fallback for SOL
    if (symbol === "SOL" && currentIconIndex < SOL_ICONS.length - 1) {
      setCurrentIconIndex(currentIconIndex + 1);
      setImgError(false);
    } else {
      setImgError(true);
    }
  };

  const iconUrl = getIconUrl();

  return (
    <div
      className={`relative shrink-0 rounded-full border border-gray-700 bg-gray-800 overflow-hidden ${className}`}
      style={{
        width: size + 2,
        height: size + 2,
      }}
    >
      {!imgError ? (
        <img
          src={iconUrl}
          alt={symbol || "Token"}
          width={size}
          height={size}
          className="absolute inset-0 rounded-full object-cover"
          style={{
            width: size,
            height: size,
          }}
          onError={handleImageError}
        />
      ) : (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold"
          style={{
            width: size,
            height: size,
          }}
        >
          {symbol?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
};
