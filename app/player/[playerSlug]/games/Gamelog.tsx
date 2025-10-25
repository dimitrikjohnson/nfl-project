'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import getPlayerGames from '@/app/apiCalls/getPlayerGames';
import H2 from '@/app/components/H2';
import YearDropdownButton from '@/app/components/YearDropdownButton';
import type { Headings, Rows, SeasonType } from '@/app/types/gameAndCareerStats';
import { displayTableHead, displayTableFoot, convertToNumber, displayTableBody } from '@/app/helpers/gameAndCareerTables';
import getPlayer from '@/app/apiCalls/getPlayer';
import ToggleButtons from '@/app/components/ToggleButtons';

export default function Gamelog({ playerID }: { playerID: string }) {
    const [resSeason, setResSeason] = useState<string>();
    const [seasonOptions, setSeasonOptions] = useState<string[]>([]);
    const [seasonTypes, setSeasonTypes] = useState<SeasonType[]>([]);
    const [fantasyType, setFantasyType] = useState<'half-ppr' | 'ppr'>('half-ppr');
    const [teamColors, setTeamColors] = useState({ bg: "", text: "" });
    const [isLoading, setIsLoading] = useState(true);

    // gets the 'season' query from the URL
    const searchParams = useSearchParams();
    const season = searchParams.get('season');
    
    const getGames = () => getPlayerGames(playerID, season).then(
        (res) => { 
            // indicate that loading is finished by setting the loading to false
            setIsLoading(false);
            setResSeason(res.season);
            setSeasonTypes(res.seasonTypes);
            setSeasonOptions(res.seasonOptions);  
        }
    );
 
    const displayTables = () => {
       return (<>
            { seasonTypes.map(seasonType => 
                seasonType.stats.length > 0 && (
                    <div key={ seasonType.name } className="mb-8 last-of-type:mb-0"> 
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="font-protest text-2xl lg:text-3xl">{ seasonType.name }</h3>
                            { seasonType.includesFantasyData &&
                                <ToggleButtons
                                    options={["half-ppr", "ppr"]}
                                    valueToMatch={ fantasyType }
                                    onChange={ setFantasyType }
                                    extraClasses="flex"
                                    uppercase={ true }
                                />
                            }
                        </div>
                        <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto">
                            <table className="table-auto w-full text-nowrap overflow-hidden whitespace-nowrap">
                                { displayTableHead(seasonType.headings, fantasyType) }
                                { displayTableBody(seasonType.headings, seasonType.stats, fantasyType)}  
                                { displayTableFoot(
                                    {
                                        totals: seasonType.totals,
                                        averages: calculateAverages(seasonType.stats, seasonType.headings)
                                    }, 
                                    seasonType.headings,
                                    fantasyType
                                )}
                            </table>
                        </div>    
                    </div>
                )    
            )}
       </>)
    }
    
    useEffect(() => {
        setIsLoading(true);
        
        // get the colors of the player's current team
        getPlayer({playerID}).then(
            (res) => {
                setTeamColors({
                    bg: res.team.bgColor,
                    text:res.team.textColor
                });
            }
        );

        getGames();
    }, [season]);
    
    return (
        <> 
            <div className="flex justify-between items-end pb-2 mb-4 md:mb-9 border-b-2 border-primary dark:border-white">
                { isLoading
                    ? <div className="skeleton w-48 h-10"></div>
                    : <H2>{ resSeason 
                            ? resSeason == "0" || resSeason
                            : seasonOptions[0] 
                        } Gamelog
                    </H2>   
                }
                { isLoading
                    ? <div className="skeleton w-24 h-10"></div>
                    : <YearDropdownButton 
                        colors={ teamColors } 
                        displaySeason={ resSeason 
                            ? resSeason == "0" 
                                ? seasonOptions[0] 
                                : resSeason
                            : seasonOptions[0] 
                        } 
                        allYears={ seasonOptions } 
                    />
                }  
            </div>
            { isLoading 
              ? <div className="skeleton w-full h-56"></div>
              : seasonTypes.length > 0
                    ? displayTables()
                    : <>
                        <p className="text-center font-bold text-lg mb-4">No game information available.</p>
                        <p className="text-center">This player has no regular season stats to display.</p>
                    </>
            }
        </>
    )
}

function calculateAverages(rows: Rows[], headings: Headings[]) {
    // column count (skip the meta heading; DO NOT filter Fantasy here)
    const fullLen = headings.slice(1).reduce((sum, heading) => sum + heading.columns.length, 0);

    const sums = Array(fullLen).fill(0);
    const gameCount = rows.length || 1; // avoid div-by-zero

    rows.forEach(({ stats }) => {
        for (let stat = 0; stat < fullLen; stat++) {
            sums[stat] += convertToNumber(stats[stat]);
        }
    });

    const avgs = sums.map((total) => {
        const average = total / gameCount;
        return (
            Number.isInteger(average)           // don't add decimals to whole numbers
              ? Number(average).toLocaleString()
              : Number(average).toFixed(1) 
        )
    });
    
    return avgs;
}
