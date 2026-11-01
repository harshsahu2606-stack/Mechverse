"use client";

import React, { useState } from "react";
import { ShoppingBag, ExternalLink, Check, Download, IndianRupee, Store, Search } from "lucide-react";
import { AERO_COMPONENTS_DATA } from "@/data/aeroDroneData";

export default function AeroShoppingList() {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredComponents = AERO_COMPONENTS_DATA.filter((c) => {
    const matchesSupplier =
      selectedSupplier === "all" ||
      c.sourcing.supplier.toLowerCase().includes(selectedSupplier.toLowerCase());
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sourcing.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

  const totalCostINR = AERO_COMPONENTS_DATA.reduce(
    (sum, c) => sum + c.sourcing.priceINR * c.quantity,
    0
  );

  const purchasedCostINR = AERO_COMPONENTS_DATA.filter((c) => checkedItems[c.id]).reduce(
    (sum, c) => sum + c.sourcing.priceINR * c.quantity,
    0
  );

  const handleExportCSV = () => {
    const headers = "Category,Component Name,Model,Qty,Supplier,Unit Price (INR),Total Price (INR),Product URL\n";
    const rows = AERO_COMPONENTS_DATA.map(
      (c) =>
        `"${c.category}","${c.name}","${c.model}",${c.quantity},"${c.sourcing.supplier}",${c.sourcing.priceINR},${
          c.sourcing.priceINR * c.quantity
        },"${c.sourcing.url}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "AERO-450-Components-Shopping-List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="text-emerald-400" size={24} />
            <span>Verified Indian Sourcing Directory & Shopping List</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Genuine suppliers in India with authentic pricing in INR (₹) and direct links.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition shrink-0"
        >
          <Download size={14} className="text-emerald-400" />
          <span>Export Sourcing CSV</span>
        </button>
      </div>

      {/* Sourcing Spend Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Total Build Cost</span>
          <div className="text-2xl font-black text-emerald-400">₹{totalCostINR.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-gray-400 font-mono">15 Essential Core Items</span>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Procured So Far</span>
          <div className="text-2xl font-black text-white">₹{purchasedCostINR.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-gray-400 font-mono">
            {Object.values(checkedItems).filter(Boolean).length} / {AERO_COMPONENTS_DATA.length} Purchased
          </span>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Primary Suppliers</span>
          <div className="text-xs text-white font-bold mt-1">Robu.in • Robocraze • ElectronicsComp</div>
          <span className="text-[10px] text-gray-400 font-mono">All deliver pan-India with GST invoice</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search components, suppliers, or part numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e131b] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["all", "Robu.in", "Robocraze", "ElectronicsComp"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSupplier(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedSupplier === s
                  ? "bg-emerald-600 text-white"
                  : "bg-white/5 hover:bg-white/10 text-gray-400"
              }`}
            >
              {s === "all" ? "All Suppliers" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Sourcing Directory Cards */}
      <div className="space-y-3">
        {filteredComponents.map((c) => {
          const isChecked = !!checkedItems[c.id];
          const subtotal = c.sourcing.priceINR * c.quantity;

          return (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isChecked
                  ? "bg-emerald-950/20 border-emerald-500/30 opacity-75"
                  : "bg-[#0e131b] border-white/10 hover:border-emerald-500/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleCheck(c.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isChecked
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "border-white/20 hover:border-white/40 text-transparent"
                  }`}
                >
                  <Check size={14} className={isChecked ? "text-white" : "opacity-0"} />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      {c.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">• Qty: {c.quantity}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{c.name}</h4>
                  <p className="text-xs text-gray-400">{c.description}</p>
                  <div className="text-[11px] font-mono text-gray-400">
                    <span className="text-gray-500">Model:</span> {c.model} |{" "}
                    <span className="text-gray-500">Mass:</span> {c.massGrams * c.quantity}g
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-9 md:pl-0 border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                <div className="text-right">
                  <div className="text-sm font-black text-white font-mono">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    ₹{c.sourcing.priceINR} each
                  </div>
                </div>

                <a
                  href={c.sourcing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition"
                >
                  <span>{c.sourcing.supplier}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
