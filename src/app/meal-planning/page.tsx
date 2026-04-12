"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  CalendarDays,
  Plus,
  X,
  Copy,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";
const MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

const PLACEHOLDER_FOODS: Food[] = [
  { id: "p1", name: "YoPRO Vanilla Yoghurt 160g", calories: 93, protein: 15, carbs: 7, fat: 0 },
  { id: "p2", name: "Chicken breast 150g", calories: 248, protein: 46, carbs: 0, fat: 5 },
  { id: "p3", name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { id: "p4", name: "Brown rice 1 cup cooked", calories: 216, protein: 5, carbs: 45, fat: 2 },
  { id: "p5", name: "Mixed nuts 30g", calories: 180, protein: 6, carbs: 6, fat: 15 },
];

function emptyDay(): Record<MealType, Food[]> {
  return { breakfast: [], lunch: [], dinner: [], snacks: [] };
}

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatLong(d: Date): string {
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

function datesBetween(start: string, end: string): Date[] {
  if (!start || !end) return [];
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return [];
  const out: Date[] = [];
  const cur = new Date(s);
  while (cur <= e) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function MealPlanningPage() {
  const [calories, setCalories] = useState("");
  const [sameEveryDay, setSameEveryDay] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [meals, setMeals] = useState<Record<string, Record<MealType, Food[]>>>({});

  const [picker, setPicker] = useState<{ date: string; meal: MealType } | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [duplicateTargets, setDuplicateTargets] = useState<Set<string>>(new Set());
  const [toolsOpen, setToolsOpen] = useState(false);

  const days = useMemo(() => datesBetween(startDate, endDate), [startDate, endDate]);

  const rangeLabel =
    days.length === 0
      ? "Pick a start and end date"
      : `${formatLong(days[0])} to ${formatLong(days[days.length - 1])}`;

  function getMeals(dateKey: string) {
    return meals[dateKey] || emptyDay();
  }

  function addFood(date: string, meal: MealType, food: Food) {
    setMeals((prev) => {
      const day = prev[date] || emptyDay();
      return {
        ...prev,
        [date]: { ...day, [meal]: [...day[meal], { ...food, id: makeId() }] },
      };
    });
  }

  function removeFood(date: string, meal: MealType, foodId: string) {
    setMeals((prev) => {
      const day = prev[date];
      if (!day) return prev;
      return {
        ...prev,
        [date]: { ...day, [meal]: day[meal].filter((f) => f.id !== foodId) },
      };
    });
  }

  function openDuplicate(date: string) {
    setDuplicating(date);
    setDuplicateTargets(new Set());
  }

  function toggleDuplicateTarget(key: string) {
    setDuplicateTargets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function applyDuplicate() {
    if (!duplicating) return;
    const source = meals[duplicating];
    if (!source) {
      setDuplicating(null);
      return;
    }
    setMeals((prev) => {
      const next = { ...prev };
      duplicateTargets.forEach((target) => {
        next[target] = {
          breakfast: source.breakfast.map((f) => ({ ...f, id: makeId() })),
          lunch: source.lunch.map((f) => ({ ...f, id: makeId() })),
          dinner: source.dinner.map((f) => ({ ...f, id: makeId() })),
          snacks: source.snacks.map((f) => ({ ...f, id: makeId() })),
        };
      });
      return next;
    });
    setDuplicating(null);
    setDuplicateTargets(new Set());
  }

  function dayTotals(dateKey: string) {
    const m = getMeals(dateKey);
    let cal = 0, p = 0, c = 0, f = 0;
    MEALS.forEach((meal) => {
      m[meal].forEach((food) => {
        cal += food.calories;
        p += food.protein;
        c += food.carbs;
        f += food.fat;
      });
    });
    return { cal, p, c, f };
  }

  const shoppingList = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(meals).forEach((day) => {
      MEALS.forEach((meal) => {
        day[meal].forEach((food) => {
          counts[food.name] = (counts[food.name] || 0) + 1;
        });
      });
    });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [meals]);

  return (
    <div className="px-6 md:px-10 py-6 pb-24">
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

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* LEFT column */}
        <div className="space-y-5">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories per day
            </label>
            <div className="relative mb-4">
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

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              The Plan
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9e6d]/30 focus:border-[#0d9e6d] bg-white"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              {rangeLabel}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={16} className="text-[#0d9e6d]" />
              <h2 className="text-base font-semibold text-gray-800">
                Shopping List
              </h2>
            </div>
            {shoppingList.length === 0 ? (
              <p className="text-xs text-gray-500">
                Items you add to the plan will show up here.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {shoppingList.map(([name, count]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between text-sm text-gray-700"
                  >
                    <span>{name}</span>
                    <span className="text-xs text-gray-400 tabular-nums">
                      ×{count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT column — day cards */}
        <div className="lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2 space-y-4">
          {days.length === 0 && (
            <div className="bg-gray-50 rounded-2xl p-10 border border-dashed border-gray-200 text-center">
              <CalendarDays size={28} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                Pick your plan dates on the left to build your days.
              </p>
            </div>
          )}

          {days.map((d, idx) => {
            const key = toKey(d);
            const dayMeals = getMeals(key);
            const totals = dayTotals(key);
            return (
              <div
                key={key}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Day {idx + 1}
                    </h3>
                    <p className="text-xs text-gray-500">{formatLong(d)}</p>
                  </div>
                  <button
                    onClick={() => openDuplicate(key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0d9e6d] hover:bg-[#0d9e6d]/10 transition-colors"
                    title="Repeat this day"
                  >
                    <Copy size={14} />
                    Repeat
                  </button>
                </div>

                <div className="space-y-3">
                  {MEALS.map((meal) => (
                    <div key={meal}>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {MEAL_LABEL[meal]}
                        </h4>
                        <button
                          onClick={() => setPicker({ date: key, meal })}
                          className="flex items-center gap-1 text-xs text-[#0d9e6d] hover:text-[#0b8a5e] font-medium"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                      {dayMeals[meal].length === 0 ? (
                        <div className="text-xs text-gray-400 italic py-1.5 px-1">
                          No {meal} yet
                        </div>
                      ) : (
                        <ul className="space-y-1">
                          {dayMeals[meal].map((food) => (
                            <li
                              key={food.id}
                              className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2"
                            >
                              <div className="min-w-0">
                                <div className="text-sm text-gray-800 truncate">
                                  {food.name}
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {food.calories} kcal · P{food.protein} C
                                  {food.carbs} F{food.fat}
                                </div>
                              </div>
                              <button
                                onClick={() => removeFood(key, meal, food.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                                title="Remove"
                              >
                                <X size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {totals.cal} kcal
                  </span>
                  <span>
                    P {totals.p}g · C {totals.c}g · F {totals.f}g
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setToolsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-2 px-4 py-3 bg-[#0d9e6d] text-white rounded-full shadow-lg hover:bg-[#0b8a5e] transition-colors z-40"
      >
        <Wrench size={18} />
        <span className="text-sm font-medium">Tools</span>
      </button>

      {toolsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setToolsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white w-full max-w-xl rounded-t-3xl p-6 shadow-2xl"
            style={{ animation: "slideUp 0.2s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-[#0d9e6d]" />
                <h2 className="text-lg font-semibold text-gray-800">Tools</h2>
              </div>
              <button
                onClick={() => setToolsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Placeholder — tools will go here.
            </p>
          </div>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setPicker(null)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Pick a food · {MEAL_LABEL[picker.meal]}
              </h2>
              <button
                onClick={() => setPicker(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Real food directory hookup coming soon — tap one to add:
            </p>
            <ul className="space-y-1.5 max-h-80 overflow-y-auto">
              {PLACEHOLDER_FOODS.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => {
                      addFood(picker.date, picker.meal, f);
                      setPicker(null);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 border border-gray-100"
                  >
                    <div className="text-sm text-gray-800">{f.name}</div>
                    <div className="text-[11px] text-gray-400">
                      {f.calories} kcal · P{f.protein} C{f.carbs} F{f.fat}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {duplicating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDuplicating(null)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Repeat this day
              </h2>
              <button
                onClick={() => setDuplicating(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Tick the days to copy these meals onto. Existing meals on those
              days will be replaced.
            </p>
            <ul className="space-y-1.5 max-h-72 overflow-y-auto mb-4">
              {days
                .filter((d) => toKey(d) !== duplicating)
                .map((d) => {
                  const key = toKey(d);
                  const checked = duplicateTargets.has(key);
                  return (
                    <li key={key}>
                      <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDuplicateTarget(key)}
                          className="w-4 h-4 rounded accent-[#0d9e6d]"
                        />
                        <span className="text-sm text-gray-700">
                          {formatLong(d)}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {formatShort(d)}
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
            <div className="flex gap-2">
              <button
                onClick={() => setDuplicating(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={applyDuplicate}
                disabled={duplicateTargets.size === 0}
                className="flex-1 py-2.5 rounded-lg bg-[#0d9e6d] text-white text-sm font-medium hover:bg-[#0b8a5e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Copy to {duplicateTargets.size || 0} day
                {duplicateTargets.size === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
