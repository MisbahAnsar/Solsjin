## Wallet Dropdown

- **`components/NewDesigns/wallet-dropdown.tsx`**
  - Main wallet dropdown component that expands from a profile picture
  - Shows wallet address with copy functionality
  - Displays SOL balance with token icon
  - Uses GSAP for smooth morphing animations

- **`components/sol/token-icon.tsx`**
  - Renders token icons with multiple fallback URLs
  - Handles SOL icon specifically with gradient placeholder fallback
  - Supports custom size and styling

- **`components/providers/WalletProvider.tsx`**
  - Wraps the app with Solana wallet adapter
  - Configured to use devnet endpoint
  - Provides wallet connection context

- **`components/ui/DocsContent.tsx`**
  - Routes between different components based on sidebar selection
  - Conditionally renders WalletDropdown or ConnectWallet





navbar: when profile clicked, the current design will make the navbar height increase and decrese, so for that use a pop up way for showing the balance etc etc!