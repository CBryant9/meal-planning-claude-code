# Meal Planning Tool

A nutrition lookup and meal planning assistant built entirely as a Claude Code project - no traditional codebase, no frameworks, just structured prompts and a local file-based data layer.

## What It Does

- Looks up nutritional data for Australian grocery products (Woolworths, Coles, etc.)
- Stores results in a local plain-text food directory for instant reuse
- Calculates per-serve macros based on actual product sizes
- Uses a multi-source lookup pipeline: local cache, web search, product label image reading

## How It Works

This project uses Claude Code as both the runtime and the interface. The entire system is defined through a `CLAUDE.md` instruction file and a structured `food-directory/` of plain-text nutrition records.

**Lookup pipeline:**
1. Check the local food directory first (avoid redundant lookups)
2. Web search Australian nutrition sources (CalorieKing AU, FatSecret AU, manufacturer sites)
3. If web sources fail, fetch the product's nutrition label image directly from the retailer CDN and read it visually
4. Confirm product size with the user, then save structured data to the directory

**Data format:**
Each food is a `.txt` file with standardised fields - per 100g and per serve macros, source attribution, and product metadata. Files are named by product slug and size (e.g. `yopro-vanilla-yoghurt-160g.txt`).

## Why Build It This Way

This was an experiment in using an LLM agent as the entire application layer - no code to maintain, no dependencies to manage, no UI to build. The "logic" lives in natural language instructions, and the "database" is a folder of text files.

It works surprisingly well for a personal tool where the interaction model is conversational anyway.

## Tech

- **Runtime:** Claude Code (CLI)
- **Data layer:** Plain text files with structured templates
- **Nutrition sources:** CalorieKing AU, FatSecret AU, manufacturer sites, Woolworths CDN image fallback
- **Region:** Australia (kJ/kcal, Australian product databases)
