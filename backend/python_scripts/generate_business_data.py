import random
import pandas as pd
from faker import Faker

fake = Faker("en_IN")

# ---------- CONFIG ----------
TOTAL_ROWS = 6500
CITY_NAME = "Ahmedabad"

areas = [
    "Thaltej", "Bopal", "Navrangpura", "Chandkheda", "Gota", "Nikol",
    "Prahladnagar", "SG Highway", "Paldi", "Ranip", "Meghaninagar",
    "Nirnaynagar", "Sabarmati", "Maninagar", "Kankaria", "Chandola",
    "Bapunagar", "Naroda", "Satellite", "Vastrapur",
    "Ashram Road", "Ellis Bridge"
]

categories = [
    "Emergency Services",
    "Entertainment",
    "Food & Hospitality",
    "Corporate & IT",
    "Public Amenities",
    "Automobile Services",
    "Retail Shop",
    "Education",
    "Logistics",
    "Others"
]

business_names_by_category = {
    "Emergency Services": ["Ambulance Service", "24x7 Clinic", "Fire Safety Solutions"],
    "Entertainment": ["Cinema Hall", "Gaming Zone", "Event Management"],
    "Food & Hospitality": ["Restaurant", "Cafe", "Bakery", "Hotel"],
    "Corporate & IT": ["IT Solutions", "Software Company", "Consulting Firm"],
    "Public Amenities": ["Community Center", "Public Library", "Sports Complex"],
    "Automobile Services": ["Car Garage", "Bike Service Center", "Car Wash"],
    "Retail Shop": ["Supermarket", "Clothing Store", "Electronics Shop"],
    "Education": ["Coaching Center", "School", "Training Institute"],
    "Logistics": ["Courier Service", "Transport Company", "Warehouse"],
    "Others": ["General Store", "Service Provider"]
}

data = []

for i in range(TOTAL_ROWS):
    category = random.choice(categories)
    area = random.choice(areas)
    owner = fake.name()

    base_name = random.choice(business_names_by_category[category])
    business_name = f"{area} {base_name} {random.randint(1,9999)}"

    description = fake.sentence(nb_words=18)

    address = f"Shop {random.randint(1,200)}, Near {fake.street_name()}, {area}"

    # Ahmedabad coordinate range
    latitude = round(random.uniform(22.90, 23.15), 6)
    longitude = round(random.uniform(72.45, 72.75), 6)

    data.append([
        owner,
        business_name,
        category,
        description,
        address,
        CITY_NAME,
        latitude,
        longitude
    ])

df = pd.DataFrame(data, columns=[
    "owner_name",
    "business_name",
    "category",
    "description",
    "address",
    "city",
    "latitude",
    "longitude"
])

df.to_csv("ahmedabad_business_data.csv", index=False)

print("✅ CSV file generated: ahmedabad_business_data.csv")
