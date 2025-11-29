"use client";

import { useState } from "react";
import DocsSidebar from "@/components/ui/DocsSidebar";
import DocsContent from "@/components/ui/DocsContent";
import { Book } from "lucide-react";

export default function Docs() {
  const [activeItem, setActiveItem] = useState("connect-wallet");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-zinc-900 min-h-screen w-full">
      {/* Sidebar - Fixed to left */}
      <DocsSidebar 
        activeItem={activeItem} 
        onItemClick={setActiveItem}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Toggle Button - Always visible, fixed position */}
      <div className="fixed left-0 top-0 h-14 flex items-center px-6 z-30">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity rounded-md mt-8"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Book size={24} className="text-zinc-300" />
        </button>
      </div>
      
      {/* Main Content - Fixed position, doesn't shift */}
      <div className="min-h-screen ml-80">
        <div className="flex justify-center h-screen max-w-7xl mx-auto p-3">
          <div className="flex w-full h-full bg-[#FFF6F3] rounded-3xl overflow-hidden relative p-2">
            {/* Main Content */}
            <div className="flex-1 h-full flex items-center justify-center relative rounded-2xl">
              <DocsContent activeItem={activeItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
