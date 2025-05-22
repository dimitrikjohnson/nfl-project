import getCurrentSeason from "@/app/helpers/getCurrentSeason";
import formatTeamStats from "@/app/formatAPIcalls/formatTeamStats";

export default async function getTeamStats(teamID: string) {
    const seasonPromise = await getCurrentSeason();
    const currentSeason = seasonPromise.year;

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

    return formatTeamStats(data);
}