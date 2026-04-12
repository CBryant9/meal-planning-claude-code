"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DAYS, MEAL_TYPES, sampleMealPlanItems } from "@/lib/sample-data";

const MEAL_COLORS: Record<string, string> = {
  breakfast: "bg-[#0d9e6d]",
  lunch: "bg-orange-400",
  dinner: "bg-blue-500",
  supper: "bg-purple-500",
};

const MEAL_EMOJIS: Record<string, string> = {
  breakfast: "🍳",
  lunch: "🍕",
  dinner: "🥘",
  supper: "🥗",
};

export default function MealPlanWeek() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday

  const mealsForDay = sampleMealPlanItems.filter(
    (item) => item.day_of_week === selectedDay
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          Personal <span className="font-bold text-gray-900">meal plan</span>
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#0d9e6d] text-[#0d9e6d] rounded-lg text-sm font-medium hover:bg-[#0d9e6d]/5 transition-colors">
          <Plus size={16} />
          ADD PLAN
        </button>
      </div>

      {/* Week tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto hide-scrollbar">
        {[0, 1, 2, 3, 4].map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-4 py-1.5 text-sm whitespace-nowrap transition-colors ${
              selectedWeek === week
                ? "text-[#0d9e6d] border-b-2 border-[#0d9e6d] font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Week {String(week + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto hide-scrollbar border-b border-gray-100">
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(i)}
            className={`px-3 py-2 text-sm whitespace-nowrap transition-colors ${
              selectedDay === i
                ? "text-gray-900 font-bold border-b-2 border-[#0d9e6d]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MEAL_TYPES.map((mealType) => {
          const meal = mealsForDay.find((m) => m.meal_type === mealType);
          return (
            <div
              key={mealType}
              className="bg-[#2d3748] rounded-2xl overflow-hidden relative group cursor-pointer hover:shadow-lg transition-shadow"
            >
              {/* Placeholder image area */}
              <div className="h-32 md:h-36 bg-gradient-to-b from-[#4a5568] to-[#2d3748] flex items-center justify-center text-4xl">
                {MEAL_EMOJIS[mealType]}
              </div>

              {/* Meal type badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`${MEAL_COLORS[mealType]} text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full`}
                >
                  {mealType}
                </span>
              </div>

              {/* Food name */}
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">
                  {meal?.food_name || "No meal planned"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
