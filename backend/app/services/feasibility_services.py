from sqlalchemy import text

#=============== BUSINESS FEASIBILITY ENGINE ===============#
def calculate_feasibility(db, lat, lon, category_id):

    #competition query
    competition_query = """
        SELECT COUNT(*) FROM business_listings
        WHERE category_id = :category_id
        AND ST_DWithin(
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            1000
            ); 
    """

    competition = db.execute(text(competition_query), {"lat": lat, "lon": lon, "category_id": category_id}).scalar()

    #competition scoring criteria
    if competition == 0:
        competition_score = 40
    elif competition <= 3:
        competition_score = 25
    elif competition <= 7:
        competition_score = 10
    else:
        competition_score = 5

    #demographics query
    demographics_query = """
        SELECT population_density, average_income, commerical_index, growth_rate
        FROM area_demographics
        ORDER BY
            ST_Distance(
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
            )
        LIMIT 1;
    """

    demographics = db.execute(text(demographics_query), {"lat": lat, "lon": lon}).fetchone()

    if demographics:
        population, income, commercial_index, growth_rate = demographics
    else:
        population, income, commercial_index, growth_rate = None, None, 0, 0

    # Population scoring criteria
    if population is None:
        population_score = 0
    elif population > 10000:
        population_score = 30
    elif population > 5000:
        population_score = 20
    else:
        population_score = 10

    #income scoring criteria
    if income is None:
        income_score = 0
    elif income > 80000:
        income_score = 30
    elif income > 40000:
        income_score = 20
    else:
        income_score = 10


    total_score = competition_score + population_score + income_score

    #rating criteria
    if total_score >= 80:
        rating = "Excellent Area"
    elif total_score >= 60:
        rating = "Good Area"
    elif total_score >= 40:
        rating = "Average Area"
    else:
        rating = "High Risk Area"

    return {
        "competition_count": competition,
        "population_density": population,
        "average_income": income,
        "commercial_index": commercial_index,
        "growth_rate": growth_rate,
        "competition_score": competition_score,
        "population_score": population_score,
        "income_score": income_score,
        "total_score": total_score,
        "area_rating": rating
    }


#=============== COMPETITION ANALYSIS QUERY ===============#
def get_competition_analysis(db, lat, lon, category_id):

    #count competitors within 1km
    count_query = """
        SELECT COUNT(*) FROM business_listings
        WHERE category_id = :category_id
        AND ST_DWithin(
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326):: geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326):: geography,
            1000
        );
    """

    competiton_count = db.execute(text(count_query), {"lat": lat, "lon": lon, "category_id": category_id}).scalar()

    # list query including owner name and coordinates
    list_query = """
    SELECT bl.business_name, 
           bl.address, 
           bl.latitude,
           bl.longitude,
           u.username AS owner_name,
           bc.category_type,
           ST_Distance(
                ST_SetSRID(ST_MakePoint(bl.longitude, bl.latitude), 4326):: geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326):: geography           
           ) AS distance
           FROM business_listings bl
           LEFT JOIN users u ON bl.owner_id = u.id
           LEFT JOIN business_categories bc ON bl.category_id = bc.id
           WHERE bl.category_id = :category_id
           AND ST_DWithin(
                ST_SetSRID(ST_MakePoint(bl.longitude, bl.latitude), 4326):: geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326):: geography,
                1000
           )
           ORDER BY distance
           LIMIT 10;
    """

    competitors = db.execute(text(list_query), {"lat": lat, "lon": lon, "category_id": category_id}).fetchall()

    competitor_list = [
        {
            "business_name": row[0],
            "address": row[1],
            "latitude": row[2],
            "longitude": row[3],
            "owner_name": row[4] or "Unknown",
            "category_type": row[5],
            "distance_meters": round(row[6], 2)
        }
        for row in competitors
    ]

    return {
        "competition_count": competiton_count,
        "nearby_competitors": competitor_list 
    }