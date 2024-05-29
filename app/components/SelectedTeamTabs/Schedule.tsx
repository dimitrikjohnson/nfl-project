import 'client-only';
import { useState, useEffect, Fragment } from 'react';
import { formatDateTime } from '../../helpers/dateFormatter';
import { displayHomeAway, displayGameResult, displayRecordAfterGame } from '../../helpers/displayGameInfo';
import ReactLoading from "react-loading";
import getTeamSchedule from '@/app/apiCalls/getTeamSchedule';
import allTeamsColors from '@/app/components/data/allTeamsColors.json';
import displayWeek from '../../helpers/displayWeekInfo';

export default function Schedule({ teamID }) {
    const [initialSeason, setInitialSeason] = useState();
    const [season, setSeason] = useState();
    const [schedule, setSchedule] = useState([]);
    const [teamBye, setTeamBye] = useState();
    const [spinner, setSpinner] = useState(false);
    
    const tablePadding = "py-2 px-2 md:px-3 text-sm";
    
    // establish the years that appear in the dropdown
    let years = [];
    const minYear = 2003;
    let maxYear = initialSeason;
    
    while (maxYear >= minYear) {
        years.push(maxYear--);
    }

    const getSchedule = (selectedSeason) => getTeamSchedule(teamID, selectedSeason).then(
        (res) => {
            // indicate that loading is finished by setting the spinner to false
            setSpinner(false);
            setSchedule(res);
       
            /*
             * season is undefined in the initial request in order to get the team's current schedule
             * if it's undefined, get the season associated with the earliest past game
             * if there are 0 past games (i.e. we're in the offseason between the draft and the start of the preseason), get the season of the first upcoming game
            */
            if (season == undefined) {
                if (res[0].allGames[0].games.length > 0) {
                    setInitialSeason(res[0].allGames[0].games[0].season);
                    setSeason(res[0].allGames[0].games[0].season);
                }
                else {
                    setInitialSeason(res[0].allGames[1].games[0].season);
                    setSeason(res[0].allGames[1].games[0].season);                
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
                    <td className={ tablePadding }>
                        { game.overUnder }
                    </td>
                </>
                : <>
                    { displayGameResult(game.teams, game.status.type, teamID).cancelled 
                        ? <td colSpan={ 5 } className={ tablePadding }>CANCELLED</td>
                        : <>
                            <td className={ tablePadding }>
                                { displayGameResult(game.teams, game.status.type, teamID) }
                            </td>
                            <td className={ tablePadding }>
                                { displayRecordAfterGame(game.teams, teamID) }
                            </td>
                            { game.leaders 
                                ? <> 
                                    { game.leaders.map(leader => 
                                        <td key={ leader.leaders[0].athlete.lastName + leader.leaders[0].value } className={ tablePadding }>
                                            <span className="mr-1.5">{ leader.leaders[0].athlete.lastName }</span>
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
                    <h3  className="font-protest text-2xl 2xl:text-3xl pb-2">{ seasonType.requestedSeason }</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-nowrap font-rubik bg-sectionColor rounded-md overflow-hidden">
                            { seasonType.allGames.filter(pastOrUpcoming => pastOrUpcoming.games.length > 0)
                                .map(filteredPastOrUpcoming => 
                                    <Fragment key={ filteredPastOrUpcoming }>
                                        <thead className="border-b border-secondaryGrey">
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
                                                        { displayWeek(seasonType.requestedSeason, filteredPastOrUpcoming.games, game) }
                                                    </td>
                                                    { game.week.number == teamBye && seasonType.requestedSeason == "Regular Season"
                                                        ? <td colSpan={ filteredPastOrUpcoming.tableHeadings.length - 1 } className={ `uppercase ${tablePadding}` }>Bye Week</td> 
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
      setSpinner(true),
      getSchedule(season)
    }, [teamID, season]);
    
    return (
        <> 
            <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2">
                <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">Schedule</h2>
                <select className="border border-secondaryGrey/[.50] bg-transparent hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" 
                style={{ backgroundColor: allTeamsColors[teamID].bgColor, color: allTeamsColors[teamID].textColor, border: `1px solid ${allTeamsColors[teamID].textColor}` }}
                name="years" 
                id="years"
                onChange={ event => setSeason(event.target.value) }
                >
                    { years.map(year =>
                        <option key={ year } value={ year }>{ year }</option>
                    )}
                </select>
            </div>
            { spinner 
              ? <div className="w-full flex justify-center mt-5">
                    <ReactLoading type="spin" height={100} width={75} />
                </div> 
              : displayTables()
            }
        </>
    )
}