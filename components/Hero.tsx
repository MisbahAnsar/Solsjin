import { Github, Copy } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mt-28">
      <h1 
        className="font-extrabold leading-[0.8]" 
        style={{ 
          fontFamily: 'Thunder, sans-serif',
          fontSize: 'clamp(80px, 12vw, 180px)'
        }}
      >
        SOLSJIN-UI
      </h1>
      <p 
        className="tracking-wider font-medium text-black text-center max-w-2xl"
        style={{
          fontSize: 'clamp(16px, 1.5vw, 20px)'
        }}
      >
        A modern, animated, and developer-first UI library to shape 
        <br /> the future of Solana.
      </p>
      <button 
        className="mt-6 px-6 py-3 rounded-[30px] flex items-center gap-2 text-white font-medium transition-all hover:opacity-90 tracking-wide"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.73), rgba(102, 102, 102, 1))',
          border: '0.8px solid rgba(0, 0, 0, 1)',
          boxShadow: 'inset 0 0 0 1.1px rgba(0, 0, 0, 1)',
          fontSize: 'clamp(14px, 1.2vw, 16px)'
        }}
      >
        Star us on <Github size={24} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-4 mt-16">
        <button 
          className="px-6 py-4 rounded-[20px] flex items-center gap-2 text-black font-medium transition-all hover:opacity-80"
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            fontSize: 'clamp(14px, 1.2vw, 18px)',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          npx shadcn add @solsjin-ui/solwallet
          <Copy size={20} strokeWidth={2} style={{ color: 'rgba(30, 30, 30, 0.5)' }} />
        </button>

        <button 
          className="px-6 py-4 rounded-[20px] text-white font-medium transition-all hover:opacity-90"
          style={{
            background: '#0073FF',
            fontSize: 'clamp(14px, 1.2vw, 18px)'
          }}
        >
          View Docs
        </button>
      </div>
    </div>
  );
}
