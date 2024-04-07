import 'client-only';
import { useState, useEffect } from 'react';
import getTeamStats from '@/app/apiCalls/getTeamStats';

export default function TeamRankings({ teamID }) {
    const [offensiveRanks, setOffensiveRanks] = useState({})
    const [defensiveRanks, setDefensiveRanks] = useState({})

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
                    <p className="pb-2">{ ranks[rank].displayName }</p>
                    <p className={ determineRankColor(ranks[rank].rank) }>{ ranks[rank].rankDisplayValue }</p>
                </div>
            )  
        }
        return output  
    }

    useEffect(() => {
        getTeamRankings()
    }, [teamID])

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
                <div>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Offensive Rankings</h3>
                    <div className="font-rubik grid grid-cols-2 md:grid-cols-4 gap-3 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(offensiveRanks) }
                    </div>
                </div>
                <div>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Defensive Rankings</h3>
                    <div className="font-rubik grid grid-cols-2 md:grid-cols-3 gap-3 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(defensiveRanks) }
                    </div>
                </div>
            </div>
        </>
    )
}