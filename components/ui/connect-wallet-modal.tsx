"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMounted]);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

      <div
        onClick={(event) => event.stopPropagation()}
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[70vh] overflow-hidden shadow-2xl transition-all duration-300 ease-out scale-100"
        style={{
          animation: "modalFade 240ms ease-out",
        }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes modalFade {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}

