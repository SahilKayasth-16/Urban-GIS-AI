#================= AI KEY WORD DETECTION TEMP =================#
def extract_intent(query: str):
    query_lower = query.lower()

    # Static category mapping
    if "cafe" in query_lower:
        category_id = 1
    elif "hospital" in query_lower:
        category_id = 2
    elif "school" in query_lower:
        category_id = 3
    else:
        category_id = 1  # default

    # City detection (basic)
    if "ahmedabad" in query_lower:
        city = "Ahmedabad"
    elif "surat" in query_lower:
        city = "Surat"
    else:
        city = "Ahmedabad"

    return category_id, city

#================= SIMPLE CITY -> LAT/LNG FUNCTION ===============#
def get_coordinates(city: str):
    city_coords = {
        "Ahmedabad": (23.0225, 72.5714),
        "Surat": (21.1702, 72.8311)
    }

    return city_coords.get(city, (23.0225, 72.5714))
