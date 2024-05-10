import 'client-only';
import { useState, useEffect } from 'react';
import { formatDateTime } from '../helpers/dateFormatter';
import { displayHomeAway, displayGameResult, displayRecordAfterGame } from '../helpers/displayGameInfo';
import ReactLoading from "react-loading";
import fetchCurrentSeason from "../../apiCalls/fetchCurrentSeason";
import getTeamScheduleDetailed from '@/app/apiCalls/getTeamScheduleDetailed';

export default function Schedule({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState("");
    const [detailedSchedule, setDetailedSchedule] = useState([]);
    const [teamBye, setTeamBye] = useState("");
    const [spinner, setSpinner] = useState(false);
    const tablePadding = "py-2 px-2 md:px-3";
    
    const getCurrentSeason = () => fetchCurrentSeason().then(
      (res) => setCurrentSeason(res)
    );
    
    const getDetailedSchedule = () => getTeamScheduleDetailed( teamID ).then(
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
                    <td className={ tablePadding }>
                        { displayGameResult(game.teams, game.status.type, teamID) }
                    </td>
                    <td className={ tablePadding }>
                        { displayRecordAfterGame(game.teams, teamID) }
                    </td>
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
                                .map(filteredPastOrUpcoming => <>
                                    <thead key={ filteredPastOrUpcoming } className="border-b border-secondaryGrey">
                                        <tr>
                                            { filteredPastOrUpcoming.tableHeadings.map(heading =>
                                                <th key={ heading } className="py-2.5 px-2 md:px-3 text-start" >{ heading }</th>
                                            )}    
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredPastOrUpcoming.games.map(game =>
                                            <tr key={ game.id } className="odd:bg-[#282e37]">
                                                <td className={ "text-start " + tablePadding }>
                                                    { seasonType.requestedSeason == "Postseason" 
                                                        ? game.week.text
                                                        : seasonType.requestedSeason == "Preseason" && filteredPastOrUpcoming.games[0].week.number != 1 
                                                            ? game.week.number - 1
                                                            : game.week.number
                                                    }    
                                                </td>
                                                { game.week.number == teamBye
                                                    ? <td colSpan={ filteredPastOrUpcoming.tableHeadings.length - 1 } className={ "uppercase " + tablePadding }>Bye Week</td> 
                                                    : displayNonByeRows(game)
                                                }
                                            </tr>
                                        )}
                                    </tbody>
                                </>)
                            }    
                        </table>
                    </div>
                </div>
            )}
       </>)
    }
    
    // only run getCurrentSeason() on the first render
    useEffect(() => {
      getCurrentSeason()
    }, []);
    
    useEffect(() => {
      setSpinner(true),
      getDetailedSchedule()
    }, [teamID]);
    
    return (
        <>
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } Schedule</h2>
            { spinner 
              ? <div className="w-full flex justify-center mt-5">
                    <ReactLoading type="spin" height={100} width={75} />
                </div> 
              : displayTables()
            }
        </>
    )
}