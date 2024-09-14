import formatLeaders from '@/app/formatAPIcalls/formatLeaders';
import getCurrentSeason from '../helpers/getCurrentSeason';

export default async function getTeamLeaders(teamID, getLeadersOverview) {
    const currentSeason = await getCurrentSeason();
    let displayedSeason = null;
    
    // if there's an error, decrease the current season number by 1
    // the only time there should be an error is during a small window in the offseason when the season number changes in the API response
    let res;
    try {
        res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/leaders`, { 
            method: "get" 
        });
        if (!res.ok) throw new Error("Something went wrong");
    }
    catch (error) {
        res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason-1}/types/2/teams/${teamID}/leaders`, { 
            method: "get" 
        });
        displayedSeason = currentSeason-1;
    }
    
    const data = await res.json();

    return await formatLeaders(displayedSeason, data, getLeadersOverview);
}