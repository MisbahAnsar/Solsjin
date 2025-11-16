interface NavbarProps {
  variant?: 'default' | 'docs';
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const maxWidth = variant === 'docs' ? 'max-w-7xl' : 'max-w-3xl';
  const bgColor = variant === 'docs' ? '' : 'bg-black/[0.08]';
  const rounded = variant === 'docs' ? '' : 'rounded-[20px]';

  return (
    <div className="w-full flex justify-center pt-6">
      <nav className={`${maxWidth} w-full ${bgColor} ${rounded} px-4 py-1.5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-md">
            {/* Logo placeholder - replace with your logo image */}
          </div>
          <div 
            className="font-semibold"
            style={{
              fontSize: 'clamp(16px, 1.2vw, 18px)'
            }}
          >
            SOLSJIN-UI
          </div>
        </div>
        <button 
          className="bg-black text-white px-5 py-2.5 rounded-[17px] hover:bg-black/90 transition-colors font-medium"
          style={{
            fontSize: 'clamp(14px, 1vw, 16px)'
          }}
        >
          Connect Wallet
        </button>
      </nav>
    </div>
  );
}
