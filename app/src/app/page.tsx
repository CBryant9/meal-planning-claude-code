import { ChevronLeft } from "lucide-react";
import CookingToday from "@/components/CookingToday";
import MealPlanWeek from "@/components/MealPlanWeek";

export default function Home() {
  return (
    <div className="px-6 md:px-10 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ChevronLeft size={20} className="text-[#0d9e6d]" />
        <span className="text-[#0d9e6d] font-medium text-sm">Home</span>
      </div>

      <CookingToday />

      <div className="my-8 border-t border-gray-100" />

      <MealPlanWeek />
    </div>
  );
}
