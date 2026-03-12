import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid,
    PieChart, Pie, Cell, Legend,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ReportGraph = ({ metrics, competition_details }) => {
    if (!metrics) return null;

    // 1. Bar Chart Data (Population & Income)
    const populationIncomeData = [
        { name: "Population Density", value: metrics.population_density },
        { name: "Average Income", value: metrics.average_income / 10 }, // Scaling for comparison
    ];

    // 2. Line Chart Data (Growth Rate - Simulated trend)
    const growthData = [
        { year: "2022", rate: (metrics.growth_rate * 0.8).toFixed(2) },
        { year: "2023", rate: (metrics.growth_rate * 0.9).toFixed(2) },
        { year: "2024", rate: (metrics.growth_rate).toFixed(2) },
        { year: "2025", rate: (metrics.growth_rate * 1.1).toFixed(2) },
        { year: "2026", rate: (metrics.growth_rate * 1.25).toFixed(2) },
    ];

    // 3. Pie Chart Data (Competition)
    const competitionData = [
        { name: "Existing Businesses", value: metrics.competition_count || 0 },
        { name: "Market Gap", value: Math.max(0, 10 - (metrics.competition_count || 0)) },
    ];

    // 4. Radar Chart Data (Area Scores)
    const radarData = [
        { subject: "Competition", A: metrics.competition_score, fullMark: 40 },
        { subject: "Population", A: metrics.population_score, fullMark: 30 },
        { subject: "Income", A: metrics.income_score, fullMark: 30 },
        { subject: "Growth", A: (metrics.growth_rate * 8), fullMark: 100 }, // Normalized
        { subject: "Commercial", A: (metrics.commercial_index * 10), fullMark: 100 },
    ];

    return (
        <div className="dashboard-grid">
            {/* Bar Chart: Population & Income */}
            <div className="chart-card">
                <h3>👥 Population & Income Analysis</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={populationIncomeData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Line Chart: Growth Rate */}
            <div className="chart-card">
                <h3>📈 Growth Rate Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="#82ca9d" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart: Competition */}
            <div className="chart-card">
                <h3>🏢 Competition Overview</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={competitionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {competitionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Radar Chart: Area Score */}
            <div className="chart-card">
                <h3>🎯 Area Feasibility Score</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Area Score" dataKey="A" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ReportGraph;
