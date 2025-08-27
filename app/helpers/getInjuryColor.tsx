export default function getInjuryColor(injuryStatus?: string) {
    if (injuryStatus == "Q") { return "bg-yellow-500" } else
    if (injuryStatus == "D") { return "bg-orange-500" } else
    return "bg-red-500"
}