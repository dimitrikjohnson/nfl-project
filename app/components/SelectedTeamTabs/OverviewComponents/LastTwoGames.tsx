import 'client-only';
import { useState, useEffect } from 'react';
import { formatDateTime } from '../../helpers/dateFormatter';
import { displayHomeAway, displayGameResult } from '../../helpers/displayGameInfo';
import getLastTwoGames from '@/app/apiCalls/getLastTwoGames';
import getTeam from '@/app/apiCalls/getTeam';

export default function LastTwoGames({ teamID }) {
    const [lastTwoGames, setLastTwoGames] = useState([])
    const [team, setTeam] = useState([])
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2.5"

    const getGames = () => getLastTwoGames( teamID ).then(
        (res) => setLastTwoGames(res)
    )

    const getSelectedTeam = () => getTeam({ teamID }).then(
        (res) => setTeam(res)
    )

    const displayGames = () => {
        return (
            <>
                { lastTwoGames.map(game =>
                    <div key={ game.date + " game" } className="first-of-type:border-r-2 border-cyan-400">
                        <p className="pb-2">
                            <span className={ labelClasslist }>Date:</span>
                            <span className="hidden md:inline-block">{ formatDateTime(game.date).long }</span>
                            <span className="md:hidden">{ formatDateTime(game.date).short }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ labelClasslist }>Season Type:</span>
                            <span className="hidden md:inline-block">{ game.seasonType.long }</span>
                            <span className="md:hidden">{ game.seasonType.short }</span>
                        </p>
                        <p className="flex pb-2">
                            <span className={ "hidden md:inline-block " + labelClasslist }>Opponent:</span>
                            <span className={ "md:hidden " + labelClasslist }>OPP:</span>
                            { displayHomeAway(game.teams, teamID) }
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
            totalYards += game.chosenTeamStats.totalYards
            passingYards += game.chosenTeamStats.passingYards
            rushingYards += game.chosenTeamStats.rushingYards

            totalYardsAllowed += game.chosenTeamStats.totalYardsAllowed
            passingYardsAllowed += game.chosenTeamStats.passingYardsAllowed
            rushingYardsAllowed += game.chosenTeamStats.rushingYardsAllowed
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
                    ypgLabel: "Yards Per Game:",
                    ypgLabelShort: "YDS/G:",
                    
                    pypg: avgPassing,
                    pypgLabel: "Passing Yards Per Game:",
                    pypgLabelShort: "PYDS/G:",

                    rypg: avgRushing,
                    rypgLabel: "Rushing Yards Per Game:",
                    rypgLabelShort: "RYDS/G:"
                }
            },
            {
                heading: "Defense",
                stats: {
                    ypg: avgYPGAllowed,
                    ypgLabel: "Yards Allowed Per Game:",
                    ypgLabelShort: "YDS A/G:",
                    
                    pypg: avgPassingAllowed,
                    pypgLabel: "Passing Yards Allowed Per Game:",
                    pypgLabelShort: "PYDS A/G:",

                    rypg: avgRushingAllowed,
                    rypgLabel: "Rushing Yards Allowed Per Game:",
                    rypgLabelShort: "RYDS A/G:",
                }
            }
        ]

        return (
            <>
                { sections.map(section =>
                    <div key={ section.heading } className="first-of-type:border-r-2 border-cyan-400">
                        <p className="font-semibold pb-2">{ section.heading }</p>
                        <p className="pb-2">
                            <span className={ "hidden md:inline-block " + labelClasslist }>{ section.stats.ypgLabel }</span>
                            <span className={ "md:hidden " + labelClasslist }>{ section.stats.ypgLabelShort }</span>
                            <span>{ section.stats.ypg }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ "hidden md:inline-block " + labelClasslist }>{ section.stats.pypgLabel }</span>
                            <span className={ "md:hidden " + labelClasslist }>{ section.stats.pypgLabelShort }</span>
                            <span>{ section.stats.pypg }</span>
                        </p>
                        <p className="pb-2">
                            <span className={ "hidden md:inline-block " + labelClasslist }>{ section.stats.rypgLabel }</span>
                            <span className={ "md:hidden " + labelClasslist }>{ section.stats.rypgLabelShort }</span>
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
            <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Last Two Games</h3>
            <div className="font-rubik bg-sectionColor rounded-md p-3 mb-2">
                <div className="grid grid-cols-2 gap-5 pb-10">
                    { displayGames() }
                </div>
                <h4 className="uppercase text-lg pb-2 mb-3 border-b-2">
                    { team.name } Stats Over Span
                </h4>
                <div className="grid grid-cols-2 gap-5">
                    { displayStats() }
                </div>
            </div>
            <legend className="md:hidden text-sm">Legend: YDS/G = Yards Per Game, PYDS = Passing Yards, RYDS = Rushing Yards, YDS A = Yards Allowed</legend>
        </div>
    )
}