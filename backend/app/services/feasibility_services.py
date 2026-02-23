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

    #population query
    population_query = """
        SELECT population_density
        FROM area_demographics
        ORDER BY
            ST_Distance(
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
            )
        LIMIT 1;
    """

    population = db.execute(text(population_query),{"lat": lat, "lon": lon}).scalar()

    # Population scoring criteria
    if population is None:
        population_score = 0
    elif population > 10000:
        population_score = 30
    elif population > 5000:
        population_score = 20
    else:
        population_score = 10

    #income query
    income_query = """
        SELECT average_income
        FROM area_demographics
        ORDER BY
            ST_Distance(
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
            )
        LIMIT 1;
    """

    income = db.execute(
        text(income_query),
        {"lat": lat, "lon": lon}
    ).scalar()

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

    #list query
    list_query = """
    SELECT business_name, 
           address, 
           ST_Distance(
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326):: geography,
                ST_SetSRID(ST_MAKEpOINT(:lon, :lat), 4326):: geography           
           ) AS distance
           FROM business_listings WHERE category_id = :category_id
           ORDER BY distance
           LIMIT 5;
    """

    competitors = db.execute(text(list_query), {"lat": lat, "lon": lon, "category_id": category_id}).fetchall()

    competitor_list = [
        {
            "business_name": row[0],
            "address": row[1],
            "distance_meters": round(row[2], 2)
        }
        for row in competitors
    ]

    return {
        "competition_count": competiton_count,
        "nearby_competitors": competitor_list 
    }