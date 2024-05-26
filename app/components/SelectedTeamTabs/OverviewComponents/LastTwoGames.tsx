import 'client-only';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate, formatDateTime } from '../../helpers/dateFormatter';
import { displayHomeAway, displayGameResult } from '../../helpers/displayGameInfo';
import getLastTwoGames from '@/app/apiCalls/getLastTwoGames';
import getTeam from '@/app/apiCalls/getTeam';

export default function LastTwoGames({ teamID }) {
    const [lastTwoGames, setLastTwoGames] = useState([]);
    const [team, setTeam] = useState([]);
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2";

    const getGames = () => getLastTwoGames( teamID ).then(
        (res) => setLastTwoGames(res)
    );

    const getSelectedTeam = () => getTeam({ teamID }).then(
        (res) => setTeam(res)
    );

    const displayGames = () => {
        return (
            <>
                { lastTwoGames.map(game =>
                    <div key={ game.date } className="first-of-type:border-b-2 pb-4 sm:pb-0 sm:first-of-type:border-b-0 sm:first-of-type:border-r-2 border-cyan-400">
                        <p className="pb-2">
                            <span className={ labelClasslist }>Date:</span>
                            <span>{ formatDateTime(game.date).short }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Season Type:</span>
                            <span className="inline-block lg:hidden xl:inline-block">{ game.seasonType.long }</span>
                            <span className="hidden lg:inline-block xl:hidden">{ game.seasonType.short }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Week:</span>
                            <span>{ game.week }</span>
                        </p>
                        <p className="flex pb-2">
                            <span className={ labelClasslist }>Opponent:</span>
                            { displayHomeAway(game.teams, teamID, true) }
                        </p>
                        <p>
                            <span className={ labelClasslist }>Result:</span>
                            <span>{ displayGameResult(game.teams, game.status, teamID) }</span>
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

    useEffect(() => {
        getGames(),
        getSelectedTeam()
    }, [teamID])

    return (
        <div>
            <h3 className="font-protest pb-2 text-2xl 2xl:text-3xl">Last Two Games</h3>    
            <div className="font-rubik bg-sectionColor rounded-md p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 md:pb-10">
                    { displayGames() }
                </div>
                <div className="flex pb-2 mb-3 border-b-2">
                    <h4 className="uppercase md:text-lg mr-1.5">
                        { team.name } Stats Over Span
                    </h4>
                    <div className="relative group">
                        <FontAwesomeIcon className="text-lighterSecondaryGrey group-hover:text-white group-hover:cursor-pointer" icon="fa-solid fa-circle-info" />
                        <legend className="invisible group-hover:visible absolute bottom-10 p-3 -left-44 md:-left-24 bg-stone-900 rounded-md border border-secondaryGrey/[.50] w-56 after:content-[''] after:absolute after:-bottom-1 after:w-2 after:h-2 after:left-[179px] md:after:left-[100px] after:rotate-45 after:bg-stone-900">
                            <div className="pb-2">
                                <span className="font-semibold">YDS/G</span> 
                                <span> = Yards Per Game</span>
                            </div>
                            <div className="pb-2">
                                <span className="font-semibold">PYDS</span> 
                                <span> = Passing Yards</span>
                            </div>
                            <div className="pb-2">
                                <span className="font-semibold">RYDS</span> 
                                <span> = Rushing Yards</span>
                            </div>
                            <div>
                                <span className="font-semibold">A/G</span> 
                                <span> = Allowed Per Game</span>
                            </div>
                        </legend>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    { displayStats() }
                </div>
            </div>
        </div>
    )
}