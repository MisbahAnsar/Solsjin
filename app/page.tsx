"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ComponentShowcase from "@/components/ComponentShowcase";
import Footer from "@/components/Footer";


export default function Home() {

  return (
    <div className="bg-[#FFFCF3] h-screen w-full">
      <Navbar />
      <Hero />
      <ComponentShowcase />
      <Footer />
    </div>
  );
}
