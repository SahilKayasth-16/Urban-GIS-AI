#================= AI KEY WORD DETECTION TEMP =================#
def extract_intent(query: str):
    query_lower = query.lower()

    category_keywords = {
        2: [#emergency services
        "hospital", "emergency", "ambulance", "police", "fire station", "clinic", "trauma", "medical emergency", "er", "dispensary"
        ],

        3: [#entertainment
        "movie", "cinema", "theatre", "mall", "gaming", "game zone", "amusement", "water park", "park", "zoo", "club", "bar", "pub", "bowling", "fun zone", "entertainment",
        ],

        4: [#food & hospitality
        "restaurant", "cafe", "food", "hotel", "dhaba", "eat", "dining", "bakery", "fast food", "pizza", "momos", "burger", "mess", "dining hall", "thela"
        ],

        5: [#corporate & IT
        "office", "company","it company", "non-it company", "corporate", "tech park", "startup", "business park", "software company", "bpo"
        ],

        6: [#public amenities
        "park", "gym", "fitness", "health club", "workout", "fitness center" "garden", "public toilet", "atm", "bank", "bus stand", "metro", "railway station", "post office", "goverment office", "library"
        ],

        7: [#automobile services
        "petrol pump", "cng pump", "gas station", "car repair", "bike repair", "truck repair", "bus repair", "mechanic", "garage", "showroom", "car service", "bike service", "bus service", "truck service", "car modification", "bike modification", "car rent", "bike rent", "vehicle repair", "fuel station", "wheel alignment", "tyre shop", "driving school"
        ],

        8: [#retail shop
        "shop", "store", "mall shop", "super market", "market", "grocery", "stationary", "clothing", "electronics shop", "electrical shop", "mobile shop", "medical store", "pharmacy"
        ],

        9: [#education
        "school", "tuition", "classes", "college", "university", "institute", "it training institute", "iti", "coaching", "academy", "hostel", "education center", "girls hostel", "boys hostel"
        ],

        10: [#logistics
        "courier", "delivery", "transport", "warehouse", "parcel", "shipping", "cargo", "logistics", "transport service"    
        ],

        11:[#others
        "service", "center", "facility"
        ]
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