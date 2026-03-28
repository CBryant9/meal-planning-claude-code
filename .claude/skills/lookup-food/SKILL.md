---
name: lookup-food
description: Look up nutritional information for a food item and save it to the food directory. Use this skill whenever the user wants to find calories, macros, or nutrition info for a food product — whether they give a Woolworths URL, a product name, or just ask "how many calories in X". Also trigger when the user says "look up", "add to food directory", "what's the nutrition for", or mentions a specific food product they want tracked. This skill handles the full workflow from lookup to saving a .txt file in the food directory.
---

# Food Lookup Skill

You help the user look up nutritional information for food products (primarily from Woolworths Australia) and save them as .txt files in the `food-directory/`.

## Overview of the flow

1. Figure out what product the user wants
2. Check if it's already saved locally
3. Confirm the product size with the user
4. Get nutrition data (images from Woolworths CDN → web search fallback)
5. Convert kJ to kcal, calculate per-serve values
6. Show the user a summary
7. Save as a .txt file, clean up any temp images

---

## Step 1: Parse the input

**If the user gave a Woolworths URL** (contains `woolworths.com.au`):
- Extract the **product name** from the URL slug (e.g. `/lipton-ice-tea-peach` → "Lipton Ice Tea Peach")
- Extract the **product ID** — it's the number after `productdetails/` (e.g. `productdetails/305224/...` → `305224`)

**If the user gave a product name** (no URL):
- Use WebSearch: `site:woolworths.com.au {product name}`
- Look for a `woolworths.com.au/shop/productdetails/` link in the results
- Extract the product ID from that URL
- If no Woolworths result found, that's OK — skip to web search for nutrition data

**If the user just describes a food** (e.g. "chicken breast" or "banana"):
- Treat it as a generic food lookup — skip Woolworths images, go straight to web search

---

## Step 2: Check the local food directory

Before doing any lookups, check if we already have this product saved:

- Use Glob to search `food-directory/*.txt` for matching filenames
- Read any potential matches to check if it's the same product
- If found: show the user the saved data and ask if they want to update it
- If found but different size: note this ("We have the 160g version saved, but you're asking about the 700g")

---

## Step 3: Confirm the product size

This is important — many products come in multiple sizes and the per-serve values depend on which one.

- Ask the user: "What size is this? e.g. the 160g tub or the 700g tub?"
- If the size is obvious from the URL or product name, confirm it: "This is the 1.5L bottle, correct?"
- The size goes in the filename (e.g. `yopro-vanilla-yoghurt-160g.txt`)

---

## Step 4: Get nutrition data

Try these methods in order. The Woolworths CDN image method is preferred because it reads directly from the actual product label.

### Method A: Woolworths CDN Images (preferred — use when you have a product ID)

Woolworths blocks direct page fetching (403), but their product images are on an open CDN. **Important: use curl, not WebFetch** — WebFetch also gets blocked by the CDN.

Download images to temp files in the project root:
```bash
curl -s -o "temp-front.jpg" -w "%{http_code}" -H "User-Agent: Mozilla/5.0" \
  "https://cdn0.woolworths.media/content/wowproductimages/large/{PRODUCT_ID}.jpg"

curl -s -o "temp-back.jpg" -w "%{http_code}" -H "User-Agent: Mozilla/5.0" \
  "https://cdn0.woolworths.media/content/wowproductimages/large/{PRODUCT_ID}_2.jpg"
```

- Check the HTTP status code — `200` means success, `404` means that image doesn't exist
- Use the **Read tool** to view the images visually
- The **front image** (`{ID}.jpg`) confirms the product name and size
- The **back image** (`{ID}_2.jpg`) usually has the nutrition information panel
- If `_2` doesn't show the nutrition panel, try `_3.jpg`, `_4.jpg`, `_5.jpg` etc.
- Read the kJ, protein, fat, carbs values from the nutrition panel

### Method B: Web Search (fallback, or to cross-reference)

Use this if:
- No Woolworths product ID available
- CDN images returned 404
- The nutrition label wasn't readable in the images (common with bottles/cans)

```
WebSearch: "{product name} nutrition information per 100g australia"
```

Good sources (use WebFetch on these):
- CalorieKing Australia (calorieking.com.au)
- FatSecret Australia
- Manufacturer's own website
- Do NOT fetch from woolworths.com.au directly — it returns 403

---

## Step 5: Extract and convert the data

Australian nutrition labels show energy in **kilojoules (kJ)**. Always convert to kilocalories:

> **kcal = kJ ÷ 4.184** (round to nearest whole number)

Extract these values **per 100g** (or per 100ml for drinks):
- Energy in kJ → calculate kcal
- Protein (g)
- Fat (g)
- Carbohydrates (g)

Then calculate **per-serve** values:
- Multiply each per-100g value by `(serving_size_in_grams / 100)`
- Note what the serving size is (e.g. 160g, 200ml, 40g)

---

## Step 6: Show the user a summary

Display it cleanly:
```
Product: {name} ({product size})
Per 100g: XXX kcal (XXX kJ) | Xg protein | Xg fat | Xg carbs
Per serve (Xg): XXX kcal (XXX kJ) | Xg protein | Xg fat | Xg carbs
```

---

## Step 7: Save to food directory

Create a `.txt` file in `food-directory/`.

**Filename format:** lowercase slug with size, e.g.:
- `yopro-vanilla-yoghurt-160g.txt`
- `lipton-peach-ice-tea-1.5l.txt`
- `uncle-tobys-quick-oats-1kg.txt`

The size in the filename is mandatory.

**File format:**
```
{Product Name}
Brand: {brand}
Product Size: {e.g. 160g tub, 1.5L bottle}
Serving Size: {e.g. 160g, 200ml}
Woolworths ID: {product ID, or "N/A" if not from Woolworths}
Date: {YYYY-MM-DD}

Per 100g:
  Calories: XXX kcal (XXX kJ)
  Protein: Xg
  Fat: Xg
  Carbs: Xg

Per Serve ({serve size}):
  Calories: XXX kcal (XXX kJ)
  Protein: Xg
  Fat: Xg
  Carbs: Xg

Source: {where the data came from, e.g. "Woolworths CDN product image", "calorieking.com.au"}
Notes: {any useful notes, e.g. "0 added sugar", "high protein"}
```

---

## Step 8: Clean up

Delete ALL temporary image files when done:
```bash
rm -f temp-front.jpg temp-back.jpg temp-label.jpg temp-label3.jpg temp-label4.jpg
```

Never keep images in the project. The .txt file in food-directory/ is the only output.

---

## Quick reference

| Input type | What to do |
|---|---|
| Woolworths URL | Extract product ID → CDN images → read label → save .txt |
| Product name | WebSearch `site:woolworths.com.au {name}` → get ID → CDN images → save .txt |
| Generic food | WebSearch for nutrition → save .txt |
| Already in directory | Show saved data, ask if user wants to update |

| Conversion | Formula |
|---|---|
| kJ to kcal | kcal = kJ ÷ 4.184 |
| Per-serve from per-100g | value × (serve_g / 100) |
