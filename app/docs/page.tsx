"use client";

import Navbar from "@/components/Navbar";
import DocsSidebar from "@/components/DocsSidebar";

export default function Docs() {
  return (
    <div className="bg-[#FFFCF3] min-h-screen w-full">
      <Navbar variant="docs" />
      
      <div className="flex justify-center h-[calc(100vh-100px)]">
        <div className="flex max-w-5xl w-full">
          {/* Sidebar */}
          <DocsSidebar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-12 py-8">
            {/* Header */}
            <h1 className="text-4xl font-bold mb-4">Connect Wallet</h1>
            
            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              The Connect Wallet Dialog component is a dialog window that allows
              users to connect their wallet via{" "}
              <span className="underline">Solana Wallet Adapter</span>.
            </p>
            
            {/* Two Gray Buttons */}
            <div className="flex gap-4 mb-8">
              <div className="w-24 h-10 bg-gray-400 rounded-lg"></div>
              <div className="w-24 h-10 bg-gray-400 rounded-lg"></div>
            </div>
            
            {/* Connect Wallet Button */}
            <button className="bg-[#C4F582] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#b5e673] transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
