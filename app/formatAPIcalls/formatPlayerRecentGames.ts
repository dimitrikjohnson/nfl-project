import { Headings, Rows } from "@/app/types/gameAndCareerStats";
import { idToName } from "@/app/helpers/idToName";
import { PlayerOverview } from "../types/player";
import getMissingFantasyStats from "../helpers/getMissingFantasyStats";

export type RecentGamesType = {
    headings: Headings[],
    rows: Rows[]
};

export default async function formatPlayerRecentGames(gamelog: any, player: PlayerOverview, includeFantasy: boolean): Promise<RecentGamesType> {
    const headings = buildHeadings(gamelog.statistics[0], includeFantasy);
    
    const rows = await buildRows(gamelog.statistics[0].events, gamelog.events, player, includeFantasy, gamelog.statistics[0].names);

    return { headings, rows }
}

function buildHeadings(data: any, includeFantasy: boolean) {
    const headings = [
        {
            category: "",
            columns: [
                {
                    abbreviation: "WK",
                    title: "Week"
                },
                {
                    abbreviation: "Opponent",
                    title: "Opponent"
                },
                {
                    abbreviation: "Result",
                    title: "Result"
                } 
            ]
        }
    ];

    if (includeFantasy) {
        headings.push({
            category: "Fantasy",
            columns: [ 
                {
                    abbreviation: "half-ppr",
                    title: "Half Points Per Reception"
                }
            ]
        });
    }
    
    const statAbbreviations = data.labels;
    const statFullName = data.displayNames;
    const statAPInames = data.names;

    let categoryOutput: Headings = {
        category: data.displayName,
        columns: []
    }

    let index = 0;

    // skip these stats to conserve space
    const statsToExclude = ["yardsPerPassAttempt", "QBRating", "adjQBR"];

    for (const stat of statAbbreviations) {
        if (statsToExclude.includes(statAPInames[index])) { 
            index += 1;
            continue; 
        }

        categoryOutput.columns.push({
            abbreviation: stat,
            title: statFullName[index],
            apiName: statAPInames[index]
        });

        index += 1;
    }
 
    headings.push(categoryOutput);

    return headings;
}

async function buildRows(allGamesStats: any, allGames: any, player: PlayerOverview, includeFantasy: boolean, valueNames: string[]) {
    const allRows = [];
     
    for (const game of allGamesStats) {
        // get game info (week, opponent, score, etc.)
        const gameInfo = allGames[game.eventId];

        if (gameInfo.eventNote == "PRO BOWL") continue;

        let rowData: Rows = {
            id: game.eventId,
            // if regular season, return week number. if postseason, return event note (e.g. AFC Wild Card Playoffs)
            week: gameInfo.eventNote ? gameInfo.eventNote : gameInfo.week,  
            atVs: gameInfo.atVs,
            score: gameInfo.score,
            result: gameInfo.gameResult,
            opp: {
                link: `/teams/${idToName[gameInfo.opponent.id]}`,
                name: gameInfo.opponent.displayName,
                abbreviation: gameInfo.opponent.abbreviation,
                logo: gameInfo.opponent.logo
            },
            stats: []
        }

        if (includeFantasy) {
            const halfPPR = await getMissingFantasyStats(game.eventId, player.id, player.team.id) //calculateGameFantasyPoints(game.stats, valueNames);
            rowData.stats.push(halfPPR);
        }

        const ypaIndex = valueNames.indexOf("yardsPerPassAttempt");

        for (const index in game.stats) {
            // don't add the yardsPerPassAttempt value to the stats
            if (index == ypaIndex.toString()) continue;
            
            rowData.stats.push(game.stats[index])
        }

        allRows.push(rowData);
    }

    return allRows;
}