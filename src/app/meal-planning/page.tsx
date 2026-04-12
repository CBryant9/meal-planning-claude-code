"use client";

import { useState } from "react";
import { ChevronLeft, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function MealPlanningPage() {
  const [calories, setCalories] = useState<string>("");
  const [sameEveryDay, setSameEveryDay] = useState(true);

  return (
    <div className="px-6 md:px-10 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-[#0d9e6d]">
          <ChevronLeft size={20} />
        </Link>
        <span className="text-[#0d9e6d] font-medium text-sm">Meal Planning</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-[#0d9e6d]/10 rounded-xl text-[#0d9e6d]">
          <CalendarDays size={22} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Weekly Plan</h1>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calories per day
        </label>
        <div className="relative mb-5">
          <input
            type="number"
            inputMode="numeric"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="e.g. 2000"
            className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d] bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            kcal
          </span>
        </div>

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sameEveryDay}
            onChange={(e) => setSameEveryDay(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-[#0d9e6d]"
          />
          <span>
            <span className="block text-sm font-medium text-gray-700">
              Just make it one
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Use the same meals every day of the week
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
