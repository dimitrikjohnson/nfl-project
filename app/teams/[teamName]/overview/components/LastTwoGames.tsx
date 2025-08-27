import { displayGameResult } from '@/app/helpers/displayGameInfo';
import formatLastTwoGames from '@/app/formatAPIcalls/formatLastTwoGames';
import SharedValues from "./SharedValues";

export default async function LastTwoGames({ teamID }: { teamID: string }) {
    const labelClasslist = "uppercase text-gray-500 dark:text-lighterSecondaryGrey mr-2";

    const lastTwoGames = await formatLastTwoGames(teamID);

    const displayGames = () => {
        return (
            <>
                { lastTwoGames.map(game =>
                    <div key={ game.date } className="font-rubik bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md p-3">
                        <SharedValues game={ game } />
                        <dl className="flex">
                            <dt className={ labelClasslist }>Result:</dt>
                            <dd>
                                { displayGameResult(game.teams, game.status, teamID) == false 
                                    ? "CANCELLED" 
                                    : displayGameResult(game.teams, game.status, teamID) 
                                }
                            </dd>
                        </dl>
                    </div>
                )}
            </>
        )
    }

    return (    
        <>
            { lastTwoGames.length > 0
                ? <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4">
                    { displayGames() }
                  </div>
                : <p className="text-center">This team has not played any games this season.</p>
            }
        </>
    )
}