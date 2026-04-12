import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="px-6 md:px-10 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-[#0d9e6d]">
          <ChevronLeft size={20} />
        </Link>
        <span className="text-[#0d9e6d] font-medium text-sm">Settings</span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-1">Supabase Connection</h3>
          <p className="text-sm text-gray-400 mb-3">
            Connect to your Supabase database to sync foods and meal plans.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-sm text-gray-500">
              Not connected - set env vars in .env.local
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-1">Telegram Bot</h3>
          <p className="text-sm text-gray-400">
            Configure via n8n - connect your Telegram bot to log foods and check meal plans on the go.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-1">About</h3>
          <p className="text-sm text-gray-400">
            Meal Planner v0.1.0 - Plan meals, track foods, and log how they make you feel.
          </p>
        </div>
      </div>
    </div>
  );
}
