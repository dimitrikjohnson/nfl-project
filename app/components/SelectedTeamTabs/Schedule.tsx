import 'client-only';
import { useState, useEffect, useContext, Fragment } from 'react';
import { formatDateTime } from '../helpers/dateFormatter';
import { displayHomeAway, displayGameResult, displayRecordAfterGame } from '../helpers/displayGameInfo';
import { ThisSeason } from '../SelectedTeam';
import ReactLoading from "react-loading";
import getTeamSchedule from '@/app/apiCalls/getTeamSchedule';
import allTeamsColors from '@/app/components/data/allTeamsColors.json';

export default function Schedule({ teamID }) {
    const [season, setSeason] = useState(useContext(ThisSeason));
    const [detailedSchedule, setDetailedSchedule] = useState([]);
    const [teamBye, setTeamBye] = useState("");
    const [spinner, setSpinner] = useState(false);
    
    const tablePadding = "py-2 px-2 md:px-3";
    let years = [];
    const minYear = 2003;
    let maxYear = useContext(ThisSeason);
    
    while (maxYear >= minYear) {
        years.push(maxYear--);
    }

    const getSchedule = (selectedSeason) => getTeamSchedule( teamID, selectedSeason ).then(
        (res) => {
            // indicate that loading is finished by setting the spinner to false
            setSpinner(false);
            setDetailedSchedule(res);
            
            // set byeWeek variable
            for (var x = 0; x < res.length; x += 1) {
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
                <span className="hidden lg:inline-block">{ formatDateTime(game.date).long }</span>
                <span className="lg:hidden">{ formatDateTime(game.date).short }</span>
            </td>
            <td className={ "flex gap-x-1 md:gap-x-2.5 " + tablePadding }>
                { displayHomeAway(game.teams, teamID) }
            </td>
            { game.status.type.state == "pre"
                ? <>
                    <td className={ tablePadding }>
                        { game.spread }
                    </td>
                    <td className={ tablePadding }>
                        { game.overUnder }
                    </td>
                </>
                : <>
                    { displayGameResult(game.teams, game.status.type, teamID).cancelled 
                        ? <td colSpan={ 2 } className={ tablePadding }>CANCELLED</td>
                        : <>
                            <td className={ tablePadding }>
                                { displayGameResult(game.teams, game.status.type, teamID) }
                            </td>
                            <td className={ tablePadding }>
                                { displayRecordAfterGame(game.teams, teamID) }
                            </td>
                        </>
                    }
                </>
            }
        </>)
    }
        
    const displayTables = () => {
       return (<>
            { detailedSchedule.map(seasonType =>
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
                                                <tr key={ game.id + game.week.number } className="odd:bg-altTableRow">
                                                    <td className={ "text-start " + tablePadding }>
                                                        { seasonType.requestedSeason == "Postseason" 
                                                            ? game.week.text
                                                            : seasonType.requestedSeason == "Preseason" && filteredPastOrUpcoming.games[0].week.number != 1 
                                                                ? game.week.number - 1
                                                                : game.week.number
                                                        }    
                                                    </td>
                                                    { game.week.number == teamBye && seasonType.requestedSeason == "Regular Season"
                                                        ? <td colSpan={ filteredPastOrUpcoming.tableHeadings.length - 1 } className={ "uppercase " + tablePadding }>Bye Week</td> 
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
                onChange={ (event) => setSeason(event.target.value) }
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