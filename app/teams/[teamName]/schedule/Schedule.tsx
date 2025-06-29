'use client';
import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime } from '@/app/helpers/dateFormatter';
import { displayHomeAway, displayGameResult, displayRecordAfterGame } from '@/app/helpers/displayGameInfo';
import { GameData, FormattedSchedule } from "@/app/types/schedule";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import displayWeek from '@/app/helpers/displayWeekInfo';
import formatSchedule from '@/app/formatAPIcalls/formatSchedule';
import Link from 'next/link';
import H2 from '@/app/components/H2';
import H3 from '@/app/components/H3';


export default function Schedule({ teamName }: { teamName: string }) {
    const [initialSeason, setInitialSeason] = useState<number>();
    const [schedule, setSchedule] = useState<FormattedSchedule[]>([]);
    const [teamBye, setTeamBye] = useState<number | false>();
    const [isLoading, setIsLoading] = useState(true);

    // gets the 'season' query from the URL
    const searchParams = useSearchParams();
    const season = searchParams.has('season') && searchParams.get('season');

    const tablePadding = "py-2.5 px-2 md:py-2 md:px-3 text-sm";
    const allTeamsColors = teamColors as AllTeamsColors;
    const teamID = allTeamsColors[teamName].id;

    const getSchedule = () => formatSchedule(teamID, season).then(
        (res) => {
            // indicate that loading is finished by setting the loading to false
            setIsLoading(false);
            setSchedule(res);
       
            /*
             * season is false in the initial request in order to get the team's current schedule
             * if it's undefined, get the season associated with the earliest past game
             * if there are 0 past games (i.e. we're in the offseason between the draft and the start of the preseason), get the season of the first upcoming game
            */
            if (!season) {
                if (res[0].allGames[0].games.length > 0) {
                    setInitialSeason(res[0].allGames[0].games[0].season);
                }
                else {
                    setInitialSeason(res[0].allGames[1].games[0].season);
                }
            }
            
            // set byeWeek variable
            for (let x = 0; x < res.length; x += 1) {
                if (res[x].byeWeek) {
                    setTeamBye(res[x].byeWeek);
                    break;
                }
            }
        }
    );
    
    // establish the years that appear in the dropdown
    let years: number[] = [];
    const minYear = 2003;
    let maxYear = initialSeason;
    
    // adds all years since minYear to the dropdown
    if (typeof maxYear === "number") {
        while (maxYear >= minYear) {
            years.push(maxYear--);
        }
    }

    // used for determining the colSpan of overUnder rows (should span over more columns when they share a table with completed games)
    let hasCompletedGames = false;
 
    const displayNonByeRows = (game: GameData) => { 
        return (<>
            <td className={ tablePadding }>   
                { game.status?.type.state == "in"
                    ? displayGameResult(game.teams, game.status, teamID, true)
                    : <>
                        <span className="md:hidden">{ formatDateTime(game.date).short }</span>
                        <span className="hidden md:inline-block">{ formatDateTime(game.date).long }</span>
                    </>
                }
            </td>       
            <td className={ `flex gap-x-1 md:gap-x-2.5 ${tablePadding}` }>
                { displayHomeAway(game.teams, teamID) }
            </td>
            { game.status?.type.state == "pre"
                ? <>
                    <td className={ tablePadding }>
                        { game.network }
                    </td>
                    <td className={ tablePadding }>
                        { game.spread }
                    </td>
                    <td colSpan={ hasCompletedGames ? 3 : 1 } className={ tablePadding }>
                        { game.overUnder }
                    </td>
                </>
                : <>
                    { hasCompletedGames = true }
                    { displayGameResult(game.teams, game.status, teamID) == false 
                        ? <td colSpan={ 5 } className={ tablePadding }>CANCELLED</td>
                        : <>
                            <td className={ tablePadding }>
                                { displayGameResult(game.teams, game.status, teamID) }
                            </td>
                            <td className={ tablePadding }>
                                { displayRecordAfterGame(game.teams, teamID) }
                            </td>
                            { game.leaders 
                                ? game.leaders.every(leader => leader == null) 
                                    ? <td>Not yet available</td> 
                                    : <>
                                        { game.leaders.map(leader => 
                                            <td key={ leader.leaders[0].athlete.lastName + leader.leaders[0].value } className={ tablePadding }>
                                                <a className="mr-1.5 hover:text-cyan-500 dark:hover:text-cyan-400" href={ leader.leaders[0].athlete.links[0].href } title={ leader.leaders[0].athlete.displayName } target="_blank">
                                                    { leader.leaders[0].athlete.shortName }
                                                </a>
                                                <span className="text-gray-500 dark:text-lighterSecondaryGrey">{ leader.leaders[0].value }</span>
                                            </td>
                                        )}
                                    </> 
                                : Array.from([1, 2, 3], i => 
                                    <td key={ i } className={ tablePadding }>N/A</td>
                                )  
                            }
                        </>
                    }
                </>
            }
        </>)
    }
        
    const displayTables = () => {
       return (<>
            { schedule.map(seasonType => 
                <div key={ seasonType.requestedSeason } className="mb-8 last-of-type:mb-0"> 
                    <H3>{ seasonType.requestedSeason }</H3>
                    <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto">
                        <table className="table-auto w-full text-nowrap font-rubik overflow-hidden">
                            { seasonType.allGames.filter(pastOrUpcoming => pastOrUpcoming.games.length > 0)
                                .map((filteredPastOrUpcoming, index) => 
                                    <Fragment key={ index }>
                                        <thead className={ 
                                            `border-b border-secondaryGrey ${ hasCompletedGames && filteredPastOrUpcoming.tableHeadings.includes("Spread") ? "border-t" : null }`
                                        }>
                                            <tr>
                                                { filteredPastOrUpcoming.tableHeadings.map(heading =>
                                                    <th key={ heading } className="py-2.5 px-2 md:px-3 text-start">{ heading }</th>
                                                )}    
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { filteredPastOrUpcoming.games.map(game =>
                                                <tr 
                                                    key={ game.id + formatDateTime(game.date).short } 
                                                    className="border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row dark:odd:bg-alt-table-row-dark dark:border-none"
                                                >
                                                    <td className={ `text-start ${tablePadding}` }>   
                                                        { displayWeek(seasonType.requestedSeason, game.week) }
                                                    </td>
                                                    { game?.week?.number == teamBye && seasonType.requestedSeason == "Regular Season"
                                                        ? <td colSpan={ hasCompletedGames ? 7 : 5 } className={ `uppercase ${tablePadding}` }>Bye Week</td> 
                                                        : displayNonByeRows(game)
                                                    }
                                                </tr>
                                            )}
                                        </tbody>
                                    </Fragment>
                                )
                            }    
                        </table>
                    </div>
                </div>
            )}
       </>)
    }
    
    useEffect(() => {
        getSchedule()
    }, [season]);
    
    return (
        <> 
            <div className="flex justify-between items-end pb-2 mb-4 md:mb-9 border-b-2 border-primary dark:border-white">
                { isLoading
                    ? <div className="skeleton w-48 h-10"></div>
                    : <H2>{ season ? season : initialSeason } Schedule</H2>   
                }
                { isLoading
                    ? <div className="skeleton w-24 h-10"></div>
                    : <div className="dropdown dropdown-end">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="flex btn h-10 min-h-10"
                            style={{ 
                                backgroundColor: allTeamsColors[teamName].bgColor, 
                                color: allTeamsColors[teamName].textColor, 
                                border: `1px solid ${allTeamsColors[teamName].textColor}` 
                            }}
                        >
                            { season ? season : initialSeason }
                            <FontAwesomeIcon icon={faCaretDown} className="" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-section dark:bg-section-dark rounded-md w-28">
                            { years.map(year =>
                                <li key={ year }>
                                    <Link href={ `?season=${year}` }>{ year }</Link>    
                                </li>   
                            )}
                        </ul>
                    </div>
                }  
            </div>
            { isLoading 
              ? <div className="skeleton w-full h-56"></div>
              : displayTables()
            }
        </>
    )
}