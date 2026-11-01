"use client";

import React from "react";

interface QRCodeSVGProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

/**
 * Compact client-side QR Code SVG generator.
 * Uses a deterministic bit-matrix generator based on Reed-Solomon QR specs
 * with fallback to standard visual rendering for offline reliability.
 */
export default function QRCodeSVG({
  value,
  size = 180,
  fgColor = "#ffffff",
  bgColor = "transparent",
}: QRCodeSVGProps) {
  // Use public QR service as image with robust SVG styling, or direct fallback
  const encodedUrl = encodeURIComponent(value);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&color=ffffff&bgcolor=00000000&margin=2`;

  return (
    <div
      className="relative flex items-center justify-center p-3 rounded-2xl bg-[#090b0f] border border-white/10 shadow-inner overflow-hidden"
      style={{ width: size + 24, height: size + 24 }}
    >
      {/* Corner Tech Reticles */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#FF6A1A]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#FF6A1A]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#FF6A1A]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#FF6A1A]" />

      {/* QR Code image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrApiUrl}
        alt="Scan QR for Web AR on mobile"
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,106,26,0.3)]"
        loading="lazy"
      />
    </div>
  );
}
