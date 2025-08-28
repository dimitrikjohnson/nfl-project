import getNextTwoGames from "@/app/apiCalls/getNextTwoGames";
import { displayHomeAway } from "@/app/helpers/displayGameInfo";
import { formatDateTime } from "@/app/helpers/dateFormatter";

export default async function NextTwoGames({ teamID }: { teamID: string }) {
    const labelClasslist = "uppercase text-gray-500 dark:text-lighterSecondaryGrey mr-2";
    let nextTwoGames = await getNextTwoGames(teamID);

    const displayGames = () => {
        return (
            <>
                { nextTwoGames.map(game =>
                    <div 
                        key={ game.id } 
                        className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md p-3"
                    >   
                        <div className="pb-3">
                            { displayHomeAway(game.teams, teamID, true) }
                        </div>
                        <dl className="flex pb-2">
                            <dt className={ labelClasslist }>Date:</dt>
                            <dd className="md:hidden">{ formatDateTime(game.date).short }</dd>
                            <dd className="hidden md:inline-block">{ formatDateTime(game.date).long }</dd>
                        </dl>
                        <dl className="flex pb-2">
                            <dt className={ labelClasslist }>Type:</dt>
                            <dd className="hidden md:inline-block">{ game.seasonType?.name }</dd>
                            <dd className="inline-block md:hidden capitalize">{ game.seasonType?.abbreviation }</dd>
                        </dl>
                        <dl className="flex pb-2">
                            <dt className={ labelClasslist }>Week:</dt>
                            <dd>{ game.week }</dd>
                        </dl>   
                        <dl className="flex">
                            <dt className={ labelClasslist }>Network:</dt>
                            <dd>{ game.network }</dd>
                        </dl>
                        { (game.awayChance && game.homeChance) &&
                            <>
                                <div className="flex gap-2 items-end mt-8 pb-2 mb-2 border-b-2 border-primary dark:border-primary-dark">
                                    <span>Win Probability</span> 
                                    <span className="text-sm italic text-gray-500 dark:text-lighterSecondaryGrey">by ESPN</span>
                                </div>
                                <div className="flex justify-between">
                                    { displayWinProbabilities(game.teams, game.awayChance, game.homeChance) }
                                </div>
                            </>
                        }
                    </div>
                )}
            </>
        )
    }

    return (
        <>
            { nextTwoGames.length > 0
                ? <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4">
                    { displayGames() }
                </div>
                : <p className="text-center">This team does not have any upcoming games.</p>
            }
        </>
    )
}

function whichIsGreater(awayChance: number, homeChance: number) {
    return awayChance > homeChance;
}

function displayWinProbabilities(teams: any[], awayChance: number , homeChance: number) {
    const homeTeam = teams.find(team => team.homeAway == "home");
    const awayTeam = teams.find(team => team.homeAway == "away");

    const lessPercentageStyling = "font-normal text-gray-500 dark:text-lighterSecondaryGrey";

    return (
        <div className="w-full flex justify-between">
            <div className={`font-bold text-left ${whichIsGreater(awayChance, homeChance) || lessPercentageStyling}`}>
                <p className="pb-1">{ awayTeam.team.shortDisplayName }</p>
                <p className="font-bold text-3xl">{ awayChance }%</p>
            </div>
            <div className={`font-bold text-right ${whichIsGreater(awayChance, homeChance) && lessPercentageStyling}`}>
                <p className="pb-1">{ homeTeam.team.shortDisplayName }</p>
                <p className="font-bold text-3xl">{ homeChance }%</p>
            </div>
        </div>
    )
}