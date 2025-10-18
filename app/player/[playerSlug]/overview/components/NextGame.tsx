import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';
import getPlayer from "@/app/apiCalls/getPlayer";
import getPlayerRecentAndUpcomingGames from "@/app/apiCalls/getPlayerRecentAndUpcomingGames";
import H3 from "@/app/components/H3";
import { UpcomingGame } from "@/app/formatAPIcalls/formatPlayerUpcomingGame";
import Link from "next/link";

type Colors = {
    bgColor: string,
    textColor: string
}

export default async function NextGame({ playerID } : { playerID: string }) {
    const game = await getPlayerRecentAndUpcomingGames(playerID, "upcoming") as UpcomingGame;

    if (!game) return undefined;

    const { awayTeam, homeTeam } = game;

    const gameInProgess = game.status == "in";

    // if the game is in progress, get the player's info (for his team's colors)
    let playerTeamColors: Colors;

    if (gameInProgess) {
        const player =  await getPlayer({ playerID });
        playerTeamColors = {
            bgColor: player.team.bgColor,
            textColor: player.team.textColor
        }
    }

    return (
        <div className="mb-9 md:mb-12">
            <H3>{ gameInProgess ? "Game In Progress" : "Next Game" }</H3>
            <div className="w-full bg-section border border-gray-300 dark:bg-section-dark dark:border-none p-2 md:p-2.5 rounded-md">
                <div className="flex justify-between text-center">
                    { displayTeam(awayTeam, "left", gameInProgess, game.teamWithPossession) }  
                    <div className="text-sm md:text-base flex flex-col justify-center">
                        { gameInProgess
                            ? <>
                                <p className="text-gray-500 dark:text-lighterSecondaryGrey pb-1">{ game.broadcast }</p>    
                                <p className="text-red-600 dark:text-red-400 font-semibold pb-1">
                                    <span aria-hidden className="animate-pulse">&#8226;</span>
                                    <span>LIVE</span>
                                </p>
                                <p>{ game.timeLeft }</p>
                            </>
                            : <>
                                <p className="text-gray-500 dark:text-lighterSecondaryGrey pb-1">{ game.weekText }</p>
                                <p className="pb-1">{ game.date }</p>
                                <p className="text-sm">
                                    <span>{ game.time }</span>
                                    <span className="mx-1 text-gray-500 dark:text-lighterSecondaryGrey" aria-label="Seperator">&#8226;</span>
                                    <span className="text-gray-500 dark:text-lighterSecondaryGrey">{ game.broadcast }</span>
                                </p>
                            </>
                        }                
                    </div>
                    { displayTeam(homeTeam, "right", gameInProgess, game.teamWithPossession) }    
                </div>  
                { (gameInProgess && (game.statsInCurrentGame && game.statsInCurrentGame.length > 0)) &&
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${game.statsInCurrentGame.length} gap-4 text-center mt-8`}>
                        { game.statsInCurrentGame.map(stat =>
                            <div key={ stat.longName } className="w-full bg-alt-table-row-dark border border-lighterSecondaryGrey rounded-md pb-2">
                                <p 
                                    className="text-sm font-semibold uppercase mb-3 py-1 rounded-t-md text-white" 
                                    style={{ backgroundColor: playerTeamColors.bgColor }}
                                >
                                    { stat.longName }
                                </p>
                                <p className="text-xl font-bold">{ stat.value }</p>
                            </div>
                        )}    
                    </div>         
                }
            </div>
        </div>
    )
}

function displayTeam(team: any, direction: string, gameInProgess: boolean, teamWithPossession: string | false | undefined) {
    return (
        <div className="flex gap-5 sm:gap-10 md:gap-20 justify-between items-center">
            <Link className={`group flex flex-col sm:flex-row gap-2 md:gap-3.5 items-center ${direction == "left" ? "order-1" : "order-2"}`} href={ team.link }>
                <div className={`rounded-md p-1 ${direction == "left" ? "sm:order-1" : "sm:order-2"}`} style={{ backgroundColor: team.color }}>
                    <img className="w-14 md:w-20" src={ team.logo } alt={`${team.name} logo`} />    
                </div>     
                <div className={direction == "left" ? "sm:order-2" : "sm:order-1"}>
                    <div className="flex items-center gap-1.5 sm:block mb-1">
                        <p className={`md:hidden text-sm font-semibold text-${direction} text-blue-800 dark:text-cyan-400 group-hover:underline sm:pb-1`}>{ team.abbreviation }</p>
                        <p className={`hidden md:block font-semibold text-${direction} text-blue-800 dark:text-cyan-400 group-hover:underline sm:pb-1`}>{ team.name }</p>
                        <p className={`text-sm text-gray-500 text-${direction} dark:text-lighterSecondaryGrey`}>{ team.record }</p>    
                    </div>
                    <p className={`text-sm italic text-gray-500 text-${direction} dark:text-lighterSecondaryGrey`}>{ direction == "left" ? "Away" : "Home" }</p>
                </div>
            </Link>  
            { gameInProgess &&
                <div className={`flex gap-2 lg:gap-3 items-center ${direction == "left" ? "order-2" : "order-1"}`}>
                    { teamWithPossession == team.id &&
                        <FontAwesomeIcon className="text-sm" icon={faFootball} transform={{ rotate: 80 }} />
                    }
                    <p className={`text-3xl sm:text-4xl font-bold`}>{ team.score }</p> 
                </div>
            }  
        </div>
    )
}