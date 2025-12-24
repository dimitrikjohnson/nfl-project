"use client";
import { useState, useEffect, useMemo } from "react";
import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import ToggleButtons from "@/app/components/ToggleButtons";
import { margins, tableMargins } from "@/app/helpers/albinoskiesStyling";
import { getUserRankColor } from "@/app/helpers/getRankColor";

type Division = {
    id: number;
    league_id: string;
    season: number;
    division_id: number;
    name: string;
    avatar: string;
};

export default function Standings({ season }: { season: any }) {
    const [standings, setStandings] = useState<any[]>([]);
    const [divisionsData, setDivisionsData] = useState<Division[]>([]);
    const [standingsMode, setStandingsMode] = useState<string>("divisions"); // "league" or "divisions"
    
    const realNames = realNamesJSON as Record<string, string>;
    const rowPadding = "py-2.5 pl-2 pr-1.5 md:px-3";
    
    const loadStandings = async (season: any) => {
        try {
            const res = await fetch(`/api/fantasy-standings/${season}`).then(res => res.json());
            const divisions = await fetch(`/api/fantasy-divisions/${season}`).then(res => res.json());
       
            setStandings(res);
            setDivisionsData(divisions);
        } 
        catch (err) {
            console.error("Error loading standings", err);
        } 
    };

    useEffect(() => {
        loadStandings(season);
    }, [season]);

    // get each user's overall rank in the league
    const rankedStandings = useMemo(() => {
        return [...standings]
            .map((row, index) => ({
                ...row,
                leagueRank: index + 1,
            }));
    }, [standings]);

    const divisions = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        
        rankedStandings.forEach(row => {
            // group the users by division
            const division = row.division_id ? (row.division_id - 1) : "unknown";
           
            if (!grouped[division]) grouped[division] = [];
            grouped[division].push(row);
        });
       
        return grouped;
    }, [rankedStandings]);
    

    // reusable row renderer
    const StandingsTable = ({ rows }: { rows: any[] }) => (
        <div className="w-full relative">
            <div className={`bg-section border border-gray-300 dark:bg-section-dark dark:border-none overflow-x-auto w-full md:rounded-md ${tableMargins} opacity-0 animate-fadeIn`}>
                <table key={ season } className="w-full">
                    <thead className="text-sm md:text-base border-b border-secondaryGrey">
                        <tr>
                            <th className={`${rowPadding} text-start`}>Team</th>
                            <th className={`${rowPadding} text-center`}>W-L</th>
                            <th className={`${rowPadding} text-center`}>PF</th>
                            <th className={`${rowPadding} text-center`}>MAX PF</th>
                            <th className={`${rowPadding} text-center`}>PA</th>
                        </tr>
                    </thead>
                    <tbody>
                        { rows.map((team) => (
                            <tr key={ team.id } className="text-sm md:text-base border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row odd:dark:bg-alt-table-row-dark dark:border-none">
                                <td className={`flex gap-2 md:gap-3 items-center ${rowPadding}`}>  
                                    <img 
                                        className="w-12 rounded-full" 
                                        src={ team.team_avatar } 
                                        alt={`${realNames[team.user_id]}'s ${season} avatar`}
                                    />
                                    <div>
                                        <div>
                                            <span>{ realNames[team.user_id] }</span>
                                            <span className={`ml-1.5 text-xs italic ${getUserRankColor(team.leagueRank, rankedStandings.length)}`}>
                                                #{ team.leagueRank }
                                            </span>
                                        </div>
                                        <div className="text-[10px] md:text-sm text-gray-600 dark:text-lighterSecondaryGrey">
                                            { team.team_name }
                                        </div>    
                                    </div>
                                </td>
                                <td className={`${rowPadding} text-center`}>
                                    {team.wins}-{team.losses}
                                    {team.ties > 0 ? `-${team.ties}` : ""}
                                </td>
                                <td className={`${rowPadding} text-center`}>{team.points_for}</td>
                                <td className={`${rowPadding} text-center`}>{team.max_points_for}</td>
                                <td className={`${rowPadding} text-center`}>{team.points_against}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>  
        </div>
    );

    if (!standings || standings.length === 0)
        return <div className={`skeleton rounded-md h-32 mb-8 ${margins}`}></div>;

    return (
        <section className="mb-8">
            <div className={`flex justify-between mb-3 ${margins}`}>
                <h3 className="font-protest text-2xl lg:text-3xl">Standings</h3>
                <ToggleButtons 
                    options={["divisions", "league"]}
                    onChange={ setStandingsMode }
                    valueToMatch={ standingsMode }
                    fullWidth={ true }
                /> 
            </div>

            {/* ============================
               LEAGUE MODE → One big table
               ============================ 
            */}
            { standingsMode === "league" && (
                <StandingsTable rows={rankedStandings} />
            )}

            {/* ============================
               DIVISION MODE → Two tables
               ============================ 
            */}
            { standingsMode === "divisions" && (
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8 ${tableMargins}`}>
                    { divisionsData.map((division, index) => (
                        <div key={division.id}>
                            <div className={`flex gap-3 mb-2 items-center ${margins}`}>
                                <img
                                    className="w-14 rounded-full"
                                    src={division.avatar}
                                    alt={`${division.name} division avatar`}
                                />
                                <h4 className="font-bold text-lg">
                                    {division.name}
                                </h4>
                            </div>
                            <StandingsTable rows={divisions[index]} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}