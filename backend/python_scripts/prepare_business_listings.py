import pandas as pd
import random
from datetime import datetime

# Load OSM CSV
df = pd.read_csv("ahmedabad_osm_businesses.csv")

# ==============================
# STEP 1: CATEGORY MAPPING
# ==============================

category_mapping = {
    "restaurant": "Restaurant",
    "fast_food": "Restaurant",
    "cafe": "Cafe",
    "pharmacy": "Pharmacy",
    "hospital": "Hospital",
    "clinic": "Hospital",
    "gym": "Gym",
    "fitness_centre": "Gym",
    "supermarket": "Supermarket",
    "department_store": "Supermarket",
    "school": "School",
    "college": "School",
    "bank": "Bank",
    "atm": "Bank",
    "hotel": "Hotel"
}

df["mapped_category"] = df["category_raw"].map(category_mapping)

# Remove rows not matching your fixed categories
df = df[df["mapped_category"].notna()]

print("After category filtering:", len(df))

# ==============================
# STEP 2: MAP CATEGORY TO ID
# ==============================

# ⚠ Replace IDs according to your business_categories table
category_id_map = {
    "Emergency Services": 2,
    "Entertainment": 3,
    "Food & Hospitality": 4,
    "Corporate & IT": 5,
    "Public Amenities": 6,
    "Automobile Services": 7,
    "Retail Shop": 8,
    "Education": 9,
    "Logistics": 10,
    "Others...": 11
}

df["category_id"] = df["mapped_category"].map(category_id_map)

# ==============================
# STEP 3: PREPARE FINAL TABLE FORMAT
# ==============================

final_df = pd.DataFrame({
    "owner_id": random.randint(2, 50),  # adjust range if needed
    "category_id": df["category_id"],
    "business_name": df["business_name"],
    "description": df["description"],
    "address": df["address"],
    "city": df["city"],
    "latitude": df["latitude"],
    "longitude": df["longitude"],
    "is_verified": False,
    "created_at": datetime.now(),
    "status": "approved",
    "approved_by": 0
})

# Save final CSV
final_df.to_csv("business_listings_ready.csv", index=False)

print("Final CSV created successfully!")
