import pandas as pd
import random

areas = [
    "Thaltej", "Bopal", "Navrangpura", "Chandkheda", "Gota",
    "Nikol", "Prahladnagar", "SG Highway", "Paldi", "Ranip",
    "Meghaninagar", "Nirnaynagar", "Sabarmati", "Maninagar",
    "Kankaria", "Chandola", "Bapunagar", "Naroda",
    "Satellite", "Vastrapur", "Ashram Road", "Ellis Bridge"
]

data = []

for i, area in enumerate(areas, start=1):
    population = random.randint(50000, 250000)   # realistic ward-level population
    area_sq_km = round(random.uniform(2.0, 12.0), 2)

    data.append({
        "id": i,
        "area_name": area,
        "population": population,
        "area_sq_km": area_sq_km,
        "geom": None  # keep NULL for now
    })

df = pd.DataFrame(data)

df.to_csv("ahmedabad_area_population.csv", index=False)

print("✅ area_population CSV generated successfully!")
