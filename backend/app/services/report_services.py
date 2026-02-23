from sqlalchemy import text
from datetime import datetime


def generate_report(db, analysis_data):

    #Fetch template
    template_query = """
        SELECT template_text
        FROM report_templates
        WHERE template_name = :template_name
        LIMIT 1;
    """

    template = db.execute(
        text(template_query),
        {"template_name": "standard_ai_report"}
    ).scalar()

    if not template:
        return "Report template not found."

    #Generate AI recommendation logic
    if analysis_data["final_score"] >= 80:
        recommendations = "Excellent business opportunity with strong growth potential."
    elif analysis_data["final_score"] >= 60:
        recommendations = "Good area with moderate competition and steady demand."
    elif analysis_data["final_score"] >= 40:
        recommendations = "Average area. Careful business positioning required."
    else:
        recommendations = "High risk area. Business entry not recommended."

    #Replace placeholders dynamically
    report_text = template.replace("{{area_name}}", str(analysis_data["area_name"])) \
        .replace("{{category_id}}", str(analysis_data["category_id"])) \
        .replace("{{population_density}}", str(analysis_data["population_density"])) \
        .replace("{{average_income}}", str(analysis_data["average_income"])) \
        .replace("{{commercial_index}}", str(analysis_data["commercial_index"])) \
        .replace("{{growth_rate}}", str(analysis_data["growth_rate"])) \
        .replace("{{competition_count}}", str(analysis_data["competition_count"])) \
        .replace("{{competition_score}}", str(analysis_data["competition_score"])) \
        .replace("{{population_score}}", str(analysis_data["population_score"])) \
        .replace("{{income_score}}", str(analysis_data["income_score"])) \
        .replace("{{final_score}}", str(analysis_data["final_score"])) \
        .replace("{{area_rating}}", str(analysis_data["area_rating"])) \
        .replace("{{recommendations}}", recommendations)

    return report_text
