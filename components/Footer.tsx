"use client";

import { Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full mt-24 px-6 pb-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto rounded-[30px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative transition-colors duration-500 hover:bg-neutral-50/50"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {/* Left Side: Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2 z-10">
          <h3 
            className="font-extrabold leading-none" 
            style={{ 
              fontFamily: 'Thunder, sans-serif',
              fontSize: 'clamp(32px, 4vw, 48px)'
            }}
          >
            SOLSJIN-UI
          </h3>
          <p className="text-neutral-500 font-medium text-sm tracking-wide">
            Built for the future of Solana
          </p>
        </div>

        {/* Right Side: Socials & Links */}
        <div className="flex items-center gap-6 z-10">
          <div className="hidden md:flex items-center gap-6 mr-4">
            {['Terms', 'Privacy', 'Docs'].map((text) => (
              <a 
                key={text}
                href="#" 
                className="text-sm font-medium text-neutral-600 relative group overflow-hidden"
              >
                {text}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-neutral-900 to-neutral-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </a>
            ))}
          </div>
          <SocialLink href="https://github.com" icon={<Github size={20} strokeWidth={2} />} label="GitHub" />
          <SocialLink href="https://twitter.com" icon={<Twitter size={20} strokeWidth={2} />} label="Twitter" />
        </div>

        {/* Subtle Background Gradient Blob (Optional for "clean modern" look) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl rounded-full -z-0 pointer-events-none" />
      </motion.div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group p-3 rounded-full bg-transparent hover:bg-black/5 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <motion.div
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        whileHover={{ rotate: 3 }}
      >
        {icon}
      </motion.div>
    </motion.a>
  );
}

