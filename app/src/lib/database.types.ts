export interface Database {
  public: {
    Tables: {
      foods: {
        Row: {
          id: string;
          name: string;
          brand: string | null;
          product_size: string | null;
          serving_size: string | null;
          woolworths_id: string | null;
          calories_per_100g: number;
          protein_per_100g: number;
          fat_per_100g: number;
          carbs_per_100g: number;
          calories_per_serve: number | null;
          protein_per_serve: number | null;
          fat_per_serve: number | null;
          carbs_per_serve: number | null;
          source: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["foods"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["foods"]["Insert"]>;
      };
      meal_plans: {
        Row: {
          id: string;
          name: string;
          week_start: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["meal_plans"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["meal_plans"]["Insert"]>;
      };
      meal_plan_items: {
        Row: {
          id: string;
          meal_plan_id: string;
          food_id: string;
          day_of_week: number; // 0=Monday, 6=Sunday
          meal_type: "breakfast" | "lunch" | "dinner" | "supper";
          servings: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["meal_plan_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["meal_plan_items"]["Insert"]>;
      };
      food_diary: {
        Row: {
          id: string;
          food_id: string | null;
          food_name: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          date: string;
          photo_url: string | null;
          rating: number | null; // 1-5 scale
          feels_good: boolean | null;
          notes: string | null;
          calories: number | null;
          protein: number | null;
          fat: number | null;
          carbs: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["food_diary"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["food_diary"]["Insert"]>;
      };
    };
  };
}

// Convenience types
export type Food = Database["public"]["Tables"]["foods"]["Row"];
export type MealPlan = Database["public"]["Tables"]["meal_plans"]["Row"];
export type MealPlanItem = Database["public"]["Tables"]["meal_plan_items"]["Row"];
export type FoodDiaryEntry = Database["public"]["Tables"]["food_diary"]["Row"];
