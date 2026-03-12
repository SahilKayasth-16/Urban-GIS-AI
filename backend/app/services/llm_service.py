import requests

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

def generate_ai_response(query, analysis_result):
    prompt = f"""
    You are an Urban GIS AI Assistant.

    User query: {query}

    Analysis result (JSON): {analysis_result}

    Give clear recommendations including:

    • Market potential
    • Suitable locations
    • Competition insights
    • Risks
    • Suggestions for success
    """

    payload = {
        "model": "phi3:latest",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        if response.status_code == 200:
            return response.json().get("response", "No response from AI")
    except Exception as e:
        print(f"LLM Error: {e}")
    
    return "AI service Unavaliable"

def generate_report_recommendation(analysis_data: dict):
    prompt = f"""
    You are an Urban Planning Consultant. Based on the following GIS data, provide a professional feasibility analysis and 3-5 strategic recommendations for a new business.

    Data:
    - Area: {analysis_data.get('area_name')}
    - Population Density: {analysis_data.get('population_density')}
    - Average Income: {analysis_data.get('average_income')}
    - Commercial Index: {analysis_data.get('commercial_index')}
    - Growth Rate: {analysis_data.get('growth_rate')}
    - Competition Count: {analysis_data.get('competition_count')}
    - Final Score: {analysis_data.get('final_score')}/100
    - Rating: {analysis_data.get('area_rating')}

    Requirements:
    - 2-3 sentences of overall analysis.
    - 3-5 clear, actionable bullet points (use • symbol).
    - Be professional and data-driven.
    - No emojis.
    - No markdown formatting (just plain text with bullets).
    """

    payload = {
        "model": "phi3:latest",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        if response.status_code == 200:
            return response.json().get("response", "No response from AI")
    except Exception as e:
        print(f"LLM Error: {e}")
    
    return "AI service temporarily unavailable. Please try again later."