"use client";
import { useState } from "react";
import WeeklyScores from "@/app/albinoskies/components/WeeklyScores";
import WeeklyScoreRankings from "@/app/albinoskies/components/WeeklyScoreRankings";
import WeeklyMedianChart from "@/app/albinoskies/components/WeeklyMedianChart";
import H2 from "@/app/components/H2";
import ToggleButtons from "@/app/components/ToggleButtons";

export default function LeagueData() {
    const [recordMode, setRecordMode] = useState<string>("without median"); // "without median" or "with median"
    const [sortMode, setSortMode] = useState<string>("record"); // "record" or "points scored"

    const tableMargins = "md:mx-6 lg:mx-14 xl:mx-auto max-w-screen-xl";
    const margins = `mx-4 ${tableMargins}`;
    const h3Styling = `font-protest text-2xl lg:text-3xl pb-3 ${margins}`;

    return (
        <>
            <div className={`flex justify-between pb-2 mb-3 md:mb-9 border-b-2 border-primary dark:border-primary-dark ${margins}`}>
                <div className="flex items-end">
                    <H2>League Stats</H2>    
                </div>
        
                <div aria-label="Sorting and filters" className="hidden md:flex gap-5">
                    <ToggleButtonsContainer labelAbove={ "Sort by" }> 
                        <ToggleButtons 
                            options={["record", "points scored"]} 
                            onChange={ setSortMode } 
                            valueToMatch={ sortMode } 
                        /> 
                    </ToggleButtonsContainer>
                    
                    <ToggleButtonsContainer labelAbove={ "Record type" }> 
                        <ToggleButtons 
                            options={["without median", "with median"]}
                            extraClasses="hidden md:flex"
                            onChange={ setRecordMode }
                            valueToMatch={ recordMode }
                        /> 
                    </ToggleButtonsContainer>   
                </div>  
            </div>
            <div className={`md:hidden mb-9 ${margins}`}>
                <ToggleButtonsContainer labelAbove={ "Sort by" }> 
                    <ToggleButtons 
                        options={["record", "points scored"]}
                        extraClasses="mb-5"
                        onChange={ setSortMode }
                        valueToMatch={ sortMode }
                        fullWidth={ true }
                    /> 
                </ToggleButtonsContainer>

                <ToggleButtonsContainer labelAbove={ "Record type" }> 
                    <ToggleButtons 
                        options={["without median", "with median"]}
                        extraClasses="overflow-x-auto"
                        onChange={ setRecordMode }
                        valueToMatch={ recordMode }
                        fullWidth={ true }
                    />
                </ToggleButtonsContainer> 
            </div>
    
            <div className="mb-8">
                <h3 className={ h3Styling }>Weekly Scores</h3>
                <WeeklyScores sortMode={sortMode} recordMode={recordMode} tableMargins={tableMargins} />    
            </div>
            <div className="mb-8">
                <h3 className={ h3Styling }>Score Rankings</h3>
                <WeeklyScoreRankings sortMode={sortMode} recordMode={recordMode} tableMargins={tableMargins} />
            </div>
            <div className={ margins }>
                <h3 className="font-protest text-2xl lg:text-3xl pb-3">Weekly Medians</h3>
                <WeeklyMedianChart />
            </div>
        </>
    )
}

function ToggleButtonsContainer({ labelAbove, children }: { labelAbove: string, children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs uppercase font-semibold mb-1.5 text-gray-600 dark:text-lighterSecondaryGrey">
                { labelAbove }
            </p>
            { children }
        </div>    
    )
}