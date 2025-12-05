"use client";
import { useEffect, useState } from "react";
import getFantasyLeagueData from "@/app/apiCalls/getFantasyLeagueData";
import { User, Users } from "@/app/types/albinoskies";
import WeeklyTableHeader from "./WeeklyTableHeader";
import WeeklyTableRow from "./WeeklyTableRow";

interface WeeklyTableProps {
    sortMode: string;
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

export default function WeeklyTable({ sortMode, recordMode, tableMargins, extraHeaders, calcMinMax, renderCells, displayWeeks }: WeeklyTableProps) {
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
        <div className="w-full relative">
            <div className={`bg-section border border-gray-300 dark:bg-section-dark dark:border-none overflow-x-auto w-full md:rounded-md mb-2 ${tableMargins}`}>
                <table className="table-auto w-full text-nowrap text-sm border-collapse">
                    <WeeklyTableHeader weeks={ weeks } extraHeaders={ extraHeaders } />
                    <tbody>
                        { Object.entries(data)
                            .sort(([, a], [, b]) => sortUsers(a, b, sortMode, recordMode))
                            .map(([userID, user], index) => (
                                <WeeklyTableRow
                                    key={ userID }
                                    index={ index }
                                    recordMode={ recordMode }
                                    user={ user }
                                    weeks={ weeks }
                                >
                                    { renderCells(user, weeks, minMax?.[0], minMax?.[1]) }
                                </WeeklyTableRow>
                            ))
                        }
                    </tbody>
                </table>
            </div>    
        </div>
    );
}

function sortUsers(a: User, b: User, sortMode: string, recordMode: string) {
    if (sortMode == "record") {
        // determine which record type is needed (record or record with median)
        const aWins = recordMode == "with median" ? a.recordWithMedian.wins : a.record.wins;
        const bWins = recordMode == "with median" ? b.recordWithMedian.wins : b.record.wins;
        
        if (bWins !== aWins) {
            return bWins - aWins; // primary sort (wins)
        }    
    }
    
    /*
     * this will run if ...
     * a) the record of two users is the same (the points for is the tiebraker), or
     * b) the sortMode == "points scored"
    */
    return b.pointsFor - a.pointsFor;              
}
