import { calculateFantasyPoints } from "./calculateFantasyPoints";

// some this gets all the stats needed to calculate fantasy points on a player's overview page
export default async function getMissingFantasyStats(gameID: string, playerID: string, playerTeamID: string) {
    const playerGameStatsRes = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameID}/competitions/${gameID}/competitors/${playerTeamID}/roster/${playerID}/statistics/0`);
    const playerGameStats = await playerGameStatsRes.json();

    const pts = calculateFantasyPoints(playerGameStats).halfPPR;
    return pts.toString();
}