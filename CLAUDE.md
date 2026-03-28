# Meal Planning Tool - Claude Code Project

## Purpose
This project helps with meal planning and prepping by looking up nutritional information for foods from Woolworths Australia and storing them in a local directory for future reference.

## How It Works

### Food Lookup Process
1. **Check the local food directory first** (`food-directory/`) - if we already have the food's data, use that instead of searching again.
2. **If not in directory**, look up the food using this priority order:
   a. **Web search** for the product name + "nutrition information per 100g australia"
   b. **Fetch** from Australian sources: CalorieKing AU, FatSecret AU, manufacturer's website
   c. **Woolworths product image fallback** - if web sources don't have the info, download the nutrition label photo from Woolworths CDN and read it visually (see below)
3. **Always ask/confirm the product size** with the user - this is critical for calculating per-serve macros correctly.
4. **Save the result** to the food directory so we don't need to look it up again.

### Woolworths Image Fallback Method
Woolworths blocks direct page fetching (403 errors), but their **product images are accessible** via CDN:
- Front image: `https://cdn0.woolworths.media/content/wowproductimages/large/{PRODUCT_ID}.jpg`
- Back/nutrition label: `https://cdn0.woolworths.media/content/wowproductimages/large/{PRODUCT_ID}_2.jpg`
- Additional images: `{PRODUCT_ID}_3.jpg`, `{PRODUCT_ID}_4.jpg`, etc.

The PRODUCT_ID is the number in the Woolworths URL, e.g. `productdetails/480231/...` -> ID is `480231`.

To use this:
1. Extract the product ID from the Woolworths URL
2. Download image `{ID}.jpg` (front - confirms product name and size)
3. Download image `{ID}_2.jpg` (usually the nutrition label on the back)
4. If `_2` doesn't have the label, try `_3`, `_4`, etc.
5. Read the nutrition panel from the image visually
6. **Do NOT save the images** - only use them temporarily to extract data, then delete
7. Save the extracted nutrition data as a .txt file in the food directory

### Product Size & Serving - IMPORTANT
- **Always confirm the product size/weight** with the user (e.g. "Is this the 160g tub or the 700g tub?")
- Products often come in multiple sizes - the filename slug should include the size if relevant
- Example: `yopro-vanilla-yoghurt-160g.txt` vs `yopro-vanilla-yoghurt-700g.txt`
- The per-100g values will be the same across sizes, but the per-serve values depend on the specific product size
- When the user asks "how many calories in X", always clarify which size/how much they're having
- When showing results, always state: the **per 100g** values AND the **per serve** values with the serve size clearly noted

### Food Directory Structure
Foods are stored in `food-directory/` as plain text files.
- Filename = slug of product name + size: `food-directory/yopro-vanilla-yoghurt-160g.txt`
- Template: `food-directory/_template.txt`
- Key data per file: calories (kcal), protein, fat, carbs, serving size, product size
- No images are saved - images are only used temporarily for data extraction

### Slash Commands
- `/lookup-food` - Look up a food item and save it to the directory. Accepts a Woolworths URL, product name, or food description.

## Key Conventions
- All nutritional values should be per 100g as the standard unit
- Per-serve values included when known, with serve size clearly stated
- Calories stored as kcal (converted from kJ using kJ / 4.184)
- When user gives a Woolworths URL, extract product name from the URL slug AND the product ID for image fetching
- Always check `food-directory/` before doing a web lookup
- When a food is already in the directory, tell the user and show the saved data
- If a product comes in multiple sizes and we only have one size saved, note this to the user
