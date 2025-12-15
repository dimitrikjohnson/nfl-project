const tier1 = "text-green-800 dark:text-green-400";
const tier2 = "text-yellow-800 dark:text-yellow-300";
const tier3 = "text-orange-800 dark:text-orange-400";
const tier4 = "text-red-700 dark:text-red-300";

function getTeamRankColor(rankValue: number, colorsReversed: boolean) {
    if (colorsReversed) {
        if (rankValue <= 8) { return tier4 } else
        if (rankValue <= 16) { return tier3 } else
        if (rankValue <= 24) { return tier2 } else
        return tier1
    }
    
    if (rankValue <= 8) { return tier1 } else
    if (rankValue <= 16) { return tier2 } else
    if (rankValue <= 24) { return tier3 } else
    return tier4
}

function getPlayerRankColor(rankValue: number) {
    if (rankValue == 0) { return "" }
    if (rankValue <= 12) { return tier1 } else
    if (rankValue <= 24) { return tier2 } else
    if (rankValue <= 36) { return tier3 } else
    return tier4
}

function getUserRankColor(rankValue: number, totalUsers: number) {
    if (rankValue <= 4) { return tier1 } else
    if (rankValue >= totalUsers-2) { return tier4 } else
    return "text-gray-600 dark:text-lighterSecondaryGrey";
}

export { getTeamRankColor, getPlayerRankColor, getUserRankColor }