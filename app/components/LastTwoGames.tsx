import '@fortawesome/fontawesome-svg-core/styles.css';

import { formatDateTime } from '@/app/helpers/dateFormatter';
import { displayHomeAway, displayGameResult } from '@/app/helpers/displayGameInfo';
import formatLastTwoGames from '@/app/formatAPIcalls/formatLastTwoGames';

export default async function LastTwoGames({ teamID }: { teamID: string }) {
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2";

    const lastTwoGames = await formatLastTwoGames(teamID);
    
    const displayGames = () => {
        return (
            <>
                { lastTwoGames.map(game =>
                    <div key={ game.date } className="first-of-type:border-b-2 pb-4 min-[425px]:pb-0 min-[425px]:first-of-type:border-b-0 min-[425px]:first-of-type:border-r-2 border-cyan-400">
                        <p className="pb-3">
                            { displayHomeAway(game.teams, teamID, true) }
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Date:</span>
                            { game.status.state == "in"
                                ? displayGameResult(game.teams, game.status, teamID, true)
                                : <>
                                    <span className="md:hidden">{ formatDateTime(game.date).short }</span>
                                    <span className="hidden md:inline-block">{ formatDateTime(game.date).long }</span>
                                  </>
                            }
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Type:</span>
                            <span className="hidden md:inline-block">{ game.seasonType?.name }</span>
                            <span className="inline-block md:hidden capitalize">{ game.seasonType?.abbreviation }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Week:</span>
                            <span>{ game.week }</span>
                        </p>
                        <p className="flex">
                            <span className={ labelClasslist }>Result:</span>
                            <span>
                                { displayGameResult(game.teams, game.status, teamID) == false 
                                    ? "CANCELLED" 
                                    : displayGameResult(game.teams, game.status, teamID) 
                                }
                            </span>
                        </p>
                    </div>
                )}
            </>
        )
    }

    return (    
        <div className="font-rubik bg-sectionColor rounded-md p-3">
            { lastTwoGames.length > 0
                ? <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4 pb-4 md:pb-10">
                    { displayGames() }
                  </div>
                : <p className="text-center">This team has not played any games this season.</p>
            }
        </div>
    )
}