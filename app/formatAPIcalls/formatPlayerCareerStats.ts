import replaceHttp from "@/app/helpers/replaceHttp";
import { fantasyPositions } from "@/app/data/fantasyPositions";
import { calculateFantasyPoints, findStat } from "@/app/helpers/calculateFantasyPoints";
import { idToName } from "@/app/helpers/idToName";
import getGamesPlayed from "@/app/helpers/getGamesPlayed";
import type { Career } from "@/app/types/gameAndCareerStats";
import { buildHeadings } from "./formatPlayerGames";
import extractSeasonFromURL from "../helpers/extractSeasonFromURL";

export default async function formatPlayerCareerStats(playerID: string, seasons: any, position: string) {
    const includeFantasy = fantasyPositions.includes(position);

    // get the player's headings by calling the gamelog API
    let data;
    try {
        const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/gamelog`);
        data = await res.json(); 
        
        if (!data.seasonTypes) throw new Error("Player doesn't have stats in current season");   
    }
    catch(error) {
        // if the player has played in previous seasons, get those stats
        if (seasons.length > 1) {
            const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/gamelog?season=${extractSeasonFromURL(seasons[1].season.$ref)}`);
            data = await res.json(); 
        }
        // otherwise, send nothing
        else {
            return {
                includesFantasyData: includeFantasy,
                headings: [],
                seasons: [] 
            }
        }
    }

    // get the player's table headings
    const headings = buildHeadings(data, {}, includeFantasy);

    // replace the first category [0]
    headings.splice(0, 1, {
        category: "",
        columns: [
            {
                abbreviation: "Year",
                title: "Year"
            },
            {
                abbreviation: "Team",
                title: "Team"
            },
            {
                abbreviation: "GP",
                title: "Games Played"
            }
        ]
    });

    const output: Career = {
        includesFantasyData: includeFantasy,
        headings: headings,
        seasons: []
    };

    // reverse to show seasons in chronological order
    for (const season of seasons.reverse()) {
        // don't show preseason stats
        if (season.statistics[0].statistics.$ref.includes("types/1")) {
            continue;
        }

        const seasonURL = season.season.$ref;

        const teams = await populateTeamsArray(season, includeFantasy, headings);

        const { gamesPlayed, stats } = await formatStats(season.statistics[0].statistics.$ref, includeFantasy, headings);

        output.seasons.push({
            season: extractSeasonFromURL(seasonURL),
            statsOnTeam: teams,
            totalStats: {
                gamesPlayed: gamesPlayed,
                stats: stats
            }
        });
    }

    return output;
}

async function formatStats(statsURL: string, includeFantasy: boolean, headings: any) {
    const res = await fetch(replaceHttp(statsURL));
    const stats = await res.json();
    
    // start array with number of fantasy points
    const statsOutput: string[] = [];
 
    if (includeFantasy) {
        const { halfPPR, ppr } = calculateFantasyPoints(stats);
        statsOutput.push(halfPPR.toString(), ppr.toString());
    }
    
    // loop through all heading categories (skip first category and Fantasy if present)
    headings.map((heading: any, index: Number) => {
        if (index == 0 || heading.category == "Fantasy") {
            return [];
        }

        // loop through columns in category; find the stat value that corresponds with the column
        heading.columns.map((column: any) => {
            const statCategory = findStat(heading.category.toLowerCase(), stats);
            
            // if the category is found, push it to the output. if not, loop through the stats response until it's found
            if (statCategory) {
                const stat = findStat(column.apiName, statCategory, true, true);
                statsOutput.push(stat);
            }
            else {
                let statFound;

                for (const statCategory of stats.splits.categories) {
                    statFound = findStat(column.apiName, statCategory, true, true);

                    if (statFound) {
                        statsOutput.push(statFound);
                        break;
                    }
                }
                // if the stat wasn't found, display a dash
                statFound ?? statsOutput.push("-");
            }
        });
    });

    const gamesPlayed = getGamesPlayed(stats);

    return {
        stats: statsOutput,
        gamesPlayed: gamesPlayed
    };
}

// get the team(s) that the player played for in the season
async function populateTeamsArray(season: any, includeFantasy: boolean, headings: any) {
    const getTeams = season.statistics.filter(
        (statType: { type: string; }) => statType.type == "team"
    );

    // reverse the list to show the teams in the correct order
    const listOfTeams = [...getTeams].reverse();

    const teams = await Promise.all(
        listOfTeams.map(async (team: any) => {
            const res = await fetch(replaceHttp(team.team.$ref));
            const teamData = await res.json();

            const { gamesPlayed, stats } = await formatStats(team.statistics.$ref, includeFantasy, headings);

            return {
                abbreviation: teamData.abbreviation,
                displayName: teamData.displayName,
                logo: teamData.logos[0]?.href,
                link: `/teams/${idToName[teamData.id]}`,
                gamesPlayed: gamesPlayed,
                stats: stats
            };
        })
    );

    return teams;
}