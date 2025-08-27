import { fantasyPositions } from '@/app/data/fantasyPositions';
import formatPlayerUpcomingGame from '@/app/formatAPIcalls/formatPlayerUpcomingGame';
import formatPlayerRecentGames from '@/app/formatAPIcalls/formatPlayerRecentGames';

export default async function getPlayerRecentAndUpcomingGames(playerID: string, type: "recent" | "upcoming") {
    const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/overview`);
    const data = await res.json();

    const positionRes = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${playerID}`);
    const positionData = await positionRes.json();

    const includeFantasy = fantasyPositions.includes(positionData.position.abbreviation);

    // format the response based on what's needed
    if (type == "recent" && data.gameLog?.events) 
        return formatPlayerRecentGames(data.gameLog, includeFantasy);

    if (type == "upcoming" && (data.nextGame.displayName == "Next Game" || data.nextGame.displayName == "Current Game")) 
        return await formatPlayerUpcomingGame(data.nextGame, includeFantasy);

    return undefined;
}