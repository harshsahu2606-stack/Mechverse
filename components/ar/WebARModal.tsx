"use client";

import React, { useState, useEffect } from "react";
import { X, QrCode, Camera, Smartphone, ExternalLink, Copy, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { CustomizationSettings, MachineId } from "@/types/machine";
import WebARViewer from "./WebARViewer";
import QRCodeSVG from "./QRCodeSVG";

interface WebARModalProps {
  isOpen: boolean;
  machineId: MachineId;
  customization?: CustomizationSettings;
  onClose: () => void;
  onSelectMachine: (id: MachineId) => void;
}

export default function WebARModal({
  isOpen,
  machineId,
  customization,
  onClose,
  onSelectMachine,
}: WebARModalProps) {
  const [modalMode, setModalMode] = useState<"camera" | "qr">("camera");
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/?ar=${machineId}`;
      setCurrentUrl(url);
    }
  }, [machineId]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard && currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  // Model GLB paths if native Scene Viewer is triggered
  const glbPath =
    machineId === "sports-car"
      ? "/models/car.glb"
      : machineId === "electric-fan"
      ? "/models/engine.glb"
      : "/models/car.glb";

  // Native Android Google Scene Viewer intent link
  const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.origin + glbPath : glbPath
  )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* If Camera AR Mode is chosen */}
      {modalMode === "camera" ? (
        <div className="relative w-full h-full flex flex-col">
          <WebARViewer
            machineId={machineId}
            customization={customization || ({} as CustomizationSettings)}
            onClose={onClose}
            onSelectMachine={onSelectMachine}
          />
        </div>
      ) : (
        /* Mobile QR Code & Native AR Modal Panel */
        <div className="relative w-full max-w-xl mx-3 sm:mx-4 bg-[#0F1114] border border-white/15 rounded-3xl p-4 sm:p-8 shadow-2xl text-center space-y-4 sm:space-y-6 max-h-[92vh] overflow-y-auto">
          {/* Top Row with Close Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6A1A] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-white uppercase font-bold">
                Mobile Web AR Connect
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <QRCodeSVG value={currentUrl} size={180} />
            <p className="text-xs font-mono text-[#9AA0A9] max-w-xs mt-2">
              Scan with your iPhone or Android camera to immediately place this machine in your room in real-world scale.
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="space-y-2.5 pt-2">
            {/* Launch Native Android Scene Viewer directly if on Android */}
            <a
              href={sceneViewerUrl}
              className="w-full py-3 rounded-2xl bg-[#FF6A1A] hover:bg-[#ff7d36] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A1A]/30 transition-all cursor-pointer"
            >
              <Smartphone size={15} />
              <span>Launch Google Scene Viewer (Android)</span>
            </a>

            {/* Launch Browser Camera AR */}
            <button
              onClick={() => setModalMode("camera")}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
            >
              <Camera size={15} className="text-[#FF6A1A]" />
              <span>Use Web Camera Here</span>
            </button>

            {/* Copy Share Link */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-mono text-white/80 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition"
              >
                {copiedUrl ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedUrl ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
