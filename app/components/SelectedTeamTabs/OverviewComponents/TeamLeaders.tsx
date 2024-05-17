import 'client-only';
import { useState, useEffect } from 'react';
import getTeamLeaders from '@/app/apiCalls/getTeamLeaders';

export default function TeamLeaders({ teamID, responseType }) {
    const [teamLeaders, setTeamLeaders] = useState([{}]);

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
                <div key={ stat.statName + stat.playerName } className="bg-sectionColor grid justify-center justify-items-center text-center pt-3 px-3 pb-0 rounded-md">
                    <p className="mb-2 uppercase">{ stat.statName }</p>
                    <p className="mb-2 font-semibold text-lg">{ stat.statValue }</p>
                    <p className="mb-1">{ stat.playerName }</p>
                    <p className="text-sm text-lighterSecondaryGrey mb-2">{ stat.playerPosition } { isJerseyNumPresent(stat.playerJersey) }</p>
                    <div className="w-32 md:w-40 rounded-sm shrink-0">
                        <img src={ stat.playerHeadshot } alt={ stat.playerName } />
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
                <div className="font-rubik grid grid-cols-2 md:grid-cols-4 gap-4">
                    { displayTeamLeaders() }
                </div>
            </div>
        </>
    )
}