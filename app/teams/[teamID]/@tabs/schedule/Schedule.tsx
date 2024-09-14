'use client';
import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime } from '@/app/helpers/dateFormatter';
import { displayHomeAway, displayGameResult, displayRecordAfterGame } from '@/app/helpers/displayGameInfo';
import Link from 'next/link';
import allTeamsColors from '@/app/data/allTeamsColors.json';
import displayWeek from '@/app/helpers/displayWeekInfo';
import formatSchedule from '@/app/formatAPIcalls/formatSchedule';

export default function Schedule({ teamID }) {
    const [initialSeason, setInitialSeason] = useState();
    const [schedule, setSchedule] = useState([]);
    const [teamBye, setTeamBye] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // gets the 'season' query from the URL
    const searchParams = useSearchParams();
    const season = searchParams.has('season') && searchParams.get('season');

    const tablePadding = "py-2.5 px-2 md:py-2 md:px-3 text-sm";

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
    let years = [];
    const minYear = 2003;
    let maxYear = initialSeason;
    
    while (maxYear >= minYear) {
        years.push(maxYear--);
    }

    // used for determining the colSpan of overUnder rows (should span over more columns when they share a table with completed games)
    let hasCompletedGames = false;
 
    const displayNonByeRows = (game) => { 
        return (<>
            <td className={ tablePadding }>    
                { formatDateTime(game.date).short }
            </td>       
            <td className={ `flex gap-x-1 md:gap-x-2.5 ${tablePadding}` }>
                { displayHomeAway(game.teams, teamID) }
            </td>
            { game.status.type.state == "pre"
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
                    { displayGameResult(game.teams, game.status.type, teamID) == false 
                        ? <td colSpan={ 5 } className={ tablePadding }>CANCELLED</td>
                        : <>
                            <td className={ tablePadding }>
                                { displayGameResult(game.teams, game.status.type, teamID) }
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
                                                <a className="mr-1.5 hover:text-cyan-400 hover:underline" href={ leader.leaders[0].athlete.links[0].href } title={ leader.leaders[0].athlete.displayName } target="_blank">
                                                    { leader.leaders[0].athlete.shortName }
                                                </a>
                                                <span className="text-lighterSecondaryGrey">{ leader.leaders[0].value }</span>
                                            </td>
                                        )}
                                    </> 
                                : Array.from(Array(3), i => 
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
                <div key={ seasonType.requestedSeason } className="mb-8"> 
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-3">{ seasonType.requestedSeason }</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-nowrap font-rubik bg-sectionColor rounded-md overflow-hidden">
                            { seasonType.allGames.filter(pastOrUpcoming => pastOrUpcoming.games.length > 0)
                                .map(filteredPastOrUpcoming => 
                                    <Fragment key={ filteredPastOrUpcoming }>
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
                                                <tr key={ game.id } className="odd:bg-altTableRow">
                                                    <td className={ `text-start ${tablePadding}` }>   
                                                        { displayWeek(seasonType.requestedSeason, game) }
                                                    </td>
                                                    { game.week.number == teamBye && seasonType.requestedSeason == "Regular Season"
                                                        ? <td colSpan={ hasCompletedGames ? 7 : 4 } className={ `uppercase ${tablePadding}` }>Bye Week</td> 
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
        setIsLoading(true),
        getSchedule()
    }, [season]);
    
    return (
        <> 
            <div className="flex justify-between items-end pb-2 mb-4 md:mb-9 border-b-2">
                { isLoading
                    ? <div className="skeleton w-48 h-10"></div>
                    : <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">{ season ? season : initialSeason } Schedule</h2>
                }
                { isLoading
                    ? <div className="skeleton w-24 h-10"></div>
                    : <div className="dropdown dropdown-end">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="flex btn h-10 min-h-10"
                            style={{ 
                                backgroundColor: allTeamsColors[teamID].bgColor, 
                                color: allTeamsColors[teamID].textColor, 
                                border: `1px solid ${allTeamsColors[teamID].textColor}` 
                            }}
                        >
                            { season ? season : initialSeason }
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-sectionColor rounded-md w-28">
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