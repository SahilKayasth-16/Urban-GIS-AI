import pandas as pd
import requests
import time

# === LOAD EXISTING CSV ===
input_file = "business_listings_ready.csv"
output_file = "business_listings_hybrid.csv"

df = pd.read_csv(input_file)

# === Function for Reverse Geocoding ===
def reverse_geocode(lat, lon):
    url = "https://nominatim.openstreetmap.org/reverse"
    
    params = {
        "lat": lat,
        "lon": lon,
        "format": "json",
        "addressdetails": 1
    }

    headers = {
        "User-Agent": "urban-gis-ai-internship-project"
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        data = response.json()

        if "address" in data:
            addr = data["address"]

            road = addr.get("road", "")
            suburb = addr.get("suburb", "")
            city = addr.get("city", addr.get("town", "Ahmedabad"))

            readable_address = ", ".join(
                part for part in [road, suburb, city] if part
            )

            return readable_address

        return "Ahmedabad"

    except Exception:
        return "Ahmedabad"


# === Generate Address Column ===
new_addresses = []

for index, row in df.iterrows():
    lat = row["latitude"]
    lon = row["longitude"]

    address = reverse_geocode(lat, lon)
    new_addresses.append(address)

    print(f"{index + 1}/{len(df)} processed")

    time.sleep(1)  # IMPORTANT: Respect OSM rate limit


# === Replace Address Column ===
df["address"] = new_addresses

# === Save New Hybrid CSV ===
df.to_csv(output_file, index=False)

print("✅ Hybrid dataset created successfully!")
