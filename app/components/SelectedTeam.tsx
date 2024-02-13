import 'client-only';
import { useState, useEffect } from 'react';
import { getTeam, getTeamRecord } from "../data/API";
import Tabs from './SelectedTeamTabs/Tabs';

export default function SelectedTeam({ teamID }) {
    const [team, setTeam] = useState([])
    const [teamRecord, setTeamRecord] = useState("")
    const [teamLogo, setTeamLogo] = useState([])
    //const [teamSchedule, setTeamSchedule] = useState([])
    const [currentSeason, setCurrentSeason] = useState([])
    
    const getSelectedTeam = () => getTeam({ teamID }).then(
        (res) => {
            setTeam(res)
            res.shortDisplayName == "Giants" ? setTeamLogo(res.logos[1]) : setTeamLogo(res.logos[0])
        }
    )

    const getSelectedTeamRecord = () => getTeamRecord({ teamID }).then(
        (res) => {
            setTeamRecord(res.team.recordSummary)
        }
    )

    const getCurrentSeason = () => getTeamRecord({ teamID }).then(
        (res) => {
            setCurrentSeason(res.season)
        }
    )
    
    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason()
    }, [])

    // run getSelectedTeam() every time teamID updates (aka when a new card is clicked)
    useEffect(() => {
        getSelectedTeam(),
        getSelectedTeamRecord()
    }, [teamID])
    
    return (
        <section className="w-full mb-20">
            <div className="grid md:flex gap-y-2.5 gap-x-5 items-center mb-7">
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
                    <p className="font-rubik flex items-end text-secondaryGrey">{ teamRecord } | { team.standingSummary}</p> 
                </div>          
            </div>
            <Tabs teamID={ teamID } />
        </section>
    )
}