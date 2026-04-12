// Sample data for initial UI rendering before Supabase is connected
import type { Food, MealPlanItem, FoodDiaryEntry } from "./database.types";

export const sampleFoods: Food[] = [
  {
    id: "1",
    name: "YoPRO Vanilla Yoghurt",
    brand: "Danone (YoPRO)",
    product_size: "160g tub",
    serving_size: "160g",
    woolworths_id: "646684",
    calories_per_100g: 58,
    protein_per_100g: 9.5,
    fat_per_100g: 0.3,
    carbs_per_100g: 4.1,
    calories_per_serve: 93,
    protein_per_serve: 15.2,
    fat_per_serve: 0.5,
    carbs_per_serve: 6.6,
    source: "calorieking.com.au",
    notes: "High protein, 0 added sugar",
    image_url: null,
    created_at: "2026-03-16",
  },
  {
    id: "2",
    name: "Lipton Peach Ice Tea",
    brand: "Lipton",
    product_size: "1.5L bottle",
    serving_size: "250ml",
    woolworths_id: null,
    calories_per_100g: 16,
    protein_per_100g: 0,
    fat_per_100g: 0,
    carbs_per_100g: 3.8,
    calories_per_serve: 40,
    protein_per_serve: 0,
    fat_per_serve: 0,
    carbs_per_serve: 9.5,
    source: "product label",
    notes: null,
    image_url: null,
    created_at: "2026-03-16",
  },
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "supper"] as const;

export const sampleMealPlanItems: (MealPlanItem & { food_name?: string })[] = [
  {
    id: "1",
    meal_plan_id: "plan-1",
    food_id: "1",
    day_of_week: 2, // Wednesday
    meal_type: "breakfast",
    servings: 1,
    created_at: "2026-04-10",
    food_name: "Toast with banana",
  },
  {
    id: "2",
    meal_plan_id: "plan-1",
    food_id: "2",
    day_of_week: 2,
    meal_type: "lunch",
    servings: 1,
    created_at: "2026-04-10",
    food_name: "Pizza with salad",
  },
  {
    id: "3",
    meal_plan_id: "plan-1",
    food_id: "1",
    day_of_week: 2,
    meal_type: "dinner",
    servings: 1,
    created_at: "2026-04-10",
    food_name: "Pancakes with honey",
  },
  {
    id: "4",
    meal_plan_id: "plan-1",
    food_id: "2",
    day_of_week: 2,
    meal_type: "supper",
    servings: 1,
    created_at: "2026-04-10",
    food_name: "Set of salad",
  },
];
