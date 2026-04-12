"use client";

import { useState } from "react";
import { ChevronLeft, Search, Plus } from "lucide-react";
import Link from "next/link";
import { sampleFoods } from "@/lib/sample-data";

export default function FoodDirectoryPage() {
  const [search, setSearch] = useState("");

  const filteredFoods = sampleFoods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 md:px-10 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-[#0d9e6d]">
          <ChevronLeft size={20} />
        </Link>
        <span className="text-[#0d9e6d] font-medium text-sm">Food Directory</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your <span className="font-bold text-gray-900">foods</span>
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0d9e6d] text-white rounded-lg text-sm font-medium hover:bg-[#0b8a5e] transition-colors">
          <Plus size={16} />
          Add Food
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d]"
        />
      </div>

      {/* Food list */}
      <div className="grid gap-3">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{food.name}</h3>
                <p className="text-sm text-gray-400">
                  {food.brand} - {food.product_size}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#0d9e6d]">
                  {food.calories_per_100g} kcal
                </p>
                <p className="text-xs text-gray-400">per 100g</p>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>
                P: <strong>{food.protein_per_100g}g</strong>
              </span>
              <span>
                F: <strong>{food.fat_per_100g}g</strong>
              </span>
              <span>
                C: <strong>{food.carbs_per_100g}g</strong>
              </span>
            </div>
          </div>
        ))}

        {filteredFoods.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            No foods found. Add some to get started!
          </p>
        )}
      </div>
    </div>
  );
}
