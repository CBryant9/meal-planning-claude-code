"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Home, BookOpen, CalendarDays, Settings } from "lucide-react";

const navItems = [
  { icon: Search, href: "/food-directory", label: "Search Foods" },
  { icon: Home, href: "/", label: "Home" },
  { icon: BookOpen, href: "/diary", label: "Food Diary" },
  { icon: CalendarDays, href: "/meal-planning", label: "Meal Planning" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col items-center w-[72px] shrink-0 py-8 gap-5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-[#1a6b47] bg-white/50 shadow-sm"
                : "text-[#2a7d57]/70 hover:text-[#1a6b47] hover:bg-white/30"
            }`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
          </Link>
        );
      })}
    </aside>
  );
}
