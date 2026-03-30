#================= AI KEY WORD DETECTION TEMP =================#
def extract_intent(query: str):
    query_lower = query.lower()

    category_keywords = {

    2: [  # emergency services
        "hospital", "hospitals", "emergency", "ambulance", "police", "police station",
        "fire station", "clinic", "trauma", "medical emergency", "er", "dispensary",
        "icu", "nursing home", "urgent care", "blood bank", "chemist emergency"
    ],

    3: [  # entertainment
        "movie", "movies", "cinema", "theatre", "mall", "gaming", "game zone",
        "amusement", "water park", "park", "zoo", "club", "bar", "pub",
        "bowling", "fun zone", "entertainment", "arcade", "nightlife",
        "resort", "theme park", "concert", "event", "stadium", "sports complex"
    ],

    4: [  # food & hospitality
        "restaurant", "restaurants", "cafe", "cafes", "food", "hotel", "dhaba",
        "eat", "eating", "dining", "bakery", "fast food", "pizza", "momos",
        "burger", "mess", "dining hall", "thela", "street food", "tiffin",
        "chai", "tea stall", "coffee shop", "fine dining", "buffet", "lunch",
        "dinner", "breakfast", "snacks", "food court", "chai", "tapri", "tea stall", 
        "nashta", "snacks", "thali",
        "gujarati thali", "punjabi dhaba", "south indian", "idli", "dosa",
        "vada pav", "pav bhaji", "biryani", "tiffin service", "home food"
    ],

    5: [  # corporate & IT
        "office", "company", "it company", "non-it company", "corporate",
        "tech park", "startup", "business park", "software company", "bpo",
        "firm", "enterprise", "workspace", "coworking", "co-working",
        "tech hub", "it park", "consultancy", "agency"
    ],

    6: [  # public amenities
        "park", "garden", "gym", "gyms", "fitness", "health club", "workout",
        "fitness center", "public toilet", "atm", "bank", "bus stand",
        "bus stop", "metro", "railway station", "train station",
        "post office", "government office", "govt office", "library",
        "community hall", "public service", "charging station", 
        "sarkari office", "nagarpalika", "municipal office",
        "ration office", "aadhar center", "passport office",
        "electricity office", "water office"
    ],

    7: [  # automobile services
        "petrol pump", "cng pump", "gas station", "fuel station",
        "car repair", "bike repair", "truck repair", "bus repair",
        "mechanic", "garage", "showroom", "car service", "bike service",
        "vehicle repair", "car wash", "bike wash", "tyre shop",
        "wheel alignment", "puncture shop", "driving school",
        "car rental", "bike rental", "auto service", "spare parts"
    ],

    8: [  # retail shop
        "shop", "store", "mall shop", "supermarket", "market",
        "grocery", "kirana", "stationery", "clothing", "clothes",
        "fashion", "electronics shop", "electrical shop", "mobile shop",
        "medical store", "pharmacy", "chemist", "department store",
        "furniture shop", "hardware store", "gift shop", "bookstore", 
        "kirana", "general store", "ration shop", "sabji mandi",
        "vegetable market", "fruit market", "pan shop", "paan shop",
        "dairy", "milk booth"
    ],

    9: [  # education
        "school", "tuition", "classes", "college", "university",
        "institute", "training institute", "iti", "coaching",
        "academy", "hostel", "education center", "learning center",
        "girls hostel", "boys hostel", "pg", "paying guest",
        "library study", "online classes"
    ],

    10: [  # logistics
        "courier", "delivery", "transport", "warehouse", "parcel",
        "shipping", "cargo", "logistics", "transport service",
        "packer", "mover", "packers and movers", "freight",
        "distribution", "supply chain"
    ],

    11: [  # others
        "service", "center", "facility", "place", "location", "area"
    ],

    }

    import re

# -------- FIND MATCH -------- #

    for category_id, keywords in category_keywords.items():
        for keyword in keywords:
            # Match whole words only to avoid partial matches (e.g., "er" in "store")
            pattern = fr"\b{re.escape(keyword)}\b"
            if re.search(pattern, query_lower):
                detected_category = category_id
                break
        else:
            continue
        break
    else:
        detected_category = 11  # Others (default)

    # -------- CITY DETECTION -------- #

    if "ahmedabad" in query_lower:
        city = "Ahmedabad"
    else:
        city = "Ahmedabad"
    return detected_category, city


# ================= CITY → COORDINATES ================= #
def get_coordinates(city: str):
    city_coords = {
        "Ahmedabad": (23.0225, 72.5714)
    }

    return city_coords.get(city, (23.0225, 72.5714))