"use client";
import { ReactNode, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import WeeklyScores from "@/app/albinoskies/components/WeeklyScores";
import WeeklyScoreRankings from "@/app/albinoskies/components/WeeklyScoreRankings";
import WeeklyMedianChart from "@/app/albinoskies/components/WeeklyMedianChart";
import ToggleButtons from "@/app/components/ToggleButtons";
import { margins, h3Styling } from "@/app/helpers/albinoskiesStyling";

export default function LeagueStats({ leagueID, children, isHistoryPage }: { leagueID: string, children: ReactNode, isHistoryPage?: boolean }) {
    const [recordMode, setRecordMode] = useState<string>("without median"); // "without median" or "with median"
    const [sortMode, setSortMode] = useState<string>("record"); // "record" or "points scored"
    const [showFilters, setShowFilters] = useState<boolean>(false);

    return (
        <>
            <div className={`flex justify-between  ${isHistoryPage ? "mb-3" : "pb-2 mb-9 border-b-2 border-primary dark:border-primary-dark" } ${margins}`}>
                <div className="w-full flex justify-between items-end">
                    { children }
                
                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className={`md:hidden border border-primary dark:border-primary-dark ${showFilters ? "bg-primary text-primary-dark dark:bg-primary-dark dark:text-primary" : ""} rounded-md py-1 px-2`}
                        aria-label="Show filters"
                    >
                        <FontAwesomeIcon icon={faFilter} className="text-lg" />    
                    </button>   
                             
                    <div aria-label="Sorting and filters" className="hidden md:flex gap-5">
                        <ToggleButtonsContainer labelAbove={"Sort by"}> 
                            <ToggleButtons 
                                options={["record", "points scored"]} 
                                onChange={ setSortMode } 
                                valueToMatch={ sortMode } 
                            /> 
                        </ToggleButtonsContainer>
                                                        
                        <ToggleButtonsContainer labelAbove={"Record type"}> 
                            <ToggleButtons 
                                options={["without median", "with median"]}
                                extraClasses="hidden md:flex"
                                onChange={ setRecordMode }
                                valueToMatch={ recordMode }
                            /> 
                        </ToggleButtonsContainer>   
                    </div>
                </div> 
            </div>
            <div className={`${showFilters ? "block" : "hidden"} md:hidden mb-9 ${margins}`}>
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
                {/* if it's the History page, don't show the Weekly Scores heading here */}
                { isHistoryPage ??            
                    <h3 className={ h3Styling }>Weekly Scores</h3>
                }
                <WeeklyScores sortMode={sortMode} recordMode={recordMode} leagueID={leagueID} />    
            </div>
            <div className="mb-8">
                <h3 className={ h3Styling }>Score Rankings</h3>
                <WeeklyScoreRankings sortMode={sortMode} recordMode={recordMode} leagueID={leagueID} />
            </div>
            <div className={ margins }>
                <h3 className="font-protest text-2xl lg:text-3xl pb-3">Weekly Medians</h3>
                <WeeklyMedianChart leagueID={leagueID} />
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