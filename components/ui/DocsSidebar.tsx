"use client";

interface DocsSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export default function DocsSidebar({ activeItem, onItemClick }: DocsSidebarProps) {
  const menuItems = [
    { title: "Getting Started", type: "section" },
    { title: "Introduction", type: "item", id: "introduction" },
    { title: "Installation", type: "item", id: "installation" },
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

  return (
    <div className="fixed left-0 top-0 w-64 min-w-[256px] h-screen flex flex-col bg-[#F7F7F2] z-20">
      {/* Sidebar Icon at Top */}
      <div className="h-14 flex items-center px-6 flex-shrink-0">
        <div className="w-8 h-8 bg-gray-800 rounded-md"></div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="mt-40 flex">
          {/* Decorative Lines Section */}
          <div className="flex flex-col gap-2 px-6 mt-[12px]">
            {Array.from({ length: 80 }).map((_, index) => (
              <div key={index} className="w-10 h-[1px] bg-gray-400"></div>
            ))}
          </div>

          {/* Menu Items Section */}
          <div className="flex-1 pr-6">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.type === "section" ? (
                  <div className="py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {item.title}
                  </div>
                ) : (
                  <button
                    onClick={() => onItemClick(item.id!)}
                    className={`w-full text-left py-1.5 text-sm transition-colors ${
                      activeItem === item.id
                        ? "font-semibold text-black"
                        : "text-gray-700"
                    }`}
                  >
                    {item.title}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

