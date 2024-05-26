import { useState, useEffect } from "react";
import getNextTwoGames from "@/app/apiCalls/getNextTwoGames";
import { formatDateTime } from '../../helpers/dateFormatter';
import { displayHomeAway } from '../../helpers/displayGameInfo';
//import getTeamSchedule from "@/app/apiCalls/getTeamSchedule";

export default function NextTwoGames({ teamID }) {
    const [nextTwoGames, setNextTwoGames] = useState([]);
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2";
    
    const getGames = () => getNextTwoGames( {teamID} ).then(
        (res) => setNextTwoGames(res) 
    );

    const displayGames = () => {
        return (
            <>
                { nextTwoGames.map(game =>
                    <div key={ game.id } className="first-of-type:border-b-2 pb-4 sm:pb-0 sm:first-of-type:border-b-0 sm:first-of-type:border-r-2 border-cyan-400">
                        <p className="pb-2">
                            <span className={ labelClasslist }>Date:</span>
                            <span>{ formatDateTime(game.date).short }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Season Type:</span>
                            <span className="inline-block lg:hidden xl:inline-block">{ game.seasonType.name }</span>
                            <span className="hidden lg:inline-block xl:hidden capitalize">{ game.seasonType.abbreviation }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Week:</span>
                            <span>{ game.week }</span>
                        </p>
                        <p className="flex pb-2">
                            <span className={ labelClasslist }>Opponent:</span>
                            { displayHomeAway(game.teams, teamID, true) }
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Spread:</span>
                            <span>{ game.spread }</span>
                        </p>
                        <p>
                            <span className={ labelClasslist }>Over/Under:</span>
                            <span>{ game.overUnder }</span>
                        </p>
                    </div>
                )}
            </>
        )
    }

    useEffect(() => {
        getGames()
    }, [teamID])

    return (
        <div>
            <h3 className="font-protest pb-2 text-2xl 2xl:text-3xl">Next Two Games</h3>
            <div className="font-rubik bg-sectionColor rounded-md p-3">
                { nextTwoGames.length > 0
                    ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 md:pb-10">
                        { displayGames() }
                      </div>
                    : <p className="text-center">This team does not have any upcoming games.</p>
                }
            </div>
        </div>
    )
    
}