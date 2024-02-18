import 'client-only';
import { useState, useEffect } from 'react';
import { getTeamSchedule, getTeamScheduleDetailed } from "../../data/API";

export default function Schedule({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState([])
    const [detailedSchedule, setDetailedSchedule] = useState([])
    const [teamBye, setTeamBye] = useState("")
    const tableHeadings = ["Week", "Date", "Opponent", "Result", "Record"]

    const getCurrentSeason = () => getTeamSchedule({ teamID }).then(
        (res) => {
            setCurrentSeason(res.season.displayName)
        }
    )

    const getDetailedSchedule = () => getTeamScheduleDetailed( teamID, currentSeason).then(
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

    const formatDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric" })
        return formattedDate
    }

    // distinguish the chosen team from the non-chosen team in the game
    const teamsInGame = (teams) => {
        var chosenTeam = {}
        var otherTeam = {}
        
        if (teams[0].id == teamID) {
            chosenTeam = teams[0]
            otherTeam = teams[1]
        }
        else {
            chosenTeam = teams[1]
            otherTeam = teams[0]
        }    
            
        var otherTeamLogo = otherTeam.team.logos[0].href
        var otherTeamName = otherTeam.team.displayName
        var otherTeamScore = otherTeam.score.value
        var chosenTeamScore = chosenTeam.score.value

        return (
            <>
                <td className="flex gap-x-1 md:gap-x-2.5 py-2 px-3">
                    <p>{ chosenTeam.homeAway == "home" ? "vs" : "@" }</p>
                    <img className="w-5 md:w-7" src={ otherTeamLogo } alt={ otherTeamName } />
                    <p className="hidden md:block">{ otherTeamName }</p>
                    <p className="md:hidden">{ otherTeam.team.abbreviation }</p>
                </td>
                <td className="py-2 px-3">
                    { chosenTeamScore > otherTeamScore ? <span className="bg-green-500/[0.7] px-1.5 mr-2">W</span> : <span className="bg-red-500/[0.7] px-1.5 mr-2">L</span> }
                    <span>{ chosenTeamScore + "-" + otherTeamScore }</span>
                </td>
                <td className="py-2 px-3">{ chosenTeam.record[0].displayValue }</td>
            </>
        )
    }

    const displayNonByeRows = (game) => { 
        return (
            <>
                <td className="py-2  px-3">
                    { formatDate(game.date) }
                </td>
                { teamsInGame(game.competitions[0].competitors) }
            </>
        )
    }
        
    const displayTables = () => {
        return ( <>
            { detailedSchedule.map(seasonType =>
                <div key={ seasonType.requestedSeason + " section" } className="mb-8">
                    <h3  className="font-protest text-2xl pb-2">{ seasonType.requestedSeason }</h3>
                    <table className="table-auto font-rubik w-full bg-sectionColor rounded-md">
                        <thead className="border-b border-secondaryGrey">
                            <tr>
                                { tableHeadings.map(heading =>
                                    <th className="py-2.5 px-3 text-start" key={ heading + " coulmn heading"}>{ heading }</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            { seasonType.games.map(game =>
                                <tr key={ game.id } className="odd:bg-[#282e37]">
                                    <td className="text-start py-2 px-3">
                                        { game.seasonType.abbreviation == "post" ? game.week.text : game.week.number }    
                                    </td>
                                    { game.week.number == teamBye ? <td colSpan={ 4 } className="py-1.5 px-3 uppercase">Bye Week</td> : displayNonByeRows(game) }
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>)
    }
    
    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason()
    }, [])

    useEffect(() => {
        getDetailedSchedule()
    }, [teamID])

    return (
        <>
            <h2 className="font-protest text-3xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } Season Schedule</h2>
            { displayTables() }
        </>
    )
}