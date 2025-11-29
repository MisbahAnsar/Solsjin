"use client";

import { useState } from "react";
import { Book } from "lucide-react";

interface DocsSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DocsSidebar({ activeItem, onItemClick, isOpen, onToggle }: DocsSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const menuItems = [
    { title: "Getting Started", type: "section" },
    { title: "Introduction", type: "item", id: "introduction" },
    { title: "Installation", type: "item", id: "installation" },
    { title: "", type: "spacer" },
    { title: "Components", type: "section" },
    { title: "Connect Wallet", type: "item", id: "connect-wallet" },
    { title: "Wallet Dropdown", type: "item", id: "wallet-dropdown" },
    { title: "Token List", type: "item", id: "token-list" },
    { title: "Token Card", type: "item", id: "token-card" },
    { title: "Token Icon", type: "item", id: "token-icon" },
    { title: "Avatar", type: "item", id: "avatar" },
    { title: "Swap", type: "item", id: "swap" },
    { title: "Price Change", type: "item", id: "price-change" },
  ];

  const isActive = (id: string | undefined) => activeItem === id;
  const isHovered = (id: string | undefined) => hoveredItem === id;
  const getLineWidth = (id: string | undefined) => {
    if (isActive(id)) return "55px";
    if (isHovered(id)) return "55px";
    return "32px";
  };
  const getLineColor = (id: string | undefined) => {
    if (isActive(id)) return "bg-purple-500";
    if (isHovered(id)) return "bg-purple-500";
    return "bg-zinc-600/20";
  };
  const getTextColor = (id: string | undefined) => {
    if (isActive(id)) return "text-purple-500 opacity-100";
    if (isHovered(id)) return "text-purple-500 opacity-100";
    return "text-zinc-300 opacity-40";
  };

  return (
    <div className={`fixed left-0 top-0 w-80 max-w-sm h-screen flex flex-col bg-zinc-900 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="relative flex h-fit flex-col gap-3 pb-[15vh] pt-[32vh] px-6">
          {menuItems.map((item, index) => {
            if (item.type === "section") {
              return (
                <div key={index} className="group relative flex h-px items-center gap-5 mt-2">
                  <span 
                    className="bg-zinc-300 inline-block h-[1px] transition-all duration-300 ease-out"
                    style={{ width: "32px" }}
                  ></span>
                  <span className="whitespace-nowrap transition-all ease-out opacity-100 text-zinc-300 font-sans text-sm">
                    {item.title}
                  </span>
                </div>
              );
            }
            
            if (item.type === "spacer") {
              return (
                <div key={index} className="flex flex-col gap-2">
                  <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                  <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                  <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                  <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                </div>
              );
            }
            
            const prevItem = index > 0 ? menuItems[index - 1] : null;
            const showSpacers = prevItem && prevItem.type === "item";
            const isFirstItemAfterSection = prevItem && prevItem.type === "section";
            
            return (
              <div key={index} className="flex flex-col gap-2">
                {showSpacers && (
                  <>
                    <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                    <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                  </>
                )}
                {isFirstItemAfterSection && (
                  <>
                    <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                    <span className="bg-zinc-600/80 block h-[1px] w-[32px]"></span>
                  </>
                )}
                <button
                  onClick={() => onItemClick(item.id!)}
                  onMouseEnter={() => setHoveredItem(item.id!)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group relative flex h-px cursor-pointer items-center gap-5 w-full after:absolute after:left-0 after:top-1/2 after:size-full after:-translate-y-1/2 after:p-[14px]"
                >
                  <span 
                    className={`inline-block h-[1px] transition-all duration-300 ease-out ${getLineColor(item.id)}`}
                    style={{ width: getLineWidth(item.id) }}
                  ></span>
                  <span className={`whitespace-nowrap transition-all ease-out font-sans text-sm font-light ${getTextColor(item.id)}`}>
                    {item.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

