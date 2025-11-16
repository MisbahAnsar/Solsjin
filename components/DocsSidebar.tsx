"use client";

export default function DocsSidebar() {
  const menuItems = [
    { title: "Getting Started", type: "section" },
    { title: "Introduction", type: "item" },
    { title: "Installation", type: "item" },
    { title: "Components", type: "section" },
    { title: "Connect Wallet", type: "item", active: true },
    { title: "Wallet Dropdown", type: "item" },
    { title: "Token List", type: "item" },
    { title: "Token Card", type: "item" },
    { title: "Token Icon", type: "item" },
    { title: "Avatar", type: "item" },
    { title: "Swap", type: "item" },
    { title: "Price Change", type: "item" },
  ];

  return (
    <div className="w-64 min-w-[256px] h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search...."
            className="w-full pl-10 pr-16 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-500 font-medium">Ctrl K</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.type === "section" ? (
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {item.title}
              </div>
            ) : (
              <button
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  item.active
                    ? "font-semibold text-black bg-gray-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.title}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

