import { PlayerOverview } from "@/app/types/player";
import getPlayerSeasonStats from "@/app/apiCalls/getPlayerSeasonStats";
import { calculateYearFantasyPoints } from "@/app/helpers/calculateFantasyPoints";
import { fantasyPositions } from "@/app/data/fantasyPositions";
import getGamesPlayed from "@/app/helpers/getGamesPlayed";

// type for the data that is pulled from API response
interface Stats {
    displayName: string;
    statistics: {
        name: string;
        displayName: string;
        shortDisplayName: string;
        description: string;
        abbreviation: string;
        value: number;
        displayValue: string;
        rank: number;
        rankDisplayValue: string;
    }[]
}

export default async function formatPlayerStatsSummary(summary: Stats, playerID: string, positionAbbreviation: string) {
    const output: PlayerOverview["statsSummary"] = {
        heading: formatHeading(summary.displayName),
        stats: []
    };

    // the rank for some stats are inaccurate/misleading, so I exclude them
    const excludeRank = [
        "yardsPerReception",
        "yardsPerRushAttempt",   
    ];

    // 'interceptions' rank should be excluded for QBs but not defensive players
    if (positionAbbreviation == "QB") {
        excludeRank.push("interceptions");
    }

    for (const stat of summary.statistics) {
        output.stats.push({
            label: formatlabel(stat.displayName), 
            value: stat.displayValue,
            rank: excludeRank.includes(stat.name) ? false : stat.rank,
            rankDisplay: stat.rankDisplayValue
        });
    }

    if (summary.displayName != "Stats") {
        const statsData = await getPlayerSeasonStats(
            getSeason(output.heading), 
            output.heading.includes("Preseason") ? "1" : "2",
            playerID
        );
        const gamesPlayed = getGamesPlayed(statsData);
        
        output.stats.unshift({
            label: "Games Played", 
            value: gamesPlayed
        });

        if (fantasyPositions.includes(positionAbbreviation)) {
            const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/overview`);
            const data = await res.json();
            const fantasy = data.fantasy;

            // calculate the player's number of fantasy points per game
            const ppg = Number(calculateYearFantasyPoints(statsData).halfPPR) / gamesPlayed;
            
            // then format it
            const ppgFormatted = Number.isInteger(ppg) ? ppg : ppg.toFixed(2);

            output.stats.push(
                {
                    label: "Fantasy Rank", 
                    value: fantasy?.draftRank || "-"
                },
                {
                    label: `Fantasy ${positionAbbreviation} Rank`, 
                    value: fantasy?.positionRank || "-",
                    giveValueColor: true
                },
                {
                    label: "Fantasy PTS / Game", 
                    // ppgFormatted will be NaN if the player hasn't reg season played a game yet
                    value: ppgFormatted == "NaN" ? "--" : ppgFormatted.toString() 
                }
            );  
        } 
    }

    return output;
}

function formatHeading(heading: string) {
    if (heading == "Stats") { return "Career Summary" }

    if (heading.includes("preseason")) { 
        return `${ getSeason(heading) } Preseason Summary`;
    }

    return `${ getSeason(heading) } Summary`;
}

// remove/replace certain phrases in labels
export function formatlabel(label: string) {
    let outputLabel = label;

    if (outputLabel.includes("Touchdowns")) { 
        outputLabel = outputLabel.replace("Touchdowns", "TD");                  // replace "Touchdowns" with "TD"
    } 
    if (outputLabel.includes("Per")) { 
        outputLabel = outputLabel.replace("Per ", "/ ");                          // replace "Per" with "/"
    } 
    if (outputLabel.includes("Rush Attempt")) { 
        outputLabel = outputLabel.replace("Rush Attempt", "Rush");              // replace "Rush Attempt" with "Rush"
    } 
    if (outputLabel.includes("Rushing Attempts")) { 
        outputLabel = outputLabel.replace("Rushing Attempts", "Rush Attempts");  // replace "Rushing Attempts" with "Rush Attempts"
    }
    if (outputLabel.includes("Percentage")) { 
        outputLabel = outputLabel.replace("Percentage", "%");  // replace "Rushing Attempts" with "Rush Attempts"
    }
    return outputLabel;
}

// extract the season from the heading (will only be called if the season is present)
function getSeason(heading: string) {
    const parts = heading.split(" ");
    const season = parts[0];
    return season;
}