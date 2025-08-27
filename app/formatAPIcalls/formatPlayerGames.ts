import { fantasyPositions } from "@/app/data/fantasyPositions";
import { calculateYearFantasyPoints, calculateGameFantasyPoints } from "@/app/helpers/calculateFantasyPoints";
import { idToName } from "@/app/helpers/idToName";
import getPlayerSeasonStats from "@/app/apiCalls/getPlayerSeasonStats";
import { Headings, Rows } from "../types/gameAndCareerStats";

export default async function formatPlayerGames(data: any, position: string, playerID: string) {
    // get the currently fetched season
    const selectedSeason = data.filters[1].value;

    // populate array with all seasons the player has played in
    let seasonOptions = data.filters[1].options.map(
        (season: any) => season.displayValue
    );

    let seasonTypes = [];

    // if they have no data to display, return an empty object
    if (!data.seasonTypes) {
        return {
            season: selectedSeason,
            seasonOptions: seasonOptions,
            seasonTypes: []
        }
    }

    for (const seasonType of data.seasonTypes) {
        const typeName = seasonType.displayName.includes("Regular Season") ? "Regular Season" : "Postseason";
        
        // we don't need fantasy stats in postseason
        const includeFantasy = typeName == "Postseason" ? false : fantasyPositions.includes(position);

        const rows = buildRows(data.events, seasonType, includeFantasy, data.names);

        let totals = seasonType.summary?.stats?.[0].stats;

        if (includeFantasy) {
            const totalFantasyStats = calculateYearFantasyPoints(await getPlayerSeasonStats(selectedSeason, "2", playerID));
            const { halfPPR, ppr } = totalFantasyStats;

            totals.unshift(halfPPR, ppr);
        }

        seasonTypes.push({
            name: typeName,
            headings: buildHeadings(data, seasonType, includeFantasy),
            stats: rows,
            totals: totals,
            includesFantasyData: includeFantasy
        });
    }

    return {
        season: selectedSeason,
        seasonOptions: seasonOptions,
        seasonTypes: seasonTypes
    }
}

function buildHeadings(data: any, seasonType: any, includeFantasy: boolean) {
    let team;

    // get the team they played for in the selected season
    if (seasonType.displayTeam) {
        
        // and determine if they played for multiple teams that year
        if (seasonType.displayTeam.includes("/")) { 
            team = "Teams: ";
        }
        else {
            team = "Team: ";
        }

        team += seasonType.displayTeam;
    }
    else {
        team = "";
    }

    const headings = [
        {
            category: team,
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
                },
                {
                    abbreviation: "ppr",
                    title: "Points Per Reception"
                }
            ]
        });
    }
    
    const statAbbreviations = data.labels;
    const statFullName = data.displayNames;
    const statAPInames = data.names;

    let labelIndex = 0;

    for (const category of data.categories) {
        const count = category.count; // number of labels in category

        const statsInCategory = statAbbreviations.slice(labelIndex, labelIndex + count);
        const statsFullInCategory = statFullName.slice(labelIndex, labelIndex + count);
        const statNamesInCategory = statAPInames.slice(labelIndex, labelIndex + count);

        let categoryOutput: Headings = {
            category: category.displayName,
            columns: []
        }

        let index = 0;

        for (const stat of statsInCategory) {
            categoryOutput.columns.push({
                abbreviation: stat,
                title: statsFullInCategory[index],
                apiName: statNamesInCategory[index]
            });

            index += 1;
        }
 
        headings.push(categoryOutput);

        labelIndex += count;
    } 

    return headings;
}

function buildRows(allGames: any, seasonType: any, includeFantasy: boolean, valueNames: string[]) {
    const allRows = [];
    
    // loop through array backwards to show games in chronological order
    for (const game of (seasonType.categories[0].events).reverse()) {
        // get game info (week, opponent, score, etc.)
        const gameInfo = allGames[game.eventId];

        if (gameInfo.eventNote == "PRO BOWL") continue;

        let rowData: Rows = {
            id: game.eventId,
            // if regular season, return week number. if postseason, return event note (e.g. AFC Wild Card Playoffs)
            week: seasonType.categories[0].splitType == "2" ? gameInfo.week : gameInfo.eventNote,  
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
            const { halfPPR, ppr } = calculateGameFantasyPoints(game.stats, valueNames);
            rowData.stats.push(halfPPR, ppr);
        }

        rowData.stats.push(...game.stats);

        allRows.push(rowData);
    }

    return allRows;
}