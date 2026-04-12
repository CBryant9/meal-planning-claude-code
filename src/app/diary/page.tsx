"use client";

import { useState } from "react";
import { ChevronLeft, Plus, Camera, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";

interface DiaryEntry {
  id: string;
  food_name: string;
  meal_type: string;
  date: string;
  rating: number | null;
  feels_good: boolean | null;
  notes: string | null;
  calories: number | null;
}

const sampleDiary: DiaryEntry[] = [
  {
    id: "1",
    food_name: "YoPRO Vanilla Yoghurt",
    meal_type: "breakfast",
    date: "2026-04-10",
    rating: 4,
    feels_good: true,
    notes: "Good energy, no bloating",
    calories: 93,
  },
  {
    id: "2",
    food_name: "Chicken stir fry with rice",
    meal_type: "dinner",
    date: "2026-04-10",
    rating: 3,
    feels_good: false,
    notes: "Felt heavy afterwards",
    calories: 450,
  },
  {
    id: "3",
    food_name: "Banana smoothie",
    meal_type: "snack",
    date: "2026-04-09",
    rating: 5,
    feels_good: true,
    notes: null,
    calories: 180,
  },
];

const MEAL_BADGES: Record<string, string> = {
  breakfast: "bg-[#0d9e6d]/10 text-[#0d9e6d]",
  lunch: "bg-orange-100 text-orange-600",
  dinner: "bg-blue-100 text-blue-600",
  snack: "bg-purple-100 text-purple-600",
};

export default function DiaryPage() {
  const [showForm, setShowForm] = useState(false);

  const grouped = sampleDiary.reduce<Record<string, DiaryEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    },
    {}
  );

  return (
    <div className="px-6 md:px-10 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-[#0d9e6d]">
          <ChevronLeft size={20} />
        </Link>
        <span className="text-[#0d9e6d] font-medium text-sm">Food Diary</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          How does your food{" "}
          <span className="font-bold text-gray-900">feel</span>?
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d9e6d] text-white rounded-lg text-sm font-medium hover:bg-[#0b8a5e] transition-colors"
        >
          <Plus size={16} />
          Log Food
        </button>
      </div>

      {/* Quick add form */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="What did you eat?"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d] bg-white"
            />
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d] bg-white">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-500">How did it feel?</span>
            <button className="p-2 rounded-lg hover:bg-green-50 text-green-500">
              <ThumbsUp size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-red-50 text-red-400">
              <ThumbsDown size={20} />
            </button>
            <button className="ml-auto p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <Camera size={20} />
            </button>
          </div>
          <textarea
            placeholder="Notes (optional)"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d] bg-white mb-3"
          />
          <button className="w-full py-2 bg-[#0d9e6d] text-white rounded-lg text-sm font-medium hover:bg-[#0b8a5e]">
            Save Entry
          </button>
        </div>
      )}

      {/* Diary entries grouped by date */}
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, entries]) => (
          <div key={date} className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              {date === "2026-04-10" ? "Today" : date}
            </h3>
            <div className="grid gap-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          MEAL_BADGES[entry.meal_type] || MEAL_BADGES.snack
                        }`}
                      >
                        {entry.meal_type}
                      </span>
                      <h4 className="font-medium text-gray-800">
                        {entry.food_name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1">
                      {entry.feels_good !== null &&
                        (entry.feels_good ? (
                          <ThumbsUp size={16} className="text-green-500" />
                        ) : (
                          <ThumbsDown size={16} className="text-red-400" />
                        ))}
                      {entry.calories && (
                        <span className="text-sm text-gray-400 ml-2">
                          {entry.calories} kcal
                        </span>
                      )}
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-500 mt-2">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
