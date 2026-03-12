from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()

@router.get("/analytics/overview")
def analytics_overview(db: Session = Depends(get_db)):
    
    query = text("""
        SELECT 
            p.area_name,
            p.population,
            p.area_sq_km,
            ROUND(
                (p.population::numeric / NULLIF(p.area_sq_km, 0)::numeric),
                2
            ) AS population_density,
            ROUND(
                (
                    u.water_supply_score +
                    u.electricity_score +
                    u.sewage_score +
                    u.road_connectivity_score +
                    u.internet_score
                )::numeric / 5,
                1
            ) AS utility_index
        FROM area_population p
        JOIN area_utilities u
            ON p.area_name = u.area_name;
    """)

    result = db.execute(query)
    rows = result.fetchall()

    return {
        "city": "Ahmedabad",
        "results": [
            {
                "area": r[0],
                "population": r[1],
                "area_sq_km": r[2],
                "population_density": r[3],
                "utility_index": r[4]
            }
            for r in rows
        ]
    }

#=================== API FOR BUSINESS CATEGORY DISTRIBUTION BY PIECHART ===================#
@router.get("/analytics/business-categories")
def business_category_distribution(db: Session = Depends(get_db)):

    query = text("""
    SELECT bc.category_type, COUNT(bl.id) AS total
    FROM business_listings bl
    JOIN business_categories bc
    ON bl.category_id = bc.id
    GROUP BY bc.category_type
    ORDER BY total DESC;
    """)

    result = db.execute(query).fetchall()

    data = [
        {"category": row[0], "count": row[1]}
        for row in result
    ]

    return data
   
#==================== COMPETITOR DENSITY MAP BY HEATMAP ===================#
@router.get("/analytics/business-heatmap")
def business_heatmap(db: Session = Depends(get_db)):
    
    query = text("""
    SELECT latitude, longitude
    FROM business_listings
    WHERE latitude IS NOT NULL
    AND longitude IS NOT NULL
    AND status = 'approved';
    """)

    result = db.execute(query).fetchall()

    data = [
        {"lat": row[0], "lng": row[1]}
        for row in result
    ]

    return data