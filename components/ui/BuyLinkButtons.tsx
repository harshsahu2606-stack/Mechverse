"use client";

import React from "react";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { generateBuyLinks } from "@/lib/sourcing/buyLinks";

interface BuyLinkButtonsProps {
  componentName: string;
  officialUrl?: string;
  vendorName?: string;
  compact?: boolean;
}

export default function BuyLinkButtons({
  componentName,
  officialUrl,
  vendorName,
  compact = false,
}: BuyLinkButtonsProps) {
  const links = generateBuyLinks(componentName, officialUrl, vendorName);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Amazon India */}
        <a
          href={links.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Search & Buy ${componentName} on Amazon.in`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#232F3E]/80 hover:bg-[#FF9900] text-[#FF9900] hover:text-black border border-[#FF9900]/40 text-[10px] font-mono font-semibold transition"
        >
          <span>Amazon</span>
          <ExternalLink size={9} />
        </a>

        {/* Flipkart */}
        <a
          href={links.flipkartUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Search & Buy ${componentName} on Flipkart`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2874F0]/20 hover:bg-[#2874F0] text-[#2874F0] hover:text-white border border-[#2874F0]/40 text-[10px] font-mono font-semibold transition"
        >
          <span>Flipkart</span>
          <ExternalLink size={9} />
        </a>

        {/* Official Indian Store */}
        {links.officialUrl && (
          <a
            href={links.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Buy direct from ${links.officialVendor}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-mono font-semibold transition"
          >
            <span>{links.officialVendor}</span>
            <ExternalLink size={9} />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Amazon India */}
      <a
        href={links.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#232F3E] hover:bg-[#FF9900] text-[#FF9900] hover:text-black border border-[#FF9900]/40 text-xs font-mono font-bold transition shadow-sm"
      >
        <span>Amazon.in</span>
        <ExternalLink size={11} />
      </a>

      {/* Flipkart */}
      <a
        href={links.flipkartUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2874F0]/20 hover:bg-[#2874F0] text-[#60a5fa] hover:text-white border border-[#2874F0]/40 text-xs font-mono font-bold transition shadow-sm"
      >
        <span>Flipkart</span>
        <ExternalLink size={11} />
      </a>

      {/* Official Indian Vendor (Robu.in / ElectronicsComp) */}
      {links.officialUrl && (
        <a
          href={links.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-mono font-bold transition shadow-sm"
        >
          <span>{links.officialVendor}</span>
          <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}
