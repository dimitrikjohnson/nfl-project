import fetchCurrentSeason from "./getCurrentSeason";
import formatTeamStats from "../formatAPIcalls/formatTeamStats";

export default async function getTeamStats( teamID ) {
    const currentSeason = await fetchCurrentSeason();

    // if there's an error, decrease the current season number by 1
    // the only time there should be an error is during a small window in the offseason when the season number changes in the API response
    let res;
    try {
        res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/statistics`, 
            { method: "get" }
        );
        if (!res.ok) throw new Error("Something went wrong");
    }
    catch (error) {
        res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason-1}/types/2/teams/${teamID}/statistics`, 
            { method: "get" }
        );
        if (!res.ok) throw new Error('Failed to fetch the team stats');
    }

    const dataJson = await res.json();

    const data = dataJson.splits.categories;

    return await formatTeamStats(data);
}