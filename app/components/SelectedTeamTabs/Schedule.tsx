import 'client-only';
import { useState, useEffect } from 'react';
import { formatDateTime } from '../helpers/dateFormatter';
import { displayHomeAway, displayGameResult, displayRecordAfterGame } from '../helpers/displayGameInfo';
import fetchCurrentSeason from "../../apiCalls/fetchCurrentSeason";
import getTeamScheduleDetailed from '@/app/apiCalls/getTeamScheduleDetailed';

export default function Schedule({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState("")
    const [detailedSchedule, setDetailedSchedule] = useState([])
    const [teamBye, setTeamBye] = useState("")
    const tableHeadings = ["Week", "Date", "Opponent", "Result", "Record"]
    
    const getCurrentSeason = () => fetchCurrentSeason().then(
        (res) => setCurrentSeason(res)
    )
    
    const getDetailedSchedule = () => getTeamScheduleDetailed( teamID ).then(
        (res) => {
            setDetailedSchedule(res)
            
            // find byeWeek variable
            for (var x = 0; x < res.length; x += 1) {
                if (res[x].requestedSeason == "Regular Season") {
                    setTeamBye(res[x].byeWeek)
                    break
                }
            }
        }
    )

    const displayNonByeRows = (game) => { 
        return (
            <>
                <td className="py-2 px-3">
                    { /*formatDate(game.date)*/ }
                    <span className="hidden lg:inline-block">{ formatDateTime(game.date).long }</span>
                    <span className="lg:hidden">{ formatDateTime(game.date).short }</span>
                </td>
                <td className="flex gap-x-1 md:gap-x-2.5 py-2 px-3">
                    { displayHomeAway(game.competitors, teamID) }
                </td>
                <td className="py-2 px-3">
                    { displayGameResult(game.competitors, game.status.type, teamID) }
                </td>
                <td className="py-2 px-3">
                    { displayRecordAfterGame(game.competitors, teamID) }
                </td>
                
            </>
        )
    }
        
    const displayTables = () => {
        return ( <>
            { detailedSchedule.map(seasonType =>
                <div key={ seasonType.requestedSeason + " section" } className="mb-8">
                    <h3  className="font-protest text-2xl 2xl:text-3xl pb-2">{ seasonType.requestedSeason }</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-nowrap font-rubik bg-sectionColor rounded-md">
                            <thead className="border-b border-secondaryGrey">
                                <tr>
                                    { tableHeadings.map(heading =>
                                        <th className="py-2.5 px-3 text-start" key={ heading + " column heading" }>{ heading }</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                { seasonType.games.map(game =>
                                    <tr key={ game.id + " week: " + game.week.number } className="odd:bg-[#282e37]">
                                        <td className="text-start py-2 px-3">
                                            { seasonType.requestedSeason == "Postseason" ? game.week.text : game.week.number }    
                                        </td>
                                        { game.week.number == teamBye 
                                            ? <td colSpan={ 4 } className="py-1.5 px-3 uppercase">Bye Week</td> 
                                            : displayNonByeRows(game.competitions[0]) 
                                        }
                                    </tr>
                                )}
                            </tbody>
                        </table>    
                    </div>    
                </div>
            )}
        </>)
    }
    
    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason()
        //setCurrentSeason(getCurrentSeason())
    }, [])

    useEffect(() => {
        getDetailedSchedule()
    }, [teamID])

    return (
        <>
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } Season Schedule</h2>
            { displayTables() }
        </>
    )
}