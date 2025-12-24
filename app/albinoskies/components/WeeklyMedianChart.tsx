"use client";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import type { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import getFantasyLeagueData from "@/app/apiCalls/getFantasyLeagueData";

// register chart.js components once
ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function WeeklyMedianChart({ leagueID }:{ leagueID: string }) {
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const getMedians = () => (getFantasyLeagueData(leagueID)).then(
        (res) => {
            const medians = res.medians;

            const weeks = res.completedWeeks.map(week => ({
                data: medians[week],
                label: `Week ${week}`
            }));
            
            const data = {
                labels: weeks.map(week => week.label),
                datasets: [
                    {
                        data: weeks.map(week => week.data),
                        label: "Median Score",
                        fill: true,
                        borderColor: "#22d3ee",
                        backgroundColor: "rgba(34, 211, 238, 0.2)",
                        tension: 0.3,
                        pointRadius: 4,
                        pointHitRadius: 8,
                        pointHoverRadius: 6
                    }
                ]
            };   
            setChartData(data);
        }
    );

    useEffect(() => {
        getMedians();

        // Watch system dark mode preference
        const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => setIsDarkMode(darkQuery.matches);

        setIsDarkMode(darkQuery.matches);
        darkQuery.addEventListener("change", handleChange);

        return () => darkQuery.removeEventListener("change", handleChange);
    }, [leagueID]);

    // define colors
    const tickColor = isDarkMode ? "#B3B3B3" : "#4B5563"; // Tailwind: gray-600 in light, lighterSecondaryGrey in dark
    const lineColor = isDarkMode ? "rgb(179, 179, 179, 0.1)" : "rgb(75, 85, 99, 0.1)"; // same values but in RGB
    
    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "bottom", labels: { color: tickColor } },
            title: { display: false, text: "Weekly Median Fantasy Scores" }
        },
        scales: {
            x: {
                title: { display: true, text: "Week", color: tickColor },
                grid: { display: false },
                ticks: { color: tickColor }
            },
            y: {
                title: { display: true, text: "Median Score", color: tickColor },
                grid: { display: true, color: lineColor },
                beginAtZero: false,
                ticks: { color: tickColor }
            }
        }
    };

    if (!chartData) return null;

    return (
        <div className="w-full h-[400px]">
            <Line data={chartData} options={options} />
        </div>
    );
}
