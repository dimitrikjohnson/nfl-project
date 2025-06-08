import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootballBall } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

import formatScoreboard from "../formatAPIcalls/formatScoreboard";
import { formatDateTime } from "../helpers/dateFormatter";
import { GameData, CompetitorTeam } from "@/app/types/schedule";

export default async function Scoreboard() {
    const scoreboard = await formatScoreboard();
    const weekNum = scoreboard[0];
    const weekDetail = scoreboard[1];
    const games = scoreboard[2];
    
    return (
        <section className="overflow-x-auto bg-altTableRow drop-shadow-md">
            <div className="w-full flex text-nowrap font-rubik">
                <div className="text-sm flex flex-col justify-center items-center px-2.5 md:px-4 border-r-2 border-secondaryGrey">
                    <p className="text-lighterSecondaryGrey pb-1">WEEK</p>
                    <p className="font-bold pb-1">{ weekNum }</p>
                    <p className="text-lighterSecondaryGrey text-xs">{ weekDetail }</p>
                </div>
                { games.map((game: GameData) =>
                    <div className="px-2.5 md:px-4 pt-1.5 border-r-2 border-secondaryGrey" key={ game.id }>
                        <div className="flex pb-2">
                            <div className="w-full">
                                { game.teams?.map((team: CompetitorTeam) =>
                                    <div key={ team.team.id } className="flex gap-x-12 justify-between">
                                        <div className="flex gap-x-2 items-center">
                                            <img className="w-6" src={ team.team.logo } alt={`${ team.team.shortDisplayName } logo`} />
                                            <div className={`${ team.winner == false && "text-lighterSecondaryGrey" }`}>{ team.team.abbreviation }</div>
                                            { (game.state == "in" && game.possession == team.team.id) &&
                                                <FontAwesomeIcon className="text-sm text-[#804d14]" icon={faFootballBall} transform={{ rotate: 46 }} /> 
                                            }
                                        </div>
                                        <div className={`${ team.winner == false ? "text-lighterSecondaryGrey" : game.state == "pre" ? "flex items-center text-lighterSecondaryGrey text-sm italic" : "font-semibold" }`}>
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
                            {/* game.downDistance &&
                                <div className="flex flex-col text-sm justify-center border-l border-secondaryGrey ml-3 pl-3">
                                    <div>{ game.downDistance }</div>
                                    <div>{ game.yardLine }</div>    
                                </div>
                            */}
                        </div>
                        <div className="flex text-sm justify-between gap-x-3 md:gap-x-6 min-w-28">
                            { game.state == "pre" 
                                ? <>
                                    <div>{ formatDateTime(game.date).scoreboard }</div>                     
                                    <div className="text-lighterSecondaryGrey">{ game.network }</div>
                                </>
                                : game.state == "in"
                                    ? <>
                                        <div className="text-red-400 font-semibold">{ game.statusText }</div>
                                        { game.downDistance && 
                                            <div className="text-lighterSecondaryGrey">{ game.downDistance }</div> 
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