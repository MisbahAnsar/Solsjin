"use client";

import ConnectWallet from "@/components/NewDesigns/connect-wallet";

interface DocsContentProps {
  activeItem: string;
}

const contentData: Record<string, { title: string; description: string; component?: React.ReactNode }> = {
  "introduction": {
    title: "Introduction",
    description: "Welcome to Solsjin UI - A comprehensive component library for Solana applications. This library provides a set of reusable, accessible, and customizable components to help you build beautiful Solana dApps quickly and efficiently.",
    component: null,
  },
  "installation": {
    title: "Installation",
    description: "Get started with Solsjin UI by installing the package. You can install it via npm or yarn. Make sure you have Node.js and a package manager installed before proceeding.",
    component: null,
  },
  "connect-wallet": {
    title: "Connect Wallet",
    description: "The Connect Wallet Dialog component is a dialog window that allows users to connect their wallet via Solana Wallet Adapter.",
    component: <ConnectWallet />,
  },
  "wallet-dropdown": {
    title: "Wallet Dropdown",
    description: "The Wallet Dropdown component displays a menu with wallet options and actions. It provides easy access to wallet-related functionality in your application.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="bg-white rounded-lg p-4 min-w-[200px]">
          <div className="text-sm font-semibold mb-2">Wallet Options</div>
          <div className="space-y-2">
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Phantom</div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Solflare</div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Disconnect</div>
          </div>
        </div>
      </div>
    ),
  },
  "token-list": {
    title: "Token List",
    description: "The Token List component displays a list of tokens with their details. It's perfect for showing token balances, prices, and other token-related information.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="bg-white rounded-lg p-4 min-w-[300px] space-y-2">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="font-medium">SOL</span>
            </div>
            <span className="text-sm">1,234.56</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
              <span className="font-medium">USDC</span>
            </div>
            <span className="text-sm">5,000.00</span>
          </div>
        </div>
      </div>
    ),
  },
  "token-card": {
    title: "Token Card",
    description: "The Token Card component displays individual token information in a card format. It shows token icon, name, balance, and price information in a compact design.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="bg-white rounded-lg p-6 min-w-[250px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
            <div>
              <div className="font-bold">SOL</div>
              <div className="text-sm text-gray-500">Solana</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">1,234.56</div>
            <div className="text-sm text-gray-500">$123.45 USD</div>
          </div>
        </div>
      </div>
    ),
  },
  "token-icon": {
    title: "Token Icon",
    description: "The Token Icon component displays a token's icon or logo. It provides a consistent way to show token images throughout your application.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
          <div className="w-16 h-16 bg-purple-500 rounded-full"></div>
          <div className="w-16 h-16 bg-green-500 rounded-full"></div>
        </div>
      </div>
    ),
  },
  "avatar": {
    title: "Avatar",
    description: "The Avatar component displays user profile pictures or initials. It's a versatile component that can be used throughout your application to show user identity.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            JD
          </div>
        </div>
      </div>
    ),
  },
  "swap": {
    title: "Swap",
    description: "The Swap component provides a user interface for token swapping functionality. It allows users to exchange one token for another with a clean and intuitive design.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="bg-white rounded-lg p-6 min-w-[350px] space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">From</div>
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <span className="font-medium">1,000 SOL</span>
              <button className="px-3 py-1 bg-gray-200 rounded">SOL</button>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              ⇅
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">To</div>
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <span className="font-medium">~125,450 USDC</span>
              <button className="px-3 py-1 bg-gray-200 rounded">USDC</button>
            </div>
          </div>
          <button className="w-full bg-[#C4F582] text-black py-3 rounded-lg font-medium hover:bg-[#b5e673] transition-colors">
            Swap
          </button>
        </div>
      </div>
    ),
  },
  "price-change": {
    title: "Price Change",
    description: "The Price Change component displays price changes with visual indicators. It shows whether a price has increased or decreased with appropriate colors and icons.",
    component: (
      <div className="bg-gray-800 rounded-lg p-12 flex items-center justify-center my-8">
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">+5.23%</div>
            <div className="text-sm text-gray-400 mt-1">Price Up</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">-2.45%</div>
            <div className="text-sm text-gray-400 mt-1">Price Down</div>
          </div>
        </div>
      </div>
    ),
  },
};

export default function DocsContent({ activeItem }: DocsContentProps) {
  const content = contentData[activeItem] || contentData["introduction"];

  return (
    <div className="flex-1 overflow-y-auto px-12 py-8 relative">
      {/* Action Icons - Fixed to Top Right */}
      <div className="fixed top-8 right-8 flex flex-col gap-2 z-30">
        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
          <span className="text-xs">&lt;/&gt;</span>
        </button>
        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </button>
        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
          <span className="text-xs font-bold">×</span>
        </button>
      </div>

      {/* Header */}
      <h1 className="text-4xl font-bold mb-4 uppercase">{content.title}</h1>
      
      {/* Description */}
      <p className="text-gray-700 mb-8 leading-relaxed">
        {content.description}
      </p>
      
      {/* Component Example/Preview */}
      {content.component && content.component}
    </div>
  );
}

