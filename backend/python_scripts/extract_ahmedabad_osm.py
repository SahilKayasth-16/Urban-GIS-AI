import osmnx as ox
import pandas as pd

# Step 1: Define City
place_name = "Ahmedabad, Gujarat, India"

print("Downloading Ahmedabad boundary...")
gdf_place = ox.geocode_to_gdf(place_name)

# Step 2: Define business-related tags
tags = {
    "amenity": True,
    "shop": True,
    "leisure": True,
    "office": True
}

print("Downloading business data from OpenStreetMap...")
gdf = ox.features_from_place(place_name, tags)

print("Total raw records downloaded:", len(gdf))

# Step 3: Keep only useful columns
gdf = gdf.reset_index()

columns_to_keep = [
    "name",
    "amenity",
    "shop",
    "leisure",
    "office",
    "geometry"
]

gdf = gdf[columns_to_keep]

# Step 4: Extract latitude & longitude
gdf["latitude"] = gdf.geometry.centroid.y
gdf["longitude"] = gdf.geometry.centroid.x

# Step 5: Create single category column
def get_category(row):
    if pd.notna(row["amenity"]):
        return row["amenity"]
    if pd.notna(row["shop"]):
        return row["shop"]
    if pd.notna(row["leisure"]):
        return row["leisure"]
    if pd.notna(row["office"]):
        return row["office"]
    return "other"

gdf["category"] = gdf.apply(get_category, axis=1)

# Step 6: Clean data
gdf = gdf.dropna(subset=["name"])
gdf = gdf.drop_duplicates(subset=["name", "latitude", "longitude"])

# Step 7: Add city column
gdf["city"] = "Ahmedabad"

# Step 8: Rename columns to match your schema
final_df = pd.DataFrame({
    "owner_name": "Unknown",
    "business_name": gdf["name"],
    "description": "Extracted from OpenStreetMap",
    "address": "Ahmedabad",
    "city": gdf["city"],
    "latitude": gdf["latitude"],
    "longitude": gdf["longitude"],
    "category_raw": gdf["category"]
})

print("Cleaned records:", len(final_df))

# Step 9: Save CSV
final_df.to_csv("ahmedabad_osm_businesses.csv", index=False)

print("CSV file created successfully!")
