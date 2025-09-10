// get the secondary logo for the Giants and Jets
export default function getTeamLogo(team: any) {
    if (team.shortDisplayName === "Giants" || team.shortDisplayName === "Jets") {
        return team.logos?.[1]?.href
    }
    return team.logos?.[0]?.href
}