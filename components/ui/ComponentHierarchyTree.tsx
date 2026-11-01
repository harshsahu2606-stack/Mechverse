"use client";

import { useState } from "react";
import { MachineComponentInfo, AppTheme } from "@/types/machine";
import { Box, ChevronDown, ChevronRight, Eye, EyeOff, Search, Layers } from "lucide-react";

interface ComponentHierarchyTreeProps {
  machineName: string;
  components: MachineComponentInfo[];
  selectedComponentId: string | null;
  hiddenComponents: string[];
  onSelectComponent: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  theme?: AppTheme;
}

export default function ComponentHierarchyTree({
  machineName,
  components,
  selectedComponentId,
  hiddenComponents,
  onSelectComponent,
  onToggleVisibility,
  theme = "dark",
}: ComponentHierarchyTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const isLight = theme === "light";

  // Group components by category
  const categories = components.reduce((acc, comp) => {
    const cat = comp.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(comp);
    return acc;
  }, {} as Record<string, MachineComponentInfo[]>);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredComponents = components.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`w-full lg:w-72 rounded-2xl p-4 flex flex-col gap-3 shadow-xl backdrop-blur-md max-h-[650px] overflow-hidden border transition-colors ${
        isLight
          ? "bg-white/95 border-gray-200 text-gray-800 shadow-gray-200/70"
          : "bg-[#111318]/95 border-white/10 text-white shadow-2xl"
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Layers size={16} className={isLight ? "text-sky-600" : "text-sky-400"} />
          <h3 className={`text-sm font-bold tracking-wide ${isLight ? "text-gray-900" : "text-white"}`}>
            Component Hierarchy
          </h3>
        </div>
        <p className={`text-[11px] mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
          {machineName}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={13}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? "text-gray-400" : "text-gray-500"
          }`}
        />
        <input
          type="text"
          placeholder="Filter components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs transition focus:outline-none ${
            isLight
              ? "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-sky-500"
              : "bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-sky-500/50"
          }`}
        />
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar text-xs">
        {searchQuery ? (
          /* Filtered search results */
          <div className="space-y-1">
            {filteredComponents.length === 0 ? (
              <p className={`text-xs py-4 text-center ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                No matching parts found
              </p>
            ) : (
              filteredComponents.map((comp) => {
                const isSelected = selectedComponentId === comp.id;
                const isHidden = hiddenComponents.includes(comp.id);
                return (
                  <div
                    key={comp.id}
                    onClick={() => onSelectComponent(comp.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                      isSelected
                        ? "bg-sky-500 text-white font-semibold shadow-md"
                        : isLight
                        ? "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        : "bg-white/5 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    <span className="truncate">{comp.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(comp.id);
                      }}
                      className={`p-1 ${isLight ? "text-gray-400 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                    >
                      {isHidden ? <EyeOff size={13} className="text-red-500" /> : <Eye size={13} />}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Category accordion tree */
          Object.entries(categories).map(([cat, comps]) => {
            const isCollapsed = collapsedCategories[cat];
            return (
              <div key={cat} className="space-y-1">
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider py-1 px-1 transition ${
                    isLight
                      ? "text-gray-500 hover:text-gray-900"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-1 pl-1">
                    {comps.map((comp) => {
                      const isSelected = selectedComponentId === comp.id;
                      const isHidden = hiddenComponents.includes(comp.id);
                      return (
                        <div
                          key={comp.id}
                          onClick={() => onSelectComponent(comp.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition ${
                            isSelected
                              ? "bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20"
                              : isLight
                              ? "bg-gray-50 hover:bg-gray-100 text-gray-700"
                              : "bg-white/[0.03] hover:bg-white/10 text-gray-300"
                          }`}
                        >
                          <span className="truncate">{comp.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleVisibility(comp.id);
                            }}
                            title={isHidden ? "Show component" : "Hide component"}
                            className={`p-1 transition ${
                              isLight ? "text-gray-400 hover:text-gray-900" : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {isHidden ? (
                              <EyeOff size={13} className="text-red-500" />
                            ) : (
                              <Eye size={13} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
