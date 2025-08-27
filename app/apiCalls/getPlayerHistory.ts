import { idToName } from '@/app/helpers/idToName';
import getTeam from '@/app/apiCalls/getTeam';

// get the list of teams that a player has played for
export default async function getPlayerHistory(playerID: string) {
    const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/bio`, { 
        method: 'GET' 
    });
    const { teamHistory } = await res.json();

    const output = [];

    // teamHistory is undefined for newly drafted rookies  
    if (teamHistory) { 
        for (const team of teamHistory) {
            const teamID = team.id;
            
            output.push({
                name: team.displayName,
                currentName: idToName[teamID], // for instances when a team's name has changed, get ID and convert it to team's current name
                logo: team.logo ?? (await getTeam({ teamID })).logo, // if logo isn't in response (happens for older teams), get the current logo
                logoAlt: idToName[teamID].charAt(0).toUpperCase() + idToName[teamID].slice(1) + " logo",
                seasons: team.seasons,
                seasonCount: team.seasonCount
            });
        }    
    }
    
    return output;
}