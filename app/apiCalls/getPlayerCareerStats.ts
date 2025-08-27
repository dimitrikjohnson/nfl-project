import formatPlayerCareerStats from '@/app/formatAPIcalls/formatPlayerCareerStats';

export default async function getPlayerCareerStats(playerID: string) {
    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${playerID}/statisticslog`, { 
        method: 'GET' 
    });
    const { entries } = await res.json();

    const positionRes = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${playerID}`);
    const positionData = await positionRes.json();

    return await formatPlayerCareerStats(playerID, entries, positionData.position.abbreviation);
}