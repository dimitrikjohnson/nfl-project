import allTeams from '@/app/formatAPIcalls/allTeams';
import { Team } from "@/app/types/team";

export default async function getAllTeams(): Promise<Team[]> {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams`, {
        method: "GET"
    })

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch teams')

    let data = await res.json();
    
    return allTeams(data);
}