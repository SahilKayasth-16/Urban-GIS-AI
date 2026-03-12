# Urban GIS AI

Urban GIS AI is a web-based platform developed to support urban planning and business decision-making using Geographic Information Systems (GIS) and artificial intelligence. The system allows users to analyze locations on an interactive map and receive insights about business feasibility, nearby competitors, and surrounding facilities. It aims to help individuals and businesses choose suitable locations for starting new businesses.

The platform provides different dashboards for administrators, business owners, and general users. Users can select locations on the map, view area analytics, and get AI-generated recommendations based on nearby infrastructure and business density. The system also includes analytics visualizations such as business category distribution and competitor density heatmaps.

## Features

* Interactive map-based location selection
* Business feasibility analysis for selected locations
* AI-powered recommendations for business setup
* Business category distribution analytics (Pie Chart)
* Competitor density visualization (Heat Map)
* Role-based dashboards (Admin, Business Owner, User)
* Business registration and approval system
* User authentication and profile management
* Report generation and export as PDF

## Technology Stack

Frontend
React + Vite

Backend
Python + FastAPI

Database
PostgreSQL

Database Management Tool
pgAdmin 4

Mapping Library
MapLibre GL JS

Data Visualization
Recharts

## Project Structure

```
urban_gis_ai
│
├── frontend        # React + Vite frontend
├── backend         # FastAPI backend
├── database        # PostgreSQL database
└── README.md
```

## Installation and Setup

Clone the repository

```
git clone https://github.com/yourusername/urban-gis-ai.git
```

Backend setup

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend setup

```
cd frontend
npm install
npm run dev
```

Open the application in browser

```
http://localhost:5173
```

## Future Improvements

* Integration with real-time GIS datasets
* Advanced AI-based urban planning recommendations
* Mobile responsive version
* Enhanced business analytics dashboard

## Author

Sahil Kayasth
