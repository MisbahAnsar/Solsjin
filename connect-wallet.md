# Connect Wallet Component - Required Files

This document lists all the files needed for the Connect Wallet component to work.

## Required Files

1. **`components/NewDesigns/connect-wallet.tsx`**
   - Main Connect Wallet component
   - Contains the Connect Wallet button and modal logic
   - Handles wallet detection and selection

2. **`components/ui/connect-wallet-modal.tsx`**
   - Modal component for displaying wallet selection interface
   - Handles portal rendering, backdrop, and animations
   - Manages body scroll locking

3. **`components/providers/WalletProvider.tsx`**
   - Wallet context provider for the application
   - Configures all wallet adapters
   - Sets up Solana Wallet Adapter providers

## Additional Dependencies

- `gsap` - Used for modal animations
- `lucide-react` - Used for icons (X icon for close button)
- `@solana/wallet-adapter-*` packages - Solana wallet adapter libraries
