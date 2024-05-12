import 'client-only';
import { useState, useEffect } from 'react';
import getTeamLeaders from '@/app/apiCalls/getTeamLeaders';
//import allTeamsColors from "../../data/allTeamsColors.json";

export default function TeamLeaders({ teamID, responseType }) {
    const [teamLeaders, setTeamLeaders] = useState([{}]);
    //const [teamColors, setTeamColors] = useState({});

    const getStatLeaders = () => getTeamLeaders(teamID, responseType).then(
        (res) => setTeamLeaders(res)
    )

    const displayTeamLeaders = () => {
        // if a player is no longer on a team, their jersey number disappears
        // this function accounts for the possibility of a missing number
        const isJerseyNumPresent = (num) => {
            if (num) {
                return <span>&#183; #{ num }</span>
            }
        }

        return (<>
            { teamLeaders.map(stat =>
                <>
                    {/*
                    <div key={ stat.statName + stat.playerName } className="bg-sectionColor p-3 rounded-md">
                        <p className="pb-1 mb-3 border-b">{ stat.statName }</p>
                        <div className="flex gap-3">
                            <div className="w-40 rounded-sm shrink-0" style={{ background: '#' + teamAltColor }}>
                                <img src={ stat.playerHeadshot } alt={ stat.playerName } />
                            </div>
                            <div>
                                <div className="flex gap-2 flex-wrap">
                                    <p className="font-semibold">{ stat.playerName }</p>
                                    <p className="pb-2 text-lighterSecondaryGrey">{ stat.playerPosition } { isJerseyNumPresent(stat.playerJersey) }</p>
                                </div>
                                <p>{ stat.statValue }</p>
                            </div>
                        </div>
                    </div>
                    */}
                    <div key={ stat.statName + stat.playerName } className="bg-sectionColor grid justify-center justify-items-center text-center pt-3 px-3 pb-0 rounded-md"
                    //style={{ backgroundColor: teamColors.bgColor, color: teamColors.textColor }}
                    >
                        <p className="mb-2 uppercase">{ stat.statName }</p>
                        <p className="mb-2 font-semibold text-lg">{ stat.statValue }</p>
                        <p className="mb-1">{ stat.playerName }</p>
                        <p className="text-sm text-lighterSecondaryGrey mb-2">{ stat.playerPosition } { isJerseyNumPresent(stat.playerJersey) }</p>
                        <div className="w-32 md:w-40 rounded-sm shrink-0">
                            <img src={ stat.playerHeadshot } alt={ stat.playerName } />
                        </div>
                    </div>
                </>
            )}
        </>)
    }

    useEffect(() => {
        getStatLeaders()
        //setTeamColors(allTeamsColors[teamID])
    }, [teamID])

    return (
        <>
            <div className="mb-10">
                <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Team Leaders</h3>
                {/*
                <div className="font-rubik grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                    { displayTeamLeaders() }
                </div>
                */}
                <div className="font-rubik grid grid-cols-2 md:grid-cols-4 gap-4">
                    { displayTeamLeaders() }
                </div>
            </div>
        </>
    )
}