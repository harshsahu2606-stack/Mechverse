"use client";

import { useState } from "react";
import { Camera, Maximize, Minimize, Move, RotateCcw, Video } from "lucide-react";
import { CameraPreset } from "../3d/SceneViewer";

interface BottomToolbarProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  onResetCamera: () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

export default function BottomToolbar({
  currentPreset,
  onSelectPreset,
  onResetCamera,
  viewportRef,
}: BottomToolbarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!viewportRef.current) return;

    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      {/* Interaction Hint (matching screenshot: DRAG TO ROTATE · SCROLL TO ZOOM) */}
      <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono tracking-wider text-gray-400 bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
        <Move size={12} className="text-gray-400" />
        <span>DRAG TO ROTATE · SCROLL TO ZOOM · SHIFT+DRAG TO PAN</span>
      </div>

      {/* Camera Presets Toolbar */}
      <div className="flex items-center gap-1.5 bg-black/70 border border-white/15 p-1 rounded-2xl backdrop-blur-md shadow-xl pointer-events-auto ml-auto sm:ml-0">
        {[
          { id: "default", label: "Iso" },
          { id: "front", label: "Front" },
          { id: "side", label: "Side" },
          { id: "top", label: "Top" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectPreset(item.id as CameraPreset)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
              currentPreset === item.id
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}

        <div className="w-px h-4 bg-white/15 mx-0.5" />

        {/* Reset Camera button */}
        <button
          onClick={onResetCamera}
          title="Reset Camera Position"
          className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
        >
          <RotateCcw size={14} />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>
      </div>
    </div>
  );
}
