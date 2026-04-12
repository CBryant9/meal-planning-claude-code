# Meal Planning App

## Project Overview
A meal planning and food tracking app with:
- **Web app** (Next.js on Vercel) - meal planning, food directory, food diary
- **Telegram bot** (via n8n on Hostinger) - quick food logging, meal queries
- **Database** (Supabase PostgreSQL) - shared data layer
- **AI** (OpenAI via n8n nodes) - smart food lookups, natural language processing

## Architecture

```
Frontend (Next.js/Vercel)  ──┐
                              ├──▶  Supabase (PostgreSQL + Storage)
Telegram Bot (n8n/Hostinger) ──┘
                              │
                         OpenAI (via n8n)
```

## App Structure (`app/`)
- `src/app/page.tsx` - Home: "What are we cooking today?" + weekly meal plan grid
- `src/app/food-directory/page.tsx` - Searchable food database
- `src/app/diary/page.tsx` - Food diary with feel-good/feel-bad tracking
- `src/app/settings/page.tsx` - Connection status, configuration
- `src/components/` - Sidebar, MobileNav, CookingToday, MealPlanWeek
- `src/lib/supabase.ts` - Supabase client
- `src/lib/database.types.ts` - TypeScript types for all tables
- `src/lib/sample-data.ts` - Placeholder data (used before Supabase is connected)
- `supabase/schema.sql` - Database migration to run in Supabase SQL editor

## Database Tables
- **foods** - Nutrition info per food (per 100g + per serve), Woolworths ID, source
- **meal_plans** - Named weekly plans with a start date
- **meal_plan_items** - Links foods to days/meals within a plan
- **food_diary** - Daily food log with photos, ratings, feels_good/feels_bad tracking

## Key Features
1. **Meal Planning** - Weekly grid, drag foods into breakfast/lunch/dinner/supper slots
2. **Food Directory** - Search and browse saved foods with macro info
3. **Food Diary** - Log what you ate, rate how it made you feel (good/bad), photo support
4. **Telegram Bot** - Quick logging via chat, ask "what's for dinner?"

## Food Lookup (via /lookup-food skill)
1. Check Supabase `foods` table first
2. Web search for nutrition info (per 100g, Australian sources)
3. Woolworths CDN image fallback: `https://cdn0.woolworths.media/content/wowproductimages/large/{PRODUCT_ID}.jpg`
4. Always confirm product size with user
5. Save to database

## Conventions
- All nutrition values stored per 100g as standard unit
- Calories in kcal (convert from kJ using kJ / 4.184)
- Teal/green (#0d9488) as primary accent color
- Design matches the reference screenshot (clean, rounded cards, sidebar nav)
- Mobile-responsive with bottom nav on mobile, sidebar on desktop

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Development
```bash
cd app
npm run dev    # Start dev server
npm run build  # Production build
```
