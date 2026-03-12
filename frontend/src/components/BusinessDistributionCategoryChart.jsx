import React, { useEffect, useState} from "react";
import axios from  "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
    "#00C49F",
    "#0088FE",
    "#FFBB28",
    "#FF8042",
    "#AA66CC",
    "#33B5E5",
    "#FF4444",
    "#99CC00",
    "#6f9689",
    "#2BBBAD",
];

const BusinessCategoryChart = () => {
    const [ data, setData ] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/analytics/business-categories")
             .then((res) => setData(res.data))
             .catch((err) => console.error(err));
    }, []);

    return (
        <>
        <div style={{ textAlign: "center"}}>
            <h3>Business Category Distribution</h3>

            <PieChart width={500} height={500}>
                <Pie data={data} dataKey="count" nameKey="category" cx="50%" cy="50%">
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
        </>
    );
};

export default BusinessCategoryChart;