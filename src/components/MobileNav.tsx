"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Home, BookOpen, CalendarDays, Settings } from "lucide-react";

const navItems = [
  { icon: Home, href: "/", label: "Home" },
  { icon: Search, href: "/food-directory", label: "Foods" },
  { icon: CalendarDays, href: "/meal-planning", label: "Plan" },
  { icon: BookOpen, href: "/diary", label: "Diary" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white flex justify-around py-3 z-50 rounded-t-[20px] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium ${
              isActive ? "text-[#0d9e6d]" : "text-[#8a9bae]"
            }`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
