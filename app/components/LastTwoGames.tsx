import { cache } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { formatDateTime } from '../helpers/dateFormatter';
import { displayHomeAway, displayGameResult } from '../helpers/displayGameInfo';
import formatLastTwoGames from '@/app/formatAPIcalls/formatLastTwoGames';
import cacheTeam from "@/app/helpers/cacheTeam";

export const getTeam = cache(cacheTeam);

export default async function LastTwoGames({ teamID }) {
    const team = await getTeam(teamID);
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
                            <span>{ formatDateTime(game.date).short }</span>
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
                            <span className={ labelClasslist }>Result:</span>
                            <span>{ displayGameResult(game.teams, game.status, teamID) == false ? "CANCELLED" : displayGameResult(game.teams, game.status, teamID) }</span>
                        </p>
                    </div>
                )}
            </>
        )
    }

    const displayStats = () => {
        let totalYards = 0, 
        passingYards = 0, 
        rushingYards = 0, 
        totalYardsAllowed = 0, 
        passingYardsAllowed = 0, 
        rushingYardsAllowed = 0

        for (const game of lastTwoGames) {
            totalYards += game.chosenTeamStats.totalYards;
            passingYards += game.chosenTeamStats.passingYards;
            rushingYards += game.chosenTeamStats.rushingYards;

            totalYardsAllowed += game.chosenTeamStats.totalYardsAllowed;
            passingYardsAllowed += game.chosenTeamStats.passingYardsAllowed;
            rushingYardsAllowed += game.chosenTeamStats.rushingYardsAllowed;
        }

        const avgYPG = totalYards / 2,
        avgPassing = passingYards / 2,
        avgRushing = rushingYards / 2,
        avgYPGAllowed = totalYardsAllowed / 2,
        avgPassingAllowed = passingYardsAllowed / 2,
        avgRushingAllowed = rushingYardsAllowed / 2

        // put display information in array to avoid repeating markup
        const sections = [
            {
                heading: "Offense",
                stats: {
                    ypg: avgYPG,
                    //ypgLabel: "Yards Per Game",
                    ypgLabelShort: "YDS/G",
                    
                    pypg: avgPassing,
                    //pypgLabel: "Passing Yards Per Game",
                    pypgLabelShort: "PYDS/G",

                    rypg: avgRushing,
                    //rypgLabel: "Rushing Yards Per Game",
                    rypgLabelShort: "RYDS/G"
                }
            },
            {
                heading: "Defense",
                stats: {
                    ypg: avgYPGAllowed,
                    //ypgLabel: "Yards Allowed Per Game",
                    ypgLabelShort: "YDS A/G",
                    
                    pypg: avgPassingAllowed,
                    //pypgLabel: "Passing Yards Allowed Per Game",
                    pypgLabelShort: "PYDS A/G",

                    rypg: avgRushingAllowed,
                    //rypgLabel: "Rushing Yards Allowed Per Game",
                    rypgLabelShort: "RYDS A/G",
                }
            }
        ];

        return (
            <>
                { sections.map(section =>
                    <div key={ section.heading } className="first-of-type:border-r-2 border-cyan-400">
                        <p className="font-semibold pb-2">{ section.heading }</p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>{ section.stats.ypgLabelShort }:</span>
                            <span>{ section.stats.ypg }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>{ section.stats.pypgLabelShort }:</span>
                            <span>{ section.stats.pypg }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>{ section.stats.rypgLabelShort }:</span>
                            <span>{ section.stats.rypg }</span>
                        </p>
                    </div>
                )}
            </>
        )
    }

    return (    
        <div className="font-rubik bg-sectionColor rounded-md p-3">
            <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4 pb-4 md:pb-10">
                { displayGames() }
            </div>
            <div className="flex pb-2 mb-3 border-b-2">
                <h4 className="uppercase md:text-lg mr-1.5">
                    { team.name } Stats Over Span
                </h4>
                <div className="relative group">
                    <FontAwesomeIcon className="text-lighterSecondaryGrey group-hover:text-white group-hover:cursor-pointer" icon={faCircleInfo} />
                    <legend className="invisible group-hover:visible absolute bottom-10 p-3 -left-44 md:-left-24 bg-stone-900 rounded-md border border-secondaryGrey/[.50] w-56 after:content-[''] after:absolute after:-bottom-1 after:w-2 after:h-2 after:left-[179px] md:after:left-[100px] after:rotate-45 after:bg-stone-900">
                        <p className="pb-2">
                            <span className="font-semibold">YDS/G</span> 
                            <span> = Yards Per Game</span>
                        </p>
                        <p className="pb-2">
                            <span className="font-semibold">PYDS</span> 
                            <span> = Passing Yards</span>
                        </p>
                        <p className="pb-2">
                            <span className="font-semibold">RYDS</span> 
                            <span> = Rushing Yards</span>
                        </p>
                        <p>
                            <span className="font-semibold">A/G</span> 
                            <span> = Allowed Per Game</span>
                        </p>
                    </legend>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                { displayStats() }
            </div>
        </div>
    )
}