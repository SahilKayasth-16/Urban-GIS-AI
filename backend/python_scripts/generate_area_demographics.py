import pandas as pd
import random

# 22 Selected Areas (Ahmedabad)
areas = [
    "Thaltej", "Bopal", "Navrangpura", "Chandkheda", "Gota", "Nikol",
    "Prahladnagar", "SG Highway", "Paldi", "Ranip", "Meghaninagar",
    "Nirnaynagar", "Sabarmati", "Maninagar", "Kankaria", "Chandola",
    "Bapunagar", "Naroda", "Satellite", "Vastrapur",
    "Ashram Road", "Ellis Bridge"
]

area_data = []

for area in areas:
    data = {
        "area_name": area,
        # Ahmedabad coordinate range
        "latitude": round(random.uniform(23.00, 23.20), 6),
        "longitude": round(random.uniform(72.45, 72.70), 6),

        # Hybrid demographic values
        "population_density": random.randint(4000, 15000),
        "average_income": random.randint(30000, 120000),
        "commercial_index": random.randint(3, 10),
        "growth_rate": round(random.uniform(2.0, 12.0), 2)
    }

    area_data.append(data)   # ✅ Correct variable

area_df = pd.DataFrame(area_data)

# Save CSV
area_df.to_csv("area_demographics_hybrid.csv", index=False)

print("✅ area_demographics_hybrid.csv generated successfully")
print("Total Areas:", len(area_df))
