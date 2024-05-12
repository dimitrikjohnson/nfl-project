import 'client-only';
import { useState, useEffect } from 'react';
import fetchCurrentSeason from "@/app/apiCalls/fetchCurrentSeason";
//import getTeam from '@/app/apiCalls/getTeam';
import TeamLeaders from './TeamLeaders';
import TeamRankings from './TeamRankings';
import LastTwoGames from './LastTwoGames';

export default function Overview({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState("")
    //const [teamAltColor, setTeamAltColor] = useState("")

    const getCurrentSeason = () => fetchCurrentSeason().then(
        (res) => setCurrentSeason(res)
    )
    /*
    const getTeamAltColor = () => getTeam({teamID}).then(
        (res) => setTeamAltColor(res.alternateColor)
    )
    */
    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason()
    }, []);
    /*
    useEffect(() => {
        getTeamAltColor()
    }, [teamID])
    */
    return (
        <>
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } overview</h2>
            <TeamLeaders teamID={ teamID } responseType={ "overview" }/>
            <TeamRankings teamID={ teamID } />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LastTwoGames teamID={ teamID }/>
                <div>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Next Two Games</h3>
                    <div className="font-rubik grid grid-cols-2 gap-3 bg-sectionColor p-3 rounded-md">

                    </div>
                </div>
            </div>
        </>
    )
}