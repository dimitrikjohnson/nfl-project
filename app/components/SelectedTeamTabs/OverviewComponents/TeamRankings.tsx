import 'client-only';
import { useState, useEffect } from 'react';
import getOverviewRankings from '@/app/apiCalls/getOverviewRankings';
import getRankColor from '../../../helpers/getRankColor';

export default function TeamRankings({ teamID }) {
    const [offensiveRanks, setOffensiveRanks] = useState({});
    const [defensiveRanks, setDefensiveRanks] = useState({});

    const getTeamRankings = () => getOverviewRankings(teamID).then(
        (res) => {
            /*
            setOffensiveRanks({
                ppg: res.ppg,
                ypg: res.ypg,
                passingYPG: res.passingYPG,
                rushingYPG: res.rushingYPG
            });
            setDefensiveRanks({
                sacks: res.sacks,
                ints: res.ints,
                takeaways: res.takeaways
            });
            */
            setOffensiveRanks(res.offense);
            setDefensiveRanks(res.defense);
        }
    )
    
    const displayTeamRankings = (ranks) => { 
        return (
            <>
                { Object.keys(ranks).map(rank =>
                    <div key={ ranks[rank].longName } className="grid grid-rows-2 gap-2 content-between">
                        <p>{ ranks[rank].shortName }</p>
                        <p className={ getRankColor(ranks[rank].rank, false) }>{ ranks[rank].rankDisplayValue }</p>
                    </div> 
                )}
            </>
        )
    }

    useEffect(() => {
        getTeamRankings()
    }, [teamID])

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Offensive Rankings</h3>
                    <div className="font-rubik grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(offensiveRanks) }
                    </div>
                </div>
                <div>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Defensive Rankings</h3>
                    <div className="font-rubik grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(defensiveRanks) }
                    </div>
                </div>
            </div>
        </>
    )
}