import 'client-only';
import { useState, useEffect } from 'react';
import getTeamLeaders from '@/app/apiCalls/getTeamLeaders';

export default function TeamLeaders({ teamID, teamAltColor }) {
    const [teamLeaders, setTeamLeaders] = useState([{}])

    const getStatLeaders = () => getTeamLeaders(teamID, "overview").then(
        (res) => setTeamLeaders(res)
    )

    const displayTeamLeaders = () => {
        // if a player is no longer on a team, their jersey number disappears
        // this function accounts for the possibility of a missing number
        const isJerseyNumPresent = (num) => {
            if (num) {
                return <span>&#183; #{ num }</span>
            }
            return null
        }

        return (<>
            { teamLeaders.map(stat =>
                <div key={ stat.statName + stat.playerName } className="bg-sectionColor p-3 rounded-md">
                    <p className="pb-1 mb-3 border-b">{ stat.statName }</p>
                    <div className="flex gap-3">
                        <div className="w-40 rounded-sm shrink-0" style={{ background: '#' + teamAltColor }}>
                            <img src={ stat.playerHeadshot } alt={ stat.playerName } />
                        </div>
                        <div>
                            <div className="flex gap-2 flex-wrap">
                                <p className="font-semibold"> { stat.playerName } </p>
                                <p className="pb-2 text-lighterSecondaryGrey">{ stat.playerPosition } { isJerseyNumPresent(stat.playerJersey) }</p>
                            </div>
                            <p>{ stat.statValue }</p>
                        </div>
                    </div>
                </div>
            )}
        </>)
    }

    useEffect(() => {
        getStatLeaders()
    }, [teamID])

    return (
        <>
            <div className="mb-10">
                <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Team Leaders</h3>
                <div className="font-rubik grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                    { displayTeamLeaders() }
                </div>
            </div>
        </>
    )
}