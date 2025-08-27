// get a player's stats for a specific season

export default async function getPlayerSeasonStats(season: string, seasonType: string, playerID: string) {
    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${season}/types/${seasonType}/athletes/${playerID}/statistics/0`);
    
    if (!res.ok) { 
        // there will be an error for rookies who haven't played a game yet or players who don't have stats to show
        return [];
    }
    
    const data = await res.json()
    return data;
}