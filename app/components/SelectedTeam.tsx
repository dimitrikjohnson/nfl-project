import 'client-only';
import { useState, useEffect } from 'react';
import { getTeam, getTeamSchedule, getSuperBowlWinner } from "../data/API";
import Tabs from './SelectedTeamTabs/Tabs';

export default function SelectedTeam({teamID}) {
    const [team, setTeam] = useState([])
    const [teamRecord, setTeamRecord] = useState("")
    const [teamLogo, setTeamLogo] = useState([])
    const [sbWinner, setSBWinner] = useState({})

    const getSelectedTeam = () => getTeam({teamID}).then(
        (res) => {
            setTeam(res)
            res.shortDisplayName == "Giants" ? setTeamLogo(res.logos[1]) : setTeamLogo(res.logos[0])
        }
    )

    const getSelectedTeamRecord = () => getTeamSchedule({teamID}).then(
        (res) => {
            setTeamRecord(res.team.recordSummary)
        }
    )

    const getSBWinner = () => getSuperBowlWinner().then(
        (res) => {
            if (res) {
                setSBWinner({
                    headline: res.headline, 
                    winner: res.winnerID
                })
            }
        }
    )
    
    useEffect(() => {
        getSBWinner()
    }, [])
   
    // run these functions every time teamID updates (aka when a new card is clicked)
    useEffect(() => {
        getSelectedTeam(),
        getSelectedTeamRecord()
    }, [teamID])
    
    return (
        <section className="w-full mb-16">
            <div className="grid md:flex gap-y-2.5 gap-x-5 items-center mb-9">
                <div className="flex justify-center md:block">
                    <div 
                    className="w-72 md:w-36 p-1 rounded-md" 
                    style={{ background: 'linear-gradient(to bottom right, #' + team.color + ' 0%, #' + team.color + ' 50%, #' + team.alternateColor + ' 50%, #' + team.alternateColor + ' 100%)'}}
                    >
                        <img src={ teamLogo.href } alt={ team.displayName + " logo"} />
                    </div>
                </div>
                <div className="grid md:flex gap-3 h-1/2">
                    <h1 className="font-protest flex items-end text-5xl uppercase">{ team.displayName }</h1>
                    <p className="font-rubik flex items-end text-secondaryGrey">
                        { teamRecord } | { team.standingSummary} { sbWinner.winner == teamID ? " | " + sbWinner.headline + " Champions" : null }
                    </p> 
                </div>          
            </div>
            <Tabs teamID={ teamID } />
        </section>
    )
}