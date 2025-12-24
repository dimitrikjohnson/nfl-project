"use client";
import { useState } from "react";
import Dropdown from "@/app/components/Dropdown";
import SeasonOutcomeBanner from "../components/SeasonOutcomeBanner";
import Standings from "../components/Standings";
import H2 from "@/app/components/H2";
import { margins } from "@/app/helpers/albinoskiesStyling";
import Podium from "../components/Podium";
import LeagueStats from "../components/LeagueStats";

export default function HistoryClient({ seasons }: { seasons: any[] }) {
    const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  
    return (
        <>
            <div className={`flex justify-between pb-2 mb-6 md:mb-9 border-b-2 border-primary dark:border-primary-dark ${margins}`}>
                <div className="flex items-end">
                    <H2>League History</H2>    
                </div>
                <Dropdown
                    buttonLabel={ selectedSeason.season }
                    width="w-20"
                    items={
                        seasons.map((s) => ({
                            label: s.season,
                            onClick: () => setSelectedSeason(s)
                        }))
                    }
                />
            </div>
         
            <Podium season={selectedSeason.season} />

            <SeasonOutcomeBanner season={selectedSeason} /> 

            <Standings season={selectedSeason.season} />

            <LeagueStats leagueID={selectedSeason.league_id} isHistoryPage>
                <h3 className="font-protest text-2xl lg:text-3xl">Weekly Scores</h3>
            </LeagueStats>
        </>
    );
}