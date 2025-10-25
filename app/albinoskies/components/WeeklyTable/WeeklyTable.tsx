"use client";
import { useEffect, useState } from "react";
import getFantasyLeagueData from "@/app/apiCalls/getFantasyLeagueData";
import { User, Users } from "@/app/types/albinoskies";
import WeeklyTableHeader from "./WeeklyTableHeader";
import WeeklyTableRow from "./WeeklyTableRow";

interface WeeklyTableProps {
    recordMode: string;
    tableMargins: string;
    extraHeaders?: React.ReactNode;
    calcMinMax?: (users: Users) => [number, number];
    renderCells: (
        user: User,
        weeks: number[],
        minTotal?: number,
        maxTotal?: number
    ) => React.ReactNode;
    displayWeeks: "all" | "completed"
}

export default function WeeklyTable({ recordMode, tableMargins, extraHeaders, calcMinMax, renderCells, displayWeeks }: WeeklyTableProps) {
    const [data, setData] = useState<Users>({});
    const [weeks, setWeeks] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [minMax, setMinMax] = useState<[number, number] | null>(null);
    
    useEffect(() => {
        getFantasyLeagueData().then((res) => {
            const validWeeks = displayWeeks == "all" 
                ? res.allWeeks.filter((week) => {
                    // get all scores for this week
                    const weekScores = Object.values(res.users).map((user) => user.scores[week]);

                    // if every score is 0, exclude this week
                    const allZero = weekScores.every((score) => score === 0);

                    // only include if not all scores are zero
                    return !allZero;
                })
                : res.completedWeeks
            ;
                    
            setWeeks(validWeeks);
            setData(res.users);

            if (calcMinMax) 
                setMinMax(calcMinMax(res.users));

            setLoading(false);
        });
    }, []);

    if (loading)
        return <div className={`skeleton w-full rounded-md h-80 ${tableMargins}`}></div>;

    return (
        <div className={`bg-section border border-gray-300 dark:bg-section-dark dark:border-none overflow-x-auto md:rounded-md mb-2 ${tableMargins}`}>
            <table className="table-auto w-full text-nowrap overflow-hidden text-sm">
                <WeeklyTableHeader weeks={ weeks } extraHeaders={ extraHeaders } />
                <tbody>
                    { Object.entries(data).map(([userID, user], index) => (
                        <WeeklyTableRow
                            key={ userID }
                            index={ index }
                            recordMode={ recordMode }
                            user={ user }
                            weeks={ weeks }
                        >
                            { renderCells(user, weeks, minMax?.[0], minMax?.[1]) }
                        </WeeklyTableRow>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
