import { fantasyPositions } from '@/app/data/fantasyPositions';
import formatPlayerUpcomingGame from '@/app/formatAPIcalls/formatPlayerUpcomingGame';
import formatPlayerRecentGames from '@/app/formatAPIcalls/formatPlayerRecentGames';
import getPlayer from './getPlayer';

export default async function getPlayerRecentAndUpcomingGames(playerID: string, type: "recent" | "upcoming") {
    const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/overview`);
    const data = await res.json();

    const player = await getPlayer({ playerID });

    const includeFantasy = fantasyPositions.includes(player.position.abbreviation);

    // format the response based on what's needed
    if (type == "recent" && data.gameLog?.events) 
        return formatPlayerRecentGames(data.gameLog, includeFantasy);

    if (type == "upcoming" && (data.nextGame.displayName == "Next Game" || data.nextGame.displayName == "Current Game")) 
        return await formatPlayerUpcomingGame(data.nextGame, player, includeFantasy);

    return undefined;
}