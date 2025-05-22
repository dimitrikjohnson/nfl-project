import { TeamStatCategory } from "@/app/types/teamStats";

export default function formatTeamStats(data: TeamStatCategory[]) {
    const GAMES_PLAYED = data[0].stats[5].value;

    // function to create the stat objects that will be sent to Statistics component
    const createStatObject = (
        label: string, categoryNum: number, statNum: number, shortLabel = data[categoryNum].stats[statNum].shortDisplayName, perGame = data[categoryNum].stats[statNum].value / GAMES_PLAYED, reversedColors = false
    ) => {
        return {
            label: label,
            shortLabel: shortLabel,
            total: data[categoryNum].stats[statNum].displayValue,
            perGame: perGame.toFixed(2),
            rank: data[categoryNum].stats[statNum].rank,
            rankDisplay: data[categoryNum].stats[statNum].rankDisplayValue,
            reversedColors: reversedColors
        };
    };

    // the objects that don't use the createStatObject function don't have a perGame value
    const stats = {
        "Scoring": [
            createStatObject("Points Scored", 1, 29, "PTS", data[1].stats[30].value),
            createStatObject("Touchdowns", 1, 31, "TD")
        ],
        "Downs": [
            createStatObject("1st Downs", 10, 0, data[10].stats[0].shortDisplayName),
            {
                label: "3rd Down Conversion %",
                shortLabel: "3RDC%",
                total: data[10].stats[15].value.toFixed(2),
                rank: data[10].stats[15].rank,
                rankDisplay: data[10].stats[15].rankDisplayValue,
            },
            createStatObject("4th Down Attempts", 10, 5, "4DA"),
            {
                label: "4th Down Conversion %",
                shortLabel: "4THC%",
                total: data[10].stats[6].value.toFixed(2),
                rank: data[10].stats[6].rank,
                rankDisplay: data[10].stats[6].rankDisplayValue,
            }
        ],
        "Offense": [
            createStatObject("Offensive Plays", 1, 28, "OP"),
            createStatObject("Yards", 1, 10, "YDS", data[1].stats[11].value),
            createStatObject("Fumbles", 0, 0, "FUM", data[0].stats[0].value / GAMES_PLAYED, true),
            createStatObject("Fumbles Lost", 0, 1, "FUML", data[0].stats[1].value / GAMES_PLAYED, true),
            createStatObject("Total Giveaways", 10, 17, "GIVE", data[10].stats[17].value / GAMES_PLAYED, true)
        ],
        "Passing": [
            createStatObject("Passing Attempts", 1, 12, "PA"),
            {
                label: "Yards Per Pass Attempt",
                shortLabel: "YDS/PA",
                total: data[1].stats[40].value.toFixed(2),
                rank: data[1].stats[40].rank,
                rankDisplay: data[1].stats[40].rankDisplayValue,
            },
            createStatObject("Completions", 1, 2),
            {
                label: "Completion Percentage",
                shortLabel: "CMP%",
                total: data[1].stats[1].displayValue,
                rank: data[1].stats[1].rank,
                rankDisplay: data[1].stats[1].rankDisplayValue
            },
            createStatObject("Passing Yards", 1, 19, "PYDS", data[1].stats[22].value),
            createStatObject("Passing Touchdowns", 1, 18, "PTDS"),
            createStatObject("Interceptions", 1, 5, "INT"),
            createStatObject("Interception Percentage", 1, 4),
            createStatObject("Sacked", 1, 24, "SACK", data[1].stats[24].value / GAMES_PLAYED, true),
            {
                label: "ESPN Quarterback Rating",
                shortLabel: "ESPN QBR",
                total: data[1].stats[3].value / 100,
                rank: data[1].stats[3].rank,
                rankDisplay: data[1].stats[3].rankDisplayValue
            },
        ],
        "Rushing": [
            createStatObject("Rushing Attempts", 2, 6, "RA"),
            {
                label: "Yards Per Rush Attempt",
                shortLabel: "YDS/RA",
                total: data[2].stats[28].displayValue,
                rank: data[2].stats[28].rank,
                rankDisplay: data[2].stats[28].rankDisplayValue
            },
            createStatObject("Rushing Yards", 2, 12, "RYDS", data[2].stats[13].value),
            createStatObject("Rushing Touchdowns", 2, 11, "RTDS"),
            createStatObject("20+ Yard Runs", 2, 7, "20+ YDS"),
            createStatObject("Stuffed Runs", 2, 14, "STUFF", data[2].stats[14].value / GAMES_PLAYED, true)
        ],
        "Defense": [
            createStatObject("Tackles for Loss", 4, 20),
            createStatObject("Sacks", 4, 14),
            createStatObject("Passes Defended", 4, 12, "PD"),
            createStatObject("Interceptions", 5, 0, "INT"),
            createStatObject("Fumble Recoveries", 7, 2),
            createStatObject("Takeaways", 10, 20, "TAKE"),
            {
                label: "Defensive Touchdowns",
                shortLabel: "DEF TD",
                total: data[4].stats[6].displayValue,
                rank: data[4].stats[6].rank,
                rankDisplay: data[4].stats[6].rankDisplayValue
            },
        ],
        "Special Teams": [
            {
                label: "Extra Point Percentage",
                shortLabel: "XP%",
                total: (data[6].stats[3].value).toFixed(2),
                rank: data[6].stats[3].rank,
                rankDisplay: data[6].stats[3].rankDisplayValue
            },
            createStatObject("Field Goal Attempts", 6, 9),
            createStatObject("Field Goals Made", 6, 21),
            {
                label: "Field Goal Percentage",
                shortLabel: "FG%",
                total: (data[6].stats[18].value).toFixed(2),
                rank: data[6].stats[18].rank,
                rankDisplay: data[6].stats[18].rankDisplayValue
            },
            {
                label: "Longest Field Goal Made",
                shortLabel: "LONG FG",
                total: data[6].stats[37].displayValue,
                rank: data[6].stats[37].rank,
                rankDisplay: data[6].stats[37].rankDisplayValue
            }
        ]
    };

    return stats
}