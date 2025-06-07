'use server';
import {cache} from 'react';

const cacheTeam = cache(async (teamID: string) => {
	const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}`, {
        method: "GET"
    });

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team data')

    const data = await res.json()
    return data.team
});

export default cacheTeam;