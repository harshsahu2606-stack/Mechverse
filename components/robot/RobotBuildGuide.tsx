"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, AlertTriangle, Clock, Wrench, Shield, Check, RotateCcw } from "lucide-react";
import { ROBOT_BUILD_STAGES } from "@/data/walkingRobotData";

export default function RobotBuildGuide() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("walking_robot_build_progress");
      if (saved) setCompletedStages(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load build progress", e);
    }
  }, []);

  const toggleStageCompleted = (stageNum: number) => {
    const updated = completedStages.includes(stageNum)
      ? completedStages.filter((s) => s !== stageNum)
      : [...completedStages, stageNum];
    setCompletedStages(updated);
    try {
      localStorage.setItem("walking_robot_build_progress", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save build progress", e);
    }
  };

  const currentStage = ROBOT_BUILD_STAGES[activeStageIndex];
  const progressPercent = Math.round((completedStages.length / ROBOT_BUILD_STAGES.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Header with Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              REAL-LIFE WORKSHOP
            </span>
            <span className="text-xs text-gray-400">• 10 Step-by-Step Stages</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Build the Walking Robot in Real Life
          </h2>
          <p className="text-xs text-gray-400">
            A comprehensive, beginner-friendly manual to construct the exact robot simulated in 3D.
          </p>
        </div>

        {/* Progress Tracker Pill */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-3 min-w-[200px] space-y-1.5 self-start sm:self-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Workshop Progress</span>
            <span className="font-mono text-orange-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 block text-right">
            {completedStages.length} of {ROBOT_BUILD_STAGES.length} Stages Completed
          </span>
        </div>
      </div>

      {/* Main Two-Column Workshop Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left: Stage Selector List */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-2 py-1 block">
            Construction Stages
          </span>
          <div className="space-y-1">
            {ROBOT_BUILD_STAGES.map((stg, idx) => {
              const isSelected = activeStageIndex === idx;
              const isDone = completedStages.includes(stg.stage);
              return (
                <button
                  key={stg.stage}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-left transition ${
                    isSelected
                      ? "bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20"
                      : "bg-white/[0.02] hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStageCompleted(stg.stage);
                      }}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border shrink-0 transition ${
                        isDone
                          ? isSelected
                            ? "bg-white text-orange-600 border-white"
                            : "bg-green-500 text-black border-green-400"
                          : "border-gray-500 text-gray-400"
                      }`}
                      title={isDone ? "Mark as uncompleted" : "Mark as completed"}
                    >
                      {isDone ? <Check size={10} strokeWidth={3} /> : stg.stage}
                    </span>
                    <span className="truncate">{stg.title.split(": ")[1]}</span>
                  </div>
                  <ChevronRight size={13} className={isSelected ? "text-white" : "text-gray-500"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Stage Content Panel */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
          {/* Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-orange-400">
                  STAGE {currentStage.stage} OF 10
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {currentStage.estimatedTime}
                </span>
                <span className="text-xs text-gray-400">• {currentStage.difficulty}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                {currentStage.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{currentStage.subtitle}</p>
            </div>

            <button
              onClick={() => toggleStageCompleted(currentStage.stage)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
                completedStages.includes(currentStage.stage)
                  ? "bg-green-600 border-green-500 text-white shadow-md shadow-green-600/20"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
              }`}
            >
              <CheckCircle2 size={15} />
              <span>
                {completedStages.includes(currentStage.stage)
                  ? "Stage Completed"
                  : "Mark as Done"}
              </span>
            </button>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200">
            {currentStage.summary}
          </div>

          {/* Core Principles & Step-by-Step Instructions */}
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider block">
              Instructions & Design Principles
            </span>
            <div className="space-y-3">
              {currentStage.principles.map((pr, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <h4 className="text-sm font-bold text-white">{pr.heading}</h4>
                  <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed">
                    {pr.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Checks & Common Pitfalls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Checks */}
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
              <span className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Quality Verification Checks
              </span>
              <ul className="space-y-1 text-xs text-gray-300">
                {currentStage.checks.map((chk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pitfalls */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Common Mistakes to Avoid
              </span>
              <ul className="space-y-1 text-xs text-gray-300">
                {currentStage.mistakes.map((mst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>{mst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation to Next Stage */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveStageIndex((idx) => Math.max(0, idx - 1))}
              disabled={activeStageIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Previous Stage
            </button>

            <button
              onClick={() => setActiveStageIndex((idx) => Math.min(ROBOT_BUILD_STAGES.length - 1, idx + 1))}
              disabled={activeStageIndex === ROBOT_BUILD_STAGES.length - 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next Stage →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
