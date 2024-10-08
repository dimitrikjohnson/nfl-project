import getNextTwoGames from "@/app/apiCalls/getNextTwoGames";
import { formatDateTime } from '@/app/helpers/dateFormatter';
import { displayHomeAway } from '@/app/helpers/displayGameInfo';

export default async function NextTwoGames({ teamID }) {
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2";
    let nextTwoGames = await getNextTwoGames(teamID);

    const displayGames = () => {
        return (
            <>
                { nextTwoGames.map(game =>
                    <div key={ game.id } className="first-of-type:border-b-2 pb-4 min-[425px]:pb-0 min-[425px]:first-of-type:border-b-0 min-[425px]:first-of-type:border-r-2 border-cyan-400">
                        <p className="pb-3">
                            { displayHomeAway(game.teams, teamID, true) }
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Date:</span>
                            <span className="md:hidden">{ formatDateTime(game.date).short }</span>
                            <span className="hidden md:inline-block">{ formatDateTime(game.date).long }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Type:</span>
                            <span className="hidden md:inline-block">{ game.seasonType.name }</span>
                            <span className="inline-block md:hidden capitalize">{ game.seasonType.abbreviation }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Week:</span>
                            <span>{ game.week }</span>
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

    return (
        <div className="font-rubik bg-sectionColor rounded-md p-3 grow">
            { nextTwoGames.length > 0
                ? <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4 pb-4 md:pb-10">
                    { displayGames() }
                </div>
                : <p className="text-center">This team does not have any upcoming games.</p>
            }
        </div>
    )
}