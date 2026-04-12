"use client";

import { ChefHat } from "lucide-react";

interface FoodCategory {
  name: string;
  subtitle: string;
  emoji: string;
}

const categories: FoodCategory[] = [
  { name: "Steak", subtitle: "Made 3 Ingredients", emoji: "🥩" },
  { name: "Veg Food", subtitle: "Made 4 Ingredients", emoji: "🥗" },
  { name: "Steak Fries", subtitle: "Made 3 Ingredients", emoji: "🍟" },
  { name: "Chicken", subtitle: "Made 4 Ingredients", emoji: "🍗" },
  { name: "Pasta", subtitle: "Made 5 Ingredients", emoji: "🍝" },
];

export default function CookingToday() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          What are we cooking <span className="font-bold text-gray-900">today</span>?
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#0d9e6d] text-[#0d9e6d] rounded-lg text-sm font-medium hover:bg-[#0d9e6d]/5 transition-colors">
          <ChefHat size={16} />
          PREPARE
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="flex flex-col items-center gap-2 min-w-[90px] group"
          >
            <div className="w-[72px] h-[72px] rounded-full bg-gray-100 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md transition-shadow border border-gray-200/50">
              {cat.emoji}
            </div>
            <span className="text-sm font-medium text-gray-800">{cat.name}</span>
            <span className="text-[11px] text-gray-400">{cat.subtitle}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
