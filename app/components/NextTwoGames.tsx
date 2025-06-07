import getNextTwoGames from "@/app/apiCalls/getNextTwoGames";
import { formatDateTime } from '@/app/helpers/dateFormatter';
import { displayHomeAway } from '@/app/helpers/displayGameInfo';

export default async function NextTwoGames({ teamID }: { teamID: string }) {
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2";
    let nextTwoGames = await getNextTwoGames(teamID);

    function whichIsGreater(awayChance: number, homeChance: number) {
        return awayChance > homeChance;
    }

    function displayWinProbabilities(teams: any[], awayChance: number , homeChance: number) {
        const homeTeam = teams.find(team => team.homeAway == "home");
        const awayTeam = teams.find(team => team.homeAway == "away");

        return (
            <div className="w-full flex justify-between">
                <div className={`text-left ${whichIsGreater(awayChance, homeChance) || "text-lighterSecondaryGrey"} `}>
                    <p className="pb-1">{ awayTeam.team.shortDisplayName }</p>
                    <p className="font-bold text-3xl">{ awayChance }%</p>
                </div>
                <div className={`text-right ${whichIsGreater(awayChance, homeChance) && "text-lighterSecondaryGrey"} `}>
                    <p className="pb-1">{ homeTeam.team.shortDisplayName }</p>
                    <p className="font-bold text-3xl">{ homeChance }%</p>
                </div>
            </div>
        )
    }

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
                        <p>
                            <span className={ labelClasslist }>Network:</span>
                            <span>{ game.network }</span>
                        </p>
                        { (game.awayChance && game.homeChance) &&
                            <>
                                <p className="font-bold pt-6 pb-2 mb-2 mr-3 border-b-2">Win Probability</p>
                                <div className="flex justify-between mr-3">
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
        <div className="font-rubik bg-sectionColor rounded-md p-3">
            { nextTwoGames.length > 0
                ? <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4">
                    { displayGames() }
                </div>
                : <p className="text-center">This team does not have any upcoming games.</p>
            }
        </div>
    )
}