import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import formatScoreboard from "@/app/formatAPIcalls/formatScoreboard";
import { formatDateTime } from "@/app/helpers/dateFormatter";
import { GameData, CompetitorTeam } from "@/app/types/schedule";

export const revalidate = 30;  // revalidate after 30 seconds

export default async function Scoreboard() {
    const scoreboard = await formatScoreboard();
    const weekNum = scoreboard[0];
    const weekDetail = scoreboard[1];
    const games = scoreboard[2];

    const gameBoxStyling = "px-2.5 md:px-3.5 py-1.5 bg-section border border-gray-300 dark:bg-alt-table-row-dark dark:border-secondaryGrey rounded-md";
    
    return (
        <section className="overflow-x-auto relative mt-1 z-30 drop-shadow-md custom-scrollbar" aria-label={`Scoreboard for games during the week of ${weekDetail}`}>
            <div className="w-full flex gap-2 text-nowrap">
                <div className={`text-sm flex flex-col justify-center items-center px-2.5  bg-section border border-gray-300 dark:bg-alt-table-row-dark dark:border-secondaryGrey rounded-md`}>
                    <p className="text-gray-500 dark:text-lighterSecondaryGrey pb-1">WEEK</p>
                    <p className="font-bold pb-1">{ weekNum }</p>
                    <p className="text-gray-500 dark:text-lighterSecondaryGrey text-xs">{ weekDetail }</p>
                </div>
                { games.map((game: GameData) =>
                    <div className={ gameBoxStyling } key={ game.id }>
                        <div className="flex pb-2">
                            <div className="w-full">
                                { game.teams?.map((team: CompetitorTeam) =>
                                    <div key={ team.team.id } className="flex gap-x-12 justify-between">
                                        <div className="flex gap-x-2 items-center">
                                            <img className="w-6" src={ team.team.logo } alt={`${ team.team.shortDisplayName } logo`} />
                                            <div className={`${ team.winner == false && "text-gray-500 dark:text-lighterSecondaryGrey" }`}>{ team.team.abbreviation }</div>
                                            { (game.state == "in" && game.possession == team.team.id) &&
                                                <FontAwesomeIcon className="text-sm" icon={faFootball} transform={{ rotate: 80 }} /> 
                                            }
                                        </div>
                                        <div className={`${ team.winner == false 
                                            ? "text-gray-500 dark:text-lighterSecondaryGrey" 
                                            : game.state == "pre" 
                                                ? "flex items-center text-gray-500 dark:text-lighterSecondaryGrey text-sm" 
                                                : "font-semibold" 
                                        }`}>
                                            { game.state == "pre" 
                                                ? team.records && team.records[0].summary
                                                : <>
                                                    { typeof team.score === "object" && team.score !== null
                                                        ? team.score.value
                                                        : team.score
                                                    }
                                                </> 
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex text-sm justify-between gap-x-3 md:gap-x-6 min-w-28">
                            { game.state == "pre" 
                                ? <>
                                    <div>{ formatDateTime(game.date).scoreboard }</div>                     
                                    <div className="text-gray-500 dark:text-lighterSecondaryGrey">{ game.network }</div>
                                </>
                                : game.state == "in"
                                    ? <>
                                        <div className="text-red-600 dark:text-red-400 font-semibold">{ game.statusText }</div>
                                        { game.downDistance && 
                                            <div className="text-gray-500 dark:text-lighterSecondaryGrey">{ game.downDistance }</div> 
                                        }
                                    </>
                                    : game.state == "post" && <div>{ game.statusText }</div>
                            }
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}