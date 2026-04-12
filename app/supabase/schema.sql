-- Meal Planning App - Database Schema
-- Run this in your Supabase SQL editor to create the tables

-- Foods directory
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  product_size text,
  serving_size text,
  woolworths_id text,
  calories_per_100g numeric not null,
  protein_per_100g numeric not null,
  fat_per_100g numeric not null,
  carbs_per_100g numeric not null,
  calories_per_serve numeric,
  protein_per_serve numeric,
  fat_per_serve numeric,
  carbs_per_serve numeric,
  source text,
  notes text,
  image_url text,
  created_at timestamptz default now()
);

-- Meal plans (e.g. "Week of April 7")
create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  week_start date not null,
  created_at timestamptz default now()
);

-- Items within a meal plan
create table if not exists meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  food_id uuid references foods(id) on delete set null,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Monday
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'supper')),
  servings numeric default 1,
  created_at timestamptz default now()
);

-- Food diary - track what you ate + how it made you feel
create table if not exists food_diary (
  id uuid primary key default gen_random_uuid(),
  food_id uuid references foods(id) on delete set null,
  food_name text not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  date date not null default current_date,
  photo_url text,
  rating int check (rating between 1 and 5),
  feels_good boolean,
  notes text,
  calories numeric,
  protein numeric,
  fat numeric,
  carbs numeric,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_meal_plan_items_plan on meal_plan_items(meal_plan_id);
create index if not exists idx_meal_plan_items_day on meal_plan_items(day_of_week);
create index if not exists idx_food_diary_date on food_diary(date);
create index if not exists idx_foods_name on foods(name);
