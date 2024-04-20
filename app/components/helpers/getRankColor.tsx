export default function getRankColor(rankValue, colorsReversed) {
    if (colorsReversed) {
        if (rankValue <= 8) { return "text-red-500" } else
        if (rankValue <= 16) { return "text-orange-500" } else
        if (rankValue <= 24) { return "text-yellow-500" } else
        return "text-green-500"
    }
    
    if (rankValue <= 8) { return "text-green-500" } else
    if (rankValue <= 16) { return "text-yellow-500" } else
    if (rankValue <= 24) { return "text-orange-500" } else
    return "text-red-500"
}