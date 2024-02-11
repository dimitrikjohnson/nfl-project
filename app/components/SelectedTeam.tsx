import 'client-only';
import { useState, useEffect } from 'react';
import { getTeam, getTeamRecord } from "../data/API";

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
        <section className="w-full flex-col mb-20">
            <div className="grid md:flex gap-3">
                <div 
                className="w-36 p-1 rounded-md" 
                style={{ background: 'linear-gradient(to bottom right, #' + team.color + ' 0%, #' + team.color + ' 50%, #' + team.alternateColor + ' 50%, #' + team.alternateColor + ' 100%)'}}
                >
                    <img src={ teamLogo.href } alt={ team.displayName + " logo"} />
                </div>
                <h1 className="font-protest flex items-center text-5xl uppercase">{ team.displayName }</h1>
                <p className="font-rubik flex items-center text-[#848484]">{ teamRecord } | { team.standingSummary}</p>                 
            </div>
        </section>
    )
}