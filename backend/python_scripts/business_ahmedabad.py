import pandas as pd

osm_to_category = {

    # ---------------- Education ----------------
    "school": "Education",
    "college": "Education",
    "university": "Education",
    "library": "Education",
    "kindergarten": "Education",
    "tuition": "Education",

    # ---------------- Emergency ----------------
    "hospital": "Emergency Services",
    "clinic": "Emergency Services",
    "police": "Emergency Services",
    "fire_station": "Emergency Services",
    "ambulance": "Emergency Services",
    "pharmacy": "Emergency Services",

    # ---------------- Food ----------------
    "restaurant": "Food & Hospitality",
    "cafe": "Food & Hospitality",
    "fast_food": "Food & Hospitality",
    "bar": "Food & Hospitality",
    "hotel": "Food & Hospitality",
    "bakery": "Food & Hospitality",

    # ---------------- Entertainment ----------------
    "cinema": "Entertainment",
    "theatre": "Entertainment",
    "park": "Entertainment",
    "gym": "Entertainment",
    "stadium": "Entertainment",
    "mall": "Entertainment",

    # ---------------- Corporate & IT ----------------
    "office": "Corporate & IT",
    "it": "Corporate & IT",
    "software": "Corporate & IT",
    "coworking_space": "Corporate & IT",
    "bank": "Corporate & IT",

    # ---------------- Public ----------------
    "government": "Public Amenities",
    "post_office": "Public Amenities",
    "municipality": "Public Amenities",
    "public_building": "Public Amenities",
    "community_centre": "Public Amenities",

    # ---------------- Automobile ----------------
    "car_repair": "Automobile Services",
    "fuel": "Automobile Services",
    "car_wash": "Automobile Services",
    "garage": "Automobile Services",
    "parking": "Automobile Services",

    # ---------------- Retail ----------------
    "supermarket": "Retail Shop",
    "clothes": "Retail Shop",
    "electronics": "Retail Shop",
    "mobile": "Retail Shop",
    "grocery": "Retail Shop",
    "jewelry": "Retail Shop",
    "bookstore": "Retail Shop",
    "hardware": "Retail Shop",

    # ---------------- Logistics ----------------
    "warehouse": "Logistics",
    "courier": "Logistics",
    "transport": "Logistics",
    "shipping": "Logistics",

}

category_id_lookup = {
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


# Load OSM file
df = pd.read_csv("ahmedabad_osm_businesses.csv")

# Normalize category_raw
df["category_raw"] = df["category_raw"].str.lower().str.strip()

# Map OSM → category name
df["mapped_category"] = df["category_raw"].map(osm_to_category)

# Fill unmapped as Others
df["mapped_category"] = df["mapped_category"].fillna("Others...")

# Map category → category_id
df["category_id"] = df["mapped_category"].map(category_id_lookup)

# Final required columns
final_df = pd.DataFrame({
    "owner_id": 1,   # or random owner later
    "category_id": df["category_id"],
    "business_name": df["business_name"],
    "description": df["description"],
    "address": df["address"],
    "city": "Ahmedabad",
    "latitude": df["latitude"],
    "longitude": df["longitude"],
    "is_verified": True,
    "created_at": pd.Timestamp.now(),
    "status": "approved",
    "approved_by": None   # IMPORTANT: NOT 0
})

# Remove rows where lat/lon missing
final_df = final_df.dropna(subset=["latitude", "longitude"])

# Save
final_df.to_csv("business_listings_ready.csv", index=False)

print("Final CSV generated successfully!")
