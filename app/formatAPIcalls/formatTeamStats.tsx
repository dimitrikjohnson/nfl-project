import { TeamStatCategory } from "@/app/types/teamStats";

export default function formatTeamStats(data: TeamStatCategory[]) {
    const GAMES_PLAYED = data[0].stats[5].value;

    // function to create the stat objects that will be sent to Statistics component
    const createStatObject = (label: string, categoryNum: number, statName: string, shortLabel?: string, perGame?: number | string, reversedColors = false) => {
        const statData = findStat(data, categoryNum, statName, shortLabel);
        return {
            label: label,
            shortLabel: statData.shortLabel,
            total: statData.displayValue, 
            perGame: perGame == "N/A" ? undefined : (statData.value / GAMES_PLAYED).toFixed(2), // some stats don't need a per game value
            rank: statData.rank, 
            rankDisplay: statData.rankDisplay, 
            reversedColors: reversedColors
        };
    };

    // the objects that don't use createStatObject() have specialized values
    const stats = {
        "Scoring": [
            {
                label: "Red Zone Scoring %",
                shortLabel: "RZ%",
                total: data[10].stats[12].value.toFixed(2),
                rank: data[10].stats[12].rank,
                rankDisplay: data[10].stats[12].rankDisplayValue,
            },
            {
                label: "Red Zone Touchdown %",
                shortLabel: "RZTD%",
                total: data[10].stats[13].value.toFixed(2),
                rank: data[10].stats[13].rank,
                rankDisplay: data[10].stats[13].rankDisplayValue,
            },
            createStatObject("Points Scored", 1, "totalPoints", "PTS", data[1].stats[30].value),
            createStatObject("Touchdowns", 1, "totalTouchdowns", "TD")
        ],
        "Downs": [
            createStatObject("1st Downs", 10, "firstDowns", data[10].stats[0].shortDisplayName),
            {
                label: "3rd Down Conversion %",
                shortLabel: "3RDC%",
                total: data[10].stats[15].value.toFixed(2),
                rank: data[10].stats[15].rank,
                rankDisplay: data[10].stats[15].rankDisplayValue,
            },
            createStatObject("4th Down Attempts", 10, "fourthDownAttempts", "4DA"),
            {
                label: "4th Down Conversion %",
                shortLabel: "4THC%",
                total: data[10].stats[6].value.toFixed(2),
                rank: data[10].stats[6].rank,
                rankDisplay: data[10].stats[6].rankDisplayValue,
            }
        ],
        "Offense": [
            createStatObject("Offensive Plays", 1, "totalOffensivePlays", "OP"),
            createStatObject("Yards", 1, "netTotalYards", "YDS", data[1].stats[11].value),
            createStatObject("Fumbles", 0, "fumbles", "FUM", undefined, true),
            createStatObject("Fumbles Lost", 0, "fumblesLost", "FUML", undefined, true),
            createStatObject("Total Giveaways", 10, "totalGiveaways", "GIVE", undefined, true)
        ],
        "Passing": [
            createStatObject("Passing Attempts", 1, "passingAttempts", "PA"),
            {
                label: "Yards Per Pass Attempt",
                shortLabel: "YDS/PA",
                total: data[1].stats[40].value.toFixed(2),
                rank: data[1].stats[40].rank,
                rankDisplay: data[1].stats[40].rankDisplayValue,
            },
            createStatObject("Completions", 1, "completions"),
            createStatObject("Completion Percentage", 1, "completionPct", undefined, "N/A"),
            createStatObject("Passing Yards", 1, "passingYards", "PYDS"),
            createStatObject("Passing Touchdowns", 1, "passingTouchdowns", "PTDS"),
            createStatObject("Interceptions", 1, "interceptions", "INT"),
            createStatObject("Interception Percentage", 1, "interceptionPct", undefined, "N/A"),
            createStatObject("Sacked", 1, "sacks", "SACK", "N/A", true),
            createStatObject("Quarterback Rating", 1, "QBRating", "QBR", "N/A"),
        ],
        "Rushing": [
            createStatObject("Rushing Attempts", 2, "rushingAttempts", "RA"),
            createStatObject("Yards Per Rush Attempt", 2, "yardsPerRushAttempt", undefined, "N/A"),
            createStatObject("Rushing Yards", 2, "rushingYards", "RYDS", data[2].stats[13].value),
            createStatObject("Rushing Touchdowns", 2, "rushingTouchdowns", "RTDS"),
            createStatObject("20+ Yard Runs", 2, "rushingBigPlays", "20+ YDS"),
            createStatObject("Stuffed Runs", 2, "stuffs", "STUFF", undefined, true)
        ],
        "Defense": [
            createStatObject("Tackles for Loss", 4, "tacklesForLoss"),
            createStatObject("Sacks", 4, "sacks"),
            createStatObject("Passes Defended", 4, "passesDefended", "PD"),
            createStatObject("Interceptions", 5, "interceptions", "INT"),
            createStatObject("Fumble Recoveries", 7, "fumbleRecoveries"),
            createStatObject("Takeaways", 10, "totalTakeaways", "TAKE"),
            createStatObject("Defensive Touchdowns", 4, "defensiveTouchdowns", "DEF TD", "N/A")
        ],
    };

    return stats;
}

function findStat(data: any, categoryNum: number, statName: string, shortLabel?: string) {
    const category = data[categoryNum].stats.find(
        (stat: { name: string; }) => stat.name == statName
    );

    return {
        shortLabel: shortLabel ?? category.shortDisplayName,
        displayValue: category.displayValue,
        value: category.value,
        rank: category.rank,
        rankDisplay: category.rankDisplayValue
    }
}