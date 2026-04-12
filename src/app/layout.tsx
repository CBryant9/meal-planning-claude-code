import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Plan meals, track foods, and log how they make you feel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-screen font-sans">
        {/* Outer green frame - rounded corners, gradient */}
        <div className="h-screen w-screen rounded-[28px] overflow-hidden bg-gradient-to-r from-[#48b882] via-[#7ed4a8] to-[#c5e8d6]">
          <div className="flex h-full">
            {/* Sidebar on the green */}
            <Sidebar />

            {/* White content - same radius all around, outer frame clips the flush edges */}
            <main className="flex-1 h-full bg-white rounded-[28px] overflow-auto pb-20 md:pb-0">
              {children}
            </main>
          </div>
        </div>

        <MobileNav />
      </body>
    </html>
  );
}
