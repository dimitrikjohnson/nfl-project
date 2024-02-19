import 'client-only';
import { useState, useEffect } from 'react';
import { getTeamStats, fetchCurrentSeason } from "../../data/API";

export default function Overview({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState("")
    const [offensiveRanks, setOffensiveRanks] = useState({})
    const [defensiveRanks, setDefensiveRanks] = useState({})

    const getCurrentSeason = () => fetchCurrentSeason().then(
        (res) => setCurrentSeason(res)
    )
    
    const getTeamRankings = () => getTeamStats(teamID).then(
        (res) => {

            setOffensiveRanks({
                ppg: res.ppg,
                ypg: res.ypg,
                passingYPG: res.passingYPG,
                rushingYPG: res.rushingYPG
            })

            setDefensiveRanks({
                sacks: res.sacks,
                ints: res.ints,
                takeaways: res.takeaways
            })
        }
    )

    const determineRankColor = (rankValue) => {
        if (rankValue <= 8) { return "text-green-500" } else
        if (rankValue <= 16) { return "text-yellow-500" } else
        if (rankValue <= 24) { return "text-orange-500" } else
        return "text-red-500"
    }
    
    const displayTeamRankings = (ranks) => {
        var output = []

        for (var rank in ranks) {
            output.push(
                <div key={ ranks[rank].name }>
                    <p className="font-semibold pb-1">{ ranks[rank].displayName }</p>
                    <p className={ determineRankColor(ranks[rank].rank) }>{ ranks[rank].rankDisplayValue }</p>
                </div>
            )  
        }
        
        return output  
    }
    

    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason()
    }, [])

    useEffect(() => {
        getTeamRankings()
    }, [teamID])

    return (
        <>
            <h2 className="font-protest text-3xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } season overview</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div>
                    <h3  className="font-protest text-2xl pb-2">Offensive rankings</h3>
                    <div className="font-rubik grid grid-cols-2 md:grid-cols-4 gap-3 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(offensiveRanks) }
                    </div>
                </div>
                <div>
                    <h3 className="font-protest text-2xl pb-2">Defensive rankings</h3>
                    <div className="font-rubik grid grid-cols-2 md:grid-cols-3 gap-3 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(defensiveRanks) }
                    </div>
                </div>
            </div>
        </>
    )
}