"use client";

import React, { useState } from "react";
import { Calculator, CheckCircle2, ShoppingBag, Plus, Minus, Tag, IndianRupee, Layers } from "lucide-react";
import { ROPEWAY_BOM_ITEMS } from "@/data/ropewayRobotData";
import { BOMItem } from "@/types/machine";

export default function RopewayBOM() {
  const [items, setItems] = useState<BOMItem[]>(ROPEWAY_BOM_ITEMS);

  const toggleCollected = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, collected: !item.collected } : item))
    );
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedPriceINR * item.qty, 0);
  const totalActual = items.reduce((sum, item) => sum + item.actualPriceINR * item.qty, 0);
  const collectedCount = items.filter((item) => item.collected).length;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title & Budget Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-[11px] uppercase">
            Bill of Materials & Cost Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Component Shopping List & Budget
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Verified Indian market prices (INR ₹) for all motors, pulleys, bearings, cables, and hardware components.
          </p>
        </div>

        {/* Budget Cards */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#111318] p-3 rounded-2xl border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Estimated</span>
            <span className="text-sm font-bold text-gray-300 font-mono">₹{totalEstimated}</span>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/10 p-3 rounded-2xl border border-emerald-500/30 text-right">
            <span className="text-[10px] text-emerald-400 uppercase font-mono block">Actual Budget</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">₹{totalActual}</span>
          </div>
        </div>
      </div>

      {/* Progress Pill */}
      <div className="bg-[#111318] p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400">
          Parts Acquired: <strong className="text-emerald-400">{collectedCount}</strong> / {items.length}
        </span>
        <span className="text-teal-400 font-bold">
          {Math.round((collectedCount / items.length) * 100)}% Complete
        </span>
      </div>

      {/* Itemized Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f14] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-[10px] text-gray-400">
              <tr>
                <th className="p-3.5 pl-4">Status</th>
                <th className="p-3.5">Component & Specification</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-right pr-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`transition hover:bg-white/5 ${
                    item.collected ? "bg-emerald-950/10 text-gray-300" : "text-gray-200"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-3.5 pl-4">
                    <button
                      onClick={() => toggleCollected(item.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition border ${
                        item.collected
                          ? "bg-emerald-500 border-emerald-400 text-white shadow-sm"
                          : "border-gray-600 bg-white/5 text-transparent hover:border-gray-400"
                      }`}
                    >
                      <CheckCircle2 size={13} className={item.collected ? "opacity-100" : "opacity-0"} />
                    </button>
                  </td>

                  {/* Name & Notes */}
                  <td className="p-3.5 max-w-xs">
                    <div className="font-bold text-white text-xs">{item.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 truncate">{item.notes}</div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono text-gray-400">
                      {item.category}
                    </span>
                  </td>

                  {/* Quantity Controls */}
                  <td className="p-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10 font-mono">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </td>

                  {/* Unit Price */}
                  <td className="p-3.5 text-right font-mono text-gray-400">
                    ₹{item.actualPriceINR}
                  </td>

                  {/* Total Price */}
                  <td className="p-3.5 text-right pr-4 font-mono font-bold text-emerald-400">
                    ₹{item.actualPriceINR * item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
