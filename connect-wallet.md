# Connect Wallet Component Documentation

This document outlines the files and dependencies required for the Connect Wallet button and modal functionality.

## Related Files

### Core Components

1. **`components/NewDesigns/connect-wallet.tsx`**
   - Main component containing the Connect Wallet button
   - Handles wallet detection using Solana Wallet Adapter
   - Manages modal state and wallet selection
   - Displays wallets in three sections: Installed, Popular, and More

2. **`components/ui/connect-wallet-modal.tsx`**
   - Modal component that displays the wallet selection interface
   - Handles portal rendering, backdrop, and animations
   - Manages body scroll locking when modal is open

3. **`components/providers/WalletProvider.tsx`**
   - Provides wallet context to the entire application
   - Configures wallet adapters (Phantom, Solflare, Avana, Alpha, Coinbase)
   - Sets up ConnectionProvider and WalletProvider from Solana Wallet Adapter


## Dependencies

### Required NPM Packages

#### Solana Wallet Adapter Core
- `@solana/wallet-adapter-react` - React hooks and providers for wallet management
- `@solana/wallet-adapter-base` - Base types and interfaces for wallet adapters
- `@solana/wallet-adapter-react-ui` - UI components and styles for wallet adapter

#### Wallet Adapter Implementations
- `@solana/wallet-adapter-phantom` - Phantom wallet adapter
- `@solana/wallet-adapter-solflare` - Solflare wallet adapter
- `@solana/wallet-adapter-avana` - Avana wallet adapter
- `@solana/wallet-adapter-alpha` - Alpha wallet adapter
- `@solana/wallet-adapter-coinbase` - Coinbase wallet adapter

#### UI Dependencies
- `lucide-react` - Icon library (used for close button icon)
- `react` - React library
- `react-dom` - React DOM library (used for portal rendering)

### Peer Dependencies
- `@solana/web3.js` - Solana Web3 library (required by wallet adapters)

## File Structure

```
components/
├── NewDesigns/
│   └── connect-wallet.tsx       # Main Connect Wallet component
├── providers/
│   └── WalletProvider.tsx       # Wallet context provider
└── ui/
    └── connect-wallet-modal.tsx # Modal component


## How It Works

1. **WalletProvider** wraps the app in `layout.tsx`, providing wallet context
2. **Connect Wallet Button** in `connect-wallet.tsx` opens the modal
3. **Modal** displays available wallets from the wallet adapter
4. **Wallet Detection** uses `WalletReadyState.Installed` to detect installed wallets
5. **Wallet Selection** calls `select()` from `useWallet()` hook to connect the chosen wallet

