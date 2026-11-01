"use client";

import { useState, useEffect } from "react";
import { Calculator, CheckCircle2, RotateCcw, TrendingDown, IndianRupee, Layers } from "lucide-react";
import { BOMItem } from "@/types/machine";
import { DEFAULT_BOM_ITEMS } from "@/data/walkingRobotData";

export default function RobotBOM() {
  const [bomItems, setBomItems] = useState<BOMItem[]>(DEFAULT_BOM_ITEMS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("walking_robot_bom_data");
      if (saved) setBomItems(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load BOM from localStorage", e);
    }
  }, []);

  const saveBOM = (updated: BOMItem[]) => {
    setBomItems(updated);
    try {
      localStorage.setItem("walking_robot_bom_data", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save BOM to localStorage", e);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = bomItems.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    saveBOM(updated);
  };

  const updateActualPrice = (id: string, price: number) => {
    const updated = bomItems.map((item) =>
      item.id === id ? { ...item, actualPriceINR: Math.max(0, price) } : item
    );
    saveBOM(updated);
  };

  const toggleCollected = (id: string) => {
    const updated = bomItems.map((item) =>
      item.id === id ? { ...item, collected: !item.collected } : item
    );
    saveBOM(updated);
  };

  const resetBOM = () => {
    saveBOM(DEFAULT_BOM_ITEMS);
  };

  // Calculations
  const totalEstimatedCost = bomItems.reduce(
    (sum, item) => sum + (item.estimatedPriceINR / item.defaultQty) * item.qty,
    0
  );
  const totalActualCost = bomItems.reduce(
    (sum, item) => sum + (item.actualPriceINR || 0),
    0
  );
  const savings = Math.max(0, totalEstimatedCost - totalActualCost);
  const collectedCount = bomItems.filter((i) => i.collected).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
            Cost &amp; Material Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Interactive Bill of Materials (BOM)
          </h2>
          <p className="text-xs text-gray-400">
            Track components, enter actual purchase receipts, and compare your budget against estimated costs.
          </p>
        </div>

        <button
          onClick={resetBOM}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition self-start sm:self-auto"
        >
          <RotateCcw size={13} />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-gray-400 block">
            Estimated Budget
          </span>
          <div className="text-2xl font-black text-white flex items-center">
            <span>₹{Math.round(totalEstimatedCost)}</span>
          </div>
          <span className="text-[10px] text-gray-500">Retail price baseline</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-gray-400 block">
            Actual Spent
          </span>
          <div className="text-2xl font-black text-orange-400 flex items-center">
            <span>₹{Math.round(totalActualCost)}</span>
          </div>
          <span className="text-[10px] text-gray-500">Sum of entered receipts</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-gray-400 block">
            Money Saved
          </span>
          <div className="text-2xl font-black text-green-400 flex items-center">
            <span>₹{Math.round(savings)}</span>
          </div>
          <span className="text-[10px] text-green-500/80">From reuse &amp; scraps</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-gray-400 block">
            Inventory Collected
          </span>
          <div className="text-2xl font-black text-sky-400">
            {collectedCount} / {bomItems.length}
          </div>
          <span className="text-[10px] text-gray-500">Ready in your toolbox</span>
        </div>
      </div>

      {/* Dynamic BOM Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-4 sm:p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3">Est. Cost</th>
                <th className="py-2.5 px-3">Actual Cost (₹)</th>
                <th className="py-2.5 px-3">Source Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bomItems.map((item) => {
                const itemEstTotal = Math.round(
                  (item.estimatedPriceINR / item.defaultQty) * item.qty
                );
                return (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-white/[0.02] ${
                      item.collected ? "bg-green-500/[0.02]" : ""
                    }`}
                  >
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleCollected(item.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          item.collected
                            ? "bg-green-500 border-green-400 text-black font-bold"
                            : "border-white/20 text-transparent hover:border-white/50"
                        }`}
                        title={item.collected ? "Collected" : "Mark as collected"}
                      >
                        ✔
                      </button>
                    </td>

                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{item.name}</div>
                      <span className="text-[10px] text-gray-500">{item.notes}</span>
                    </td>

                    <td className="py-3 px-3 text-gray-400 font-mono text-[10px]">
                      {item.category}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5 bg-black/40 border border-white/10 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white px-1">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-300">
                      ₹{itemEstTotal}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={item.actualPriceINR}
                          onChange={(e) =>
                            updateActualPrice(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-20 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          item.sourceType.includes("Scrap")
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : item.sourceType.includes("DIY")
                            ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
                            : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      >
                        {item.sourceType}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
