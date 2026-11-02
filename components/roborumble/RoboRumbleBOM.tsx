"use client";

import { useState } from "react";
import {
  Calculator,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Coins,
  Layers,
  Sparkles,
} from "lucide-react";
import { BOMItem } from "@/types/machine";
import { ROBO_RUMBLE_BOM_PRESETS } from "@/data/roboRumbleData";
import BuyLinkButtons from "@/components/ui/BuyLinkButtons";

export default function RoboRumbleBOM() {
  const [selectedPreset, setSelectedPreset] = useState<"budget" | "balanced" | "performance">("balanced");
  const [items, setItems] = useState<BOMItem[]>(ROBO_RUMBLE_BOM_PRESETS.balanced);

  // New item write-in modal / state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Structure");
  const [newItemPrice, setNewItemPrice] = useState(100);

  const handleSelectPreset = (preset: "budget" | "balanced" | "performance") => {
    setSelectedPreset(preset);
    setItems(ROBO_RUMBLE_BOM_PRESETS[preset]);
  };

  const handleToggleCollected = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, collected: !item.collected } : item
      )
    );
  };

  const handleQtyChange = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const handlePriceChange = (id: string, price: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, actualPriceINR: Math.max(0, price) } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: BOMItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: newItemPrice,
      actualPriceINR: newItemPrice,
      sourceType: "Hardware Store",
      collected: false,
      notes: "Custom user-added component",
    };
    setItems((prev) => [newItem, ...prev]);
    setNewItemName("");
    setShowAddForm(false);
  };

  // Calculations
  const totalCost = items.reduce(
    (sum, item) => sum + item.actualPriceINR * item.qty,
    0
  );
  const collectedCount = items.filter((i) => i.collected).length;
  const progressPercent = Math.round((collectedCount / (items.length || 1)) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Header */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          <Calculator size={12} />
          <span>Dynamic Bill of Materials &amp; Budget Planner</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Robo Rumble Component BOM
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Estimate realistic project budgets in Indian Rupees (INR), swap tiers between budget, balanced, and performance setups, and track collected parts.
        </p>
      </div>

      {/* Preset Switcher & Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Tier Presets (7 cols) */}
        <div className="md:col-span-7 rounded-2xl bg-[#111318] border border-white/10 p-4 space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-gray-400">Select Budget Tier:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "budget", label: "Budget Build", price: "₹1,250", note: "Cardboard/Scrap & TT Motors" },
              { id: "balanced", label: "Balanced Build", price: "₹2,450", note: "Acrylic + Metal Gears" },
              { id: "performance", label: "Performance Build", price: "₹4,500", note: "Aluminum CNC + 3S LiPo" },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id as any)}
                className={`p-3 rounded-xl text-left border transition ${
                  selectedPreset === preset.id
                    ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold">{preset.label}</div>
                <div className={`text-sm font-black mt-0.5 ${selectedPreset === preset.id ? "text-white" : "text-orange-400"}`}>
                  {preset.price}
                </div>
                <div className="text-[9px] opacity-75 mt-0.5">{preset.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Cost & Progress Card (5 cols) */}
        <div className="md:col-span-5 rounded-2xl bg-gradient-to-br from-[#13161f] to-[#0f1118] border border-white/10 p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400">Total Calculated Cost</span>
            <div className="text-3xl font-black text-emerald-400 mt-1 flex items-baseline gap-1.5 font-mono">
              <span>₹{totalCost.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-sans font-normal">INR Total</span>
            </div>
          </div>

          <div className="space-y-1.5 mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono text-[11px]">Collection Checklist:</span>
              <span className="font-bold text-white font-mono">
                {collectedCount} / {items.length} parts ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Part Button / Form */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers size={15} className="text-orange-400" />
          <span>Parts Inventory &amp; Price Breakdown</span>
        </h3>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition"
        >
          <Plus size={13} />
          <span>{showAddForm ? "Cancel" : "Add Custom Part"}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 rounded-2xl bg-[#111318] border border-orange-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Part Name</label>
            <input
              type="text"
              placeholder="e.g. Silicone Wire 16 AWG"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Category</label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white"
            >
              <option value="Structure">Structure</option>
              <option value="Drive System">Drive System</option>
              <option value="Power System">Power System</option>
              <option value="Control System">Control System</option>
              <option value="Fasteners">Fasteners</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Price (₹ INR)</label>
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddItem}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Add to BOM
            </button>
          </div>
        </div>
      )}

      {/* BOM Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black/60 text-gray-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5 w-12 text-center">Status</th>
                <th className="p-3.5">Component &amp; Notes</th>
                <th className="p-3.5 w-28">Category</th>
                <th className="p-3.5 w-20 text-center">Qty</th>
                <th className="p-3.5 w-28 text-right">Unit Price (₹)</th>
                <th className="p-3.5 w-28 text-right">Subtotal</th>
                <th className="p-3.5 text-center">Buy Online</th>
                <th className="p-3.5 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-white/[0.02] transition ${
                    item.collected ? "opacity-60 bg-white/[0.01]" : ""
                  }`}
                >
                  {/* Status Checkbox */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleToggleCollected(item.id)}
                      className="text-gray-400 hover:text-white transition"
                    >
                      {item.collected ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <Circle size={16} />
                      )}
                    </button>
                  </td>

                  {/* Component Name & Sourcing Tip */}
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[10px] text-gray-400">{item.notes}</div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      {item.category}
                    </span>
                  </td>

                  {/* Quantity Input */}
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                      className="w-14 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-center text-xs text-white"
                    />
                  </td>

                  {/* Editable Actual Price */}
                  <td className="p-3.5 text-right font-mono">
                    <input
                      type="number"
                      min={0}
                      value={item.actualPriceINR}
                      onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                      className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-right text-xs text-white font-mono"
                    />
                  </td>

                  {/* Subtotal */}
                  <td className="p-3.5 text-right font-bold text-white font-mono">
                    ₹{(item.actualPriceINR * item.qty).toLocaleString()}
                  </td>

                  {/* Buy Online (Amazon / Flipkart / Robu) */}
                  <td className="p-3.5 text-center">
                    <BuyLinkButtons
                      componentName={item.name}
                      compact={true}
                    />
                  </td>

                  {/* Delete */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove Part"
                    >
                      <Trash2 size={13} />
                    </button>
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
