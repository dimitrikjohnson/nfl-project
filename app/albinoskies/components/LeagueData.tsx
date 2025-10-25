"use client";
import { useState } from "react";
import WeeklyScores from "@/app/albinoskies/components/WeeklyScores";
import WeeklyScoreRankings from "@/app/albinoskies/components/WeeklyScoreRankings";
import WeeklyMedianChart from "@/app/albinoskies/components/WeeklyMedianChart";
import H2 from "@/app/components/H2";
import ToggleButtons from "@/app/components/ToggleButtons";

export default function LeagueData() {
    const [recordMode, setRecordMode] = useState<string>("w/o Median"); // "w/o Median" or "w/ Median"

    const tableMargins = "md:mx-6 lg:mx-14 xl:mx-auto max-w-screen-xl";
    const margins = `mx-4 ${tableMargins}`;
    const h3Styling = `font-protest text-2xl lg:text-3xl pb-3 ${margins}`;

    return (
        <>
            <div className={`flex justify-between pb-2 mb-3 md:mb-9 border-b-2 border-primary dark:border-primary-dark ${margins}`}>
                <H2>League Stats</H2>  
                <ToggleButtons 
                    options={["w/o Median", "w/ Median"]}
                    extraClasses="hidden md:flex"
                    onChange={ setRecordMode }
                    valueToMatch={ recordMode }
                    renderLabel={(mode) => <span>Records {mode}</span>} // custom label
                />
            </div>
            <ToggleButtons 
                options={["w/o Median", "w/ Median"]}
                extraClasses={`flex md:hidden mb-9 ${margins} overflow-x-auto`}
                onChange={ setRecordMode }
                valueToMatch={ recordMode }
                renderLabel={(mode) => <span>Records {mode}</span>}
            />
            
            <div className="mb-8">
                <h3 className={ h3Styling }>Weekly Scores</h3>
                <WeeklyScores recordMode={recordMode} tableMargins={tableMargins} />    
            </div>
            <div className="mb-8">
                <h3 className={ h3Styling }>Score Rankings</h3>
                <WeeklyScoreRankings recordMode={recordMode} tableMargins={tableMargins} />
            </div>
            <div className={ margins }>
                <h3 className="font-protest text-2xl lg:text-3xl pb-3">Weekly Medians</h3>
                <WeeklyMedianChart />
            </div>
        </>
    )
}
