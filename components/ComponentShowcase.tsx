"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ComponentItem {
  id: string;
  title: string;
  src: string;
}

const components: ComponentItem[] = [
  {
    id: "1",
    title: "Profile Management",
    src: '/pfp.jpg'
  },
  {
    id: "2",
    title: "Wallpapers & Themes",
    src: '/wall2.jpg'
  },
  {
    id: "3",
    title: "Clean Interface",
    src: '/white.jpg'
  },
  {
    id: "4",
    title: "Mascot & Branding",
    src: '/bun.png'
  },
];

export default function ComponentShowcase() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-extrabold text-center mb-16 leading-[0.8]"
        style={{
          fontFamily: 'Thunder, sans-serif',
          fontSize: 'clamp(40px, 6vw, 80px)',
        }}
      >
        BUILT FOR SPEED
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full auto-rows-[300px]">
        {/* Row 1 */}
        {/* Card 1: Takes 1 grid space */}
        <div className="md:col-span-1 h-full">
          <ShowcaseCard item={components[0]} className="h-full" />
        </div>
        {/* Card 2: Takes remaining 2 grid spaces */}
        <div className="md:col-span-2 h-full">
          <ShowcaseCard item={components[1]} className="h-full" />
        </div>

        {/* Row 2 */}
        {/* Card 3: Takes 2 grid spaces */}
        <div className="md:col-span-2 h-full">
          <ShowcaseCard item={components[2]} className="h-full" />
        </div>
        {/* Card 4: Takes remaining 1 grid space */}
        <div className="md:col-span-1 h-full">
          <ShowcaseCard item={components[3]} className="h-full" />
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ item, className = "" }: { item: ComponentItem; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      className={`group p-3 rounded-[32px] bg-white transition-all duration-300 ${className}`}
      style={{
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Inner Frame - The "Double Border" Effect */}
      <div 
        className="relative w-full h-full rounded-[24px] overflow-hidden bg-neutral-100 border border-neutral-200"
      >
        {/* Image Area - Full Fill */}
        <div className="absolute inset-0 w-full h-full bg-neutral-200 group-hover:scale-105 transition-transform duration-700 ease-out">
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Bottom Overlay for Text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/40 to-transparent z-10">
           <h3 
            className="text-xl font-medium text-white tracking-wide drop-shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            style={{ fontFamily: 'inherit' }}
           >
             {item.title}
           </h3>
        </div>
      </div>
    </motion.div>
  );
}
