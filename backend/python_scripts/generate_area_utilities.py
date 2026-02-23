import pandas as pd
import random

areas = [
    "Thaltej", "Bopal", "Navrangpura", "Chandkheda", "Gota",
    "Nikol", "Prahladnagar", "SG Highway", "Paldi", "Ranip",
    "Meghaninagar", "Nirnaynagar", "Sabarmati", "Maninagar",
    "Kankaria", "Chandola", "Bapunagar", "Naroda",
    "Satellite", "Vastrapur", "Ashram Road", "Ellis Bridge"
]

premium_areas = [
    "SG Highway", "Satellite", "Prahladnagar",
    "Thaltej", "Vastrapur", "Ashram Road",
    "Ellis Bridge", "Navrangpura"
]

mid_areas = [
    "Chandkheda", "Gota", "Paldi",
    "Maninagar", "Sabarmati", "Bopal"
]

data = []

for i, area in enumerate(areas, start=1):

    # Assign score ranges based on area type
    if area in premium_areas:
        water = random.randint(8, 10)
        electricity = random.randint(8, 10)
        sewage = random.randint(7, 9)
        road = random.randint(8, 10)
        internet = random.randint(8, 10)

    elif area in mid_areas:
        water = random.randint(6, 8)
        electricity = random.randint(6, 8)
        sewage = random.randint(5, 7)
        road = random.randint(6, 8)
        internet = random.randint(6, 8)

    else:  # developing areas
        water = random.randint(4, 7)
        electricity = random.randint(5, 7)
        sewage = random.randint(4, 6)
        road = random.randint(5, 7)
        internet = random.randint(5, 7)

    data.append({
        "id": i,
        "area_name": area,
        "water_supply_score": water,
        "electricity_score": electricity,
        "sewage_score": sewage,
        "road_connectivity_score": road,
        "internet_score": internet
    })

df = pd.DataFrame(data)

df.to_csv("ahmedabad_area_utilities.csv", index=False)

print("✅ area_utilities CSV generated successfully!")
