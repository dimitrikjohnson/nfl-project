import formatPlayerGames from "@/app/formatAPIcalls/formatPlayerGames";

export default async function getPlayerGames(playerID: string, season?: string | null) {
    let url = `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/gamelog`;

    // if season is present, add it to the url
    season && (url += `?season=${season}`);
    
    const res = await fetch(url);
        
    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to get player gamelog');

    // get the player's position to determine if fantasy data needs to be displayed
    const positionRes = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${playerID}`);
    const data = await res.json();
    const positionData = (await positionRes.json()).position;

    const positionAbbreviation = positionData.abbreviation;
    
    return await formatPlayerGames(data, positionAbbreviation, playerID);
}