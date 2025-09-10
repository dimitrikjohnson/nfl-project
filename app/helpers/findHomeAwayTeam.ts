// distinguish teams in "competitors" arrays
export default function findHomeAwayTeam(teams: any, homeAway: string) {
    return teams.find((competitor: { homeAway: string }) => competitor.homeAway == homeAway);
}