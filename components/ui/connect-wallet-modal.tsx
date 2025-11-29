"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isMounted || !isOpen) return;

    const ctx = gsap.context(() => {
      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: "power2.out" }
        );
      }

      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, y: 12, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
        );
      }
    });

    return () => ctx.revert();
  }, [isMounted, isOpen]);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div ref={overlayRef} className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-2xl w-full" onClick={(event) => event.stopPropagation()}>
        <div className="pointer-events-none absolute inset-0 bg-black/20 blur-3xl opacity-70" />
        <div
          ref={modalRef}
          className="relative bg-white rounded-3xl max-h-[65vh] overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.3)] border border-black/5"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

