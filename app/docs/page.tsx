"use client";

import { useState } from "react";
import DocsSidebar from "@/components/ui/DocsSidebar";
import DocsContent from "@/components/ui/DocsContent";

export default function Docs() {
  const [activeItem, setActiveItem] = useState("connect-wallet");

  return (
    <div className="bg-[#FFFCF3] min-h-screen w-full">
      {/* Sidebar - Fixed to left */}
      <DocsSidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      {/* Main Content - Offset for fixed sidebar */}
      <div className="ml-64 min-h-screen">
        <div className="flex justify-center h-screen max-w-7xl mx-auto p-6">
          <div className="flex w-full bg-[#FFFCF3] rounded-lg border-2 border-[#8B7355]/40 overflow-hidden shadow-sm relative">
            {/* Main Content */}
            <div className="flex-1 bg-[#FFFCF3] relative">
              <DocsContent activeItem={activeItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
